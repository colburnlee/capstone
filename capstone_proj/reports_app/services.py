import requests
from django.conf import settings

def qbo_api_call(access_token, realm_id):
    """ API Call for V1 OAuth
    
    """
    
    if settings.ENVIRONMENT == 'production':
        base_url = settings.QBO_BASE_PROD
    else:
        base_url =  settings.QBO_BASE_SANDBOX

    route = '/v3/company/{0}/companyinfo/{0}'.format(realm_id)
    auth_header = 'Bearer {0}'.format(access_token)
    headers = {
        'Authorization': auth_header, 
        'Accept': 'application/json'
    }
    return requests.get('{0}{1}'.format(base_url, route), headers=headers)

def manual_call(access_token, realm_id, service, customer):
    """ API Call for a specific invoice retrieval"""
    
    if settings.ENVIRONMENT == 'production':
        base_url = settings.QBO_BASE_PROD
    else:
        base_url =  settings.QBO_BASE_SANDBOX
    route = '/v3/company/{0}/{1}/{2}?minorversion=63'.format(realm_id, service, customer) 
    auth_header = 'Bearer {0}'.format(access_token)

    # route format # /v3/company/<realm_id>/invoice/<invoiceId>?minorversion=63
    # /v3/company/4620816365212855650/query?query=select * from Customer Where Active = True&minorversion=63
    # print(base_url+route)
    # print(auth_header)

    headers = {
        'Authorization': auth_header, 
        'Accept': 'application/json'
    }
    return requests.get('{0}{1}'.format(base_url, route), headers=headers)