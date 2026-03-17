from rest_framework import serializers

from catalog.models import Category, Product, ProductAttributeValue, ProductVariation
from orders.models import Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'children']

    def get_children(self, obj):
        queryset = obj.children.filter(is_active=True)
        return CategorySerializer(queryset, many=True).data


class ProductAttributeValueSerializer(serializers.ModelSerializer):
    attribute = serializers.StringRelatedField()

    class Meta:
        model = ProductAttributeValue
        fields = ['attribute', 'value', 'display_value']


class ProductVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariation
        fields = ['id', 'variation_type', 'value', 'title', 'price_delta', 'stock_override', 'is_default']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    brand = serializers.StringRelatedField()
    attributes = ProductAttributeValueSerializer(source='attribute_values', many=True, read_only=True)
    variations = ProductVariationSerializer(many=True, read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'short_description',
            'description',
            'category',
            'brand',
            'sku',
            'price',
            'discounted_price',
            'current_price',
            'stock_quantity',
            'rating_average',
            'review_count',
            'badge_text',
            'attributes',
            'variations',
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField()
    variation = serializers.StringRelatedField()

    class Meta:
        model = OrderItem
        fields = ['product', 'variation', 'quantity', 'unit_price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'order_number',
            'status',
            'payment_status',
            'currency',
            'subtotal_amount',
            'discount_amount',
            'shipping_amount',
            'tax_amount',
            'total_amount',
            'created_at',
            'items',
        ]
