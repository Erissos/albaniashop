from django.urls import path

from . import views

app_name = 'core'

urlpatterns = [
    path('', views.home, name='home'),
    path('all-products/', views.all_products, name='all_products'),
]
