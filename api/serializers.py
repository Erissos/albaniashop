from django.contrib.auth import authenticate, password_validation
from rest_framework import serializers

from accounts.models import Address, ProductQuestion, SupportTicket, WishlistItem
from cart.models import Cart, CartItem
from catalog.models import Brand, Category, Product, ProductAttributeValue, ProductImage, ProductReview, ProductVariation
from orders.models import Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'children']

    def get_children(self, obj):
        queryset = obj.children.filter(is_active=True)
        return CategorySerializer(queryset, many=True).data


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'description']


class WishlistItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'added_at']

    def get_product(self, obj):
        from .serializers import ProductSerializer
        return ProductSerializer(obj.product, context=self.context).data


class ProductReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = ProductReview
        fields = ['id', 'rating', 'title', 'comment', 'user_name', 'product_name', 'product_slug', 'product_image', 'is_verified_purchase', 'created_at']

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_product_image(self, obj):
        image = obj.product.images.filter(is_primary=True).first() or obj.product.images.first()
        if not image:
            return ''
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(image.image.url)
        return image.image.url


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'title', 'full_name', 'phone', 'country', 'city', 'postal_code', 'address_line', 'address_line_2', 'company_name', 'is_default']


class ProfileSerializer(serializers.Serializer):
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField()
    first_name = serializers.CharField(allow_blank=True)
    last_name = serializers.CharField(allow_blank=True)
    phone = serializers.CharField(allow_blank=True)
    order_count = serializers.IntegerField(read_only=True)
    active_order_count = serializers.IntegerField(read_only=True)
    wishlist_count = serializers.IntegerField(read_only=True)
    address_count = serializers.IntegerField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    question_count = serializers.IntegerField(read_only=True)
    open_support_count = serializers.IntegerField(read_only=True)
    total_spent = serializers.CharField(read_only=True)


class ProfileUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=6)
    new_password_confirm = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.check_password(attrs['current_password']):
            raise serializers.ValidationError({'current_password': 'Mevcut şifre hatalı.'})
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({'new_password_confirm': 'Yeni şifreler eşleşmiyor.'})
        password_validation.validate_password(attrs['new_password'], user=user)
        return attrs


class ProductQuestionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = ProductQuestion
        fields = ['id', 'product', 'product_name', 'product_slug', 'product_image', 'question', 'answer', 'created_at']
        read_only_fields = ['id', 'answer', 'created_at', 'product_name', 'product_slug', 'product_image']

    def get_product_image(self, obj):
        image = obj.product.images.filter(is_primary=True).first() or obj.product.images.first()
        if not image:
            return ''
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(image.image.url)
        return image.image.url


class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['id', 'subject', 'category', 'message', 'preferred_contact', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        identifier = data.get('phone') or data.get('username')
        if not identifier:
            raise serializers.ValidationError('Telefon numarası gerekli.')
        user = authenticate(username=identifier, password=data['password'])
        if not user:
            raise serializers.ValidationError('Geçersiz telefon numarası veya şifre.')
        data['user'] = user
        return data


class RegisterSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=30)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(max_length=30, required=False, default='')
    last_name = serializers.CharField(max_length=150, required=False, default='')


class ProductAttributeValueSerializer(serializers.ModelSerializer):
    attribute = serializers.StringRelatedField()

    class Meta:
        model = ProductAttributeValue
        fields = ['attribute', 'value', 'display_value']


class ProductVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariation
        fields = ['id', 'variation_type', 'value', 'title', 'price_delta', 'stock_override', 'is_default']


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['image', 'alt_text', 'is_primary']

    def get_image(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    category_slug = serializers.SlugRelatedField(source='category', slug_field='slug', read_only=True)
    brand = serializers.StringRelatedField()
    brand_slug = serializers.SlugRelatedField(source='brand', slug_field='slug', read_only=True)
    attributes = ProductAttributeValueSerializer(source='attribute_values', many=True, read_only=True)
    variations = ProductVariationSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
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
            'category_slug',
            'brand',
            'brand_slug',
            'sku',
            'price',
            'discounted_price',
            'current_price',
            'stock_quantity',
            'rating_average',
            'review_count',
            'badge_text',
            'is_discreet',
            'attributes',
            'variations',
            'images',
        ]


class CartProductSerializer(serializers.ModelSerializer):
    brand = serializers.StringRelatedField()
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'brand', 'current_price', 'badge_text', 'images']


class CartItemSerializer(serializers.ModelSerializer):
    product = CartProductSerializer(read_only=True)
    variation_label = serializers.SerializerMethodField()
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'quantity', 'unit_price', 'subtotal', 'variation_label', 'product']

    def get_variation_label(self, obj):
        if not obj.variation:
            return ''
        return obj.variation.title or obj.variation.value


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'item_count', 'total', 'items']

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())


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
