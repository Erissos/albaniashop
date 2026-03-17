from rest_framework import generics, permissions

from catalog.models import Category, Product
from orders.models import Order

from .serializers import CategorySerializer, OrderSerializer, ProductSerializer


class CategoryTreeAPIView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Category.objects.filter(parent__isnull=True, is_active=True).prefetch_related('children')


class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['category__slug', 'brand__slug', 'is_featured']
    search_fields = ['name', 'short_description', 'description', 'sku', 'tags__name']
    ordering_fields = ['created_at', 'price', 'rating_average']

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category', 'brand').prefetch_related(
            'attribute_values__attribute', 'variations'
        )


class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category', 'brand').prefetch_related(
            'attribute_values__attribute', 'variations'
        )


class OrderHistoryAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items', 'items__product', 'items__variation')
