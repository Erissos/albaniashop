from django.urls import path

from . import views

app_name = 'pages'

urlpatterns = [
    path('about/', views.about, name='about'),
    path('contracts/', views.contracts, name='contracts'),
    path('contact/', views.contact, name='contact'),
    path('cargo-tracking/', views.cargo_tracking, name='cargo_tracking'),
]
