from django.urls import path, re_path

from . import views

app_name = 'reports_app'

urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('company_lookup/<int:finance_id>', views.company_lookup, name='company_lookup'),
    re_path(r'^oauth/?$', views.oauth, name='oauth'),
    re_path(r'^openid/?$', views.openid, name='openid'),
    re_path(r'^callback/?$', views.callback, name='callback'),
    re_path(r'^connected/?$', views.connected, name='connected'),
    re_path(r'^qbo_request/?$', views.qbo_request, name='qbo_request'),
    re_path(r'^revoke/?$', views.revoke, name='revoke'),
    re_path(r'^refresh/?$', views.refresh, name='refresh'),
    re_path(r'^user_info/?$', views.user_info, name='user_info'),
    re_path(r'^migration/?$', views.migration, name='migration'),
    re_path(r'^invoice/?$', views.invoice, name='invoice'),
    re_path(r'^list_customers/?$', views.list_customers, name='list_customers'),
    re_path(r'^list_bills/?$', views.list_bills, name='list_bills'),
    re_path(r'^manual_company_info/?$', views.manual_company_info, name='manual_company_info'),
    
]