from django.urls import path

from . import views

app_name = 'accounts'

urlpatterns = [
    path('login/', views.login_redirect, name='login'),
    path('logout/', views.logout_redirect, name='logout'),
    path('register/', views.register, name='register'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('addresses/', views.address_list, name='address_list'),
    path('addresses/new/', views.address_create, name='address_create'),
    path('addresses/<int:pk>/edit/', views.address_edit, name='address_edit'),
    path('addresses/<int:pk>/delete/', views.address_delete, name='address_delete'),
    path('wishlist/', views.wishlist, name='wishlist'),
    path('wishlist/toggle/<int:product_id>/', views.toggle_wishlist, name='toggle_wishlist'),
    path('orders/', views.order_history, name='order_history'),
]
