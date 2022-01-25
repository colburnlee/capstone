from django.urls import path

from . import views

app_name = 'reports_app'

urlpatterns = [
    path('', views.index, name='home'),
    path('<str:username>/', views.profile, name='profile'),
]