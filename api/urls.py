from django.urls import path

from .views import CategoryTreeAPIView, OrderHistoryAPIView, ProductDetailAPIView, ProductListAPIView

app_name = 'api'

urlpatterns = [
    path('catalog/categories/', CategoryTreeAPIView.as_view(), name='category-tree'),
    path('catalog/products/', ProductListAPIView.as_view(), name='product-list'),
    path('catalog/products/<slug:slug>/', ProductDetailAPIView.as_view(), name='product-detail'),
    path('orders/history/', OrderHistoryAPIView.as_view(), name='order-history'),
]
