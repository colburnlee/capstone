# Create your views here.
from __future__ import absolute_import
from cgi import test
from http.client import HTTPResponse
from pandas import json_normalize

from requests import HTTPError
import json
import requests

from intuitlib.client import AuthClient
from intuitlib.migration import migrate
from intuitlib.enums import Scopes
from intuitlib.exceptions import AuthClientError

from quickbooks import QuickBooks
from quickbooks.objects.customer import Customer
from quickbooks.objects.invoice import Invoice
from quickbooks.objects.bill import Bill

from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError, JsonResponse
from django.conf import settings
from django.core import serializers

from reports_app.services import qbo_api_call, manual_call

auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT,
    )

# Create your views here.
def index(request):
    return render(request, 'reports_app/index.html')

def dashboard(request):
    return render(request, 'reports_app/dashboard.html')

def oauth(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT,
    )

    url = auth_client.get_authorization_url([Scopes.ACCOUNTING])
    print(url)
    request.session['state'] = auth_client.state_token
    return redirect(url)

def openid(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT,
    )

    url = auth_client.get_authorization_url([Scopes.OPENID, Scopes.EMAIL])
    request.session['state'] = auth_client.state_token
    return redirect(url)

def callback(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT, 
        state_token=request.session.get('state', None),
    )

    state_tok = request.GET.get('state', None)
    error = request.GET.get('error', None)
    
    if error == 'access_denied':
        return redirect('app:index')
    
    if state_tok is None:
        return HttpResponseBadRequest()
    elif state_tok != auth_client.state_token:  
        return HttpResponse('unauthorized', status=401)
    
    auth_code = request.GET.get('code', None)
    realm_id = request.GET.get('realmId', None)
    request.session['realm_id'] = realm_id

    if auth_code is None:
        return HttpResponseBadRequest()

    try:
        auth_client.get_bearer_token(auth_code, realm_id=realm_id)
        request.session['access_token'] = auth_client.access_token
        request.session['refresh_token'] = auth_client.refresh_token
        request.session['id_token'] = auth_client.id_token
    except AuthClientError as e:
        # just printing status_code here but it can be used for retry workflows, etc
        print(e.status_code)
        print(e.content)
        print(e.intuit_tid)
    except Exception as e:
        print(e)
    return redirect('reports_app:connected')

def connected(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT, 
        access_token=request.session.get('access_token', None), 
        refresh_token=request.session.get('refresh_token', None), 
        id_token=request.session.get('id_token', None),
    )

    if auth_client.id_token is not None:
        return render(request, 'reports_app/dashboard.html', context={'openid': True})
    else:
        return render(request, 'reports_app/dashboard.html', context={'openid': False})

def qbo_request(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT, 
        access_token=request.session.get('access_token', None), 
        refresh_token=request.session.get('refresh_token', None), 
        realm_id=request.session.get('realm_id', None),
    )

    if auth_client.access_token is not None:
        access_token = auth_client.access_token

    if auth_client.realm_id is None:
        raise ValueError('Realm id not specified.')
    response = qbo_api_call(auth_client.access_token, auth_client.realm_id)
    
    if not response.ok:
        return HttpResponse(' '.join([response.content, str(response.status_code)]))
    else:
        return HttpResponse(response.content)

def user_info(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT, 
        access_token=request.session.get('access_token', None), 
        refresh_token=request.session.get('refresh_token', None), 
        id_token=request.session.get('id_token', None),
    )

    try:
        response = auth_client.get_user_info()
    except ValueError:
        return HttpResponse('id_token or access_token not found.')
    except AuthClientError as e:
        print(e.status_code)
        print(e.intuit_tid)
    return HttpResponse(response.content)
        
def refresh(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT, 
        access_token=request.session.get('access_token', None), 
        refresh_token=request.session.get('refresh_token', None), 
    )

    try:
        auth_client.refresh() 
    except AuthClientError as e:
        print(e.status_code)
        print(e.intuit_tid)
    return HttpResponse(auth_client.refresh_token, content_type="application/json")

def revoke(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET,     
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT, 
        access_token=request.session.get('access_token', None), 
        refresh_token=request.session.get('refresh_token', None), 
    )
    try:
        is_revoked = auth_client.revoke()
    except AuthClientError as e:
        print(e.status_code)
        print(e.intuit_tid)
    return HttpResponse('Revoke successful')


def migration(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT,
    )
    try:
        migrate(
            settings.CONSUMER_KEY, 
            settings.CONSUMER_SECRET, 
            settings.ACCESS_KEY, 
            settings.ACCESS_SECRET, 
            auth_client, 
            [Scopes.ACCOUNTING]
        )
    except AuthClientError as e:
        print(e.status_code)
        print(e.intuit_tid)
    return HttpResponse('OAuth2 refresh_token {0}'.format(auth_client.refresh_token))


def invoice(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT,
    )
    client = QuickBooks(
        auth_client=auth_client,
        refresh_token=request.session.get('refresh_token', None),
        company_id=settings.COMPANY_ID,
        minorversion=63
    )

    
    
    # Get customer invoices ordered by TxnDate
    invoices = Invoice.filter(order_by='TxnDate', qb=client)
    invoice_response = []

    for invoice in invoices:
        invoice = invoice.to_json()
        invoice = json.loads(invoice)
        invoice_response.append(json.dumps(invoice))
    
    token = request.session.get('refresh_token', None)
    print(token)
    # print(invoice_response)
    return JsonResponse(invoice_response, safe=False)


def list_customers(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT,
    )
    client = QuickBooks(
        auth_client=auth_client,
        refresh_token=request.session.get('refresh_token', None),
        company_id=settings.COMPANY_ID,
        minorversion=63
    )
    customers = Customer.filter(Active=True, qb=client)
    customer_response =  [customer.to_json() for customer in customers]

    # customer_response = json.dumps(customers)

    return JsonResponse(customer_response, safe=False)

def list_bills(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT,
    )
    client = QuickBooks(
        auth_client=auth_client,
        refresh_token=request.session.get('refresh_token', None),
        company_id=settings.COMPANY_ID,
        minorversion=63
    )
    bills = Bill.filter(qb=client)
    print(request)
    return HttpResponse(bills, content_type="application/json")

def company_lookup(request):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT,
    )
    client = QuickBooks(
        auth_client=auth_client,
        refresh_token=request.session.get('refresh_token', None),
        company_id=settings.COMPANY_ID,
        minorversion=63
    )
    print(f"finance ID: {request.finance_id}")
    customers = Customer.filter(Id=request.finance_id, qb=client)
    return HttpResponse(customers, content_type="application/json")

def manual_invoice(request, transaction_number=False):
    auth_client = AuthClient(
        settings.CLIENT_ID, 
        settings.CLIENT_SECRET, 
        settings.REDIRECT_URI, 
        settings.ENVIRONMENT, 
        access_token=request.session.get('access_token', None), 
        refresh_token=request.session.get('refresh_token', None), 
        realm_id=request.session.get('realm_id', None),
    )

    if auth_client.access_token is not None:
        access_token = auth_client.access_token

    if auth_client.realm_id is None:
        raise ValueError('Realm id not specified.')
    response = manual_call(auth_client.access_token, auth_client.realm_id, 'invoice', transaction_number)
    # print(response)
    # print(settings.COMPANY_ID)
    
    if not response.ok:
        return HttpResponse(' '.join([response.content, str(response.status_code)]))
    else:
        return HttpResponse(response.content, content_type="application/json")
