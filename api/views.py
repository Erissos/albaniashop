from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db.models import Sum
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Address, ProductQuestion, Profile, SupportTicket, WishlistItem
from cart.models import Cart, CartItem
from cart.services import CartService
from cart.utils import get_or_create_cart
from catalog.models import Brand, Category, Product, ProductReview
from orders.models import Order
from orders.services import CheckoutService

from .serializers import (
    AddressSerializer,
    BrandSerializer,
    CartSerializer,
    CategorySerializer,
    LoginSerializer,
    OrderSerializer,
    PasswordChangeSerializer,
    ProductQuestionSerializer,
    ProductReviewSerializer,
    ProfileUpdateSerializer,
    ProductSerializer,
    RegisterSerializer,
    SupportTicketSerializer,
    WishlistItemSerializer,
)


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


class CartAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = get_or_create_cart(request)
        cart = Cart.objects.prefetch_related('items__product__images', 'items__product__brand', 'items__variation').get(pk=cart.pk)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


class CartAddAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        product_id = request.data.get('product_id')
        variation_id = request.data.get('variation_id')
        quantity = int(request.data.get('quantity', 1) or 1)

        product = generics.get_object_or_404(Product.objects.filter(is_active=True), id=product_id)
        variation = None
        if variation_id:
            variation = generics.get_object_or_404(product.variations.filter(is_active=True), id=variation_id)

        try:
            CartService.add_item(cart, product, variation=variation, quantity=quantity)
        except ValidationError as exc:
            return Response({'detail': exc.message}, status=status.HTTP_400_BAD_REQUEST)

        cart = Cart.objects.prefetch_related('items__product__images', 'items__product__brand', 'items__variation').get(pk=cart.pk)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CartItemAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, item_id):
        cart = get_or_create_cart(request)
        item = generics.get_object_or_404(CartItem.objects.select_related('product', 'variation'), id=item_id, cart=cart)
        action = request.data.get('action', '').strip().lower()
        if action not in {'increase', 'decrease'}:
            return Response({'detail': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

        CartService.update_item_quantity(item, action)
        cart = Cart.objects.prefetch_related('items__product__images', 'items__product__brand', 'items__variation').get(pk=cart.pk)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        item = generics.get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()
        cart = Cart.objects.prefetch_related('items__product__images', 'items__product__brand', 'items__variation').get(pk=cart.pk)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# ── Brand endpoints ────────────────────────────────────────────────

class BrandListAPIView(generics.ListAPIView):
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Brand.objects.all()


class BrandDetailAPIView(generics.RetrieveAPIView):
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    queryset = Brand.objects.all()


class BrandProductsAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, brand__slug=self.kwargs['slug']
        ).select_related('category', 'brand').prefetch_related('attribute_values__attribute', 'variations', 'images')


# ── Wishlist endpoints ─────────────────────────────────────────────

class WishlistAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user).select_related(
            'product__category', 'product__brand'
        ).prefetch_related('product__images', 'product__attribute_values__attribute', 'product__variations')
        serializer = WishlistItemSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        product = generics.get_object_or_404(Product.objects.filter(is_active=True), id=product_id)
        item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
        if not created:
            return Response({'detail': 'Zaten favorilerde.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Favorilere eklendi.'}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        product_id = request.data.get('product_id')
        deleted, _ = WishlistItem.objects.filter(user=request.user, product_id=product_id).delete()
        if not deleted:
            return Response({'detail': 'Favorilerde bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'Favorilerden kaldırıldı.'}, status=status.HTTP_200_OK)


# ── Review endpoints ───────────────────────────────────────────────

class ProductReviewListAPIView(generics.ListAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        qs = ProductReview.objects.filter(is_approved=True).select_related('user', 'product')
        if slug:
            qs = qs.filter(product__slug=slug)
        return qs


class FeaturedReviewsAPIView(APIView):
    """Returns approved reviews for the homepage, prioritizing verified and recent ones."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        reviews = list(
            ProductReview.objects.filter(is_approved=True)
            .select_related('user', 'product')
            .order_by('-is_verified_purchase', '-created_at')[:6]
        )
        serializer = ProductReviewSerializer(reviews, many=True, context={'request': request})
        return Response(serializer.data)


# ── Order creation ─────────────────────────────────────────────────

class OrderCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = get_or_create_cart(request)
        address_id = request.data.get('address_id')
        note = request.data.get('note', '')
        coupon_code = request.data.get('coupon_code', '')

        address = None
        if address_id:
            address = generics.get_object_or_404(Address, id=address_id, user=request.user)

        try:
            order = CheckoutService.place_order(
                user=request.user, cart=cart, address=address, note=note, coupon_code=coupon_code
            )
        except ValidationError as exc:
            msg = exc.message if hasattr(exc, 'message') else str(exc)
            return Response({'detail': msg}, status=status.HTTP_400_BAD_REQUEST)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ── Auth endpoints ─────────────────────────────────────────────────

class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        if User.objects.filter(username=d['phone']).exists():
            return Response({'detail': 'Bu telefon numarası zaten kayıtlı.'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(
            username=d['phone'], email=d['email'], password=d['password'],
            first_name=d.get('first_name', ''), last_name=d.get('last_name', ''),
        )
        Profile.objects.get_or_create(user=user, defaults={'phone': d['phone']})
        login(request, user)
        return Response({'phone': user.username, 'email': user.email}, status=status.HTTP_201_CREATED)


class LogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'detail': 'Çıkış yapıldı.'})


class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, _ = Profile.objects.get_or_create(user=user, defaults={'phone': user.username})
        orders = Order.objects.filter(user=user)
        wishlist_count = WishlistItem.objects.filter(user=user).count()
        address_count = Address.objects.filter(user=user).count()
        review_count = ProductReview.objects.filter(user=user).count()
        question_count = ProductQuestion.objects.filter(user=user).count()
        open_support_count = SupportTicket.objects.filter(user=user, status__in=['open', 'in_progress']).count()
        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': profile.phone or user.username,
            'order_count': orders.count(),
            'active_order_count': orders.exclude(status__in=['delivered', 'cancelled']).count(),
            'wishlist_count': wishlist_count,
            'address_count': address_count,
            'review_count': review_count,
            'question_count': question_count,
            'open_support_count': open_support_count,
            'total_spent': str(orders.filter(payment_status='paid').aggregate(t=Sum('total_amount'))['t'] or 0),
        })

    def patch(self, request):
        serializer = ProfileUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = request.user
        profile, _ = Profile.objects.get_or_create(user=user, defaults={'phone': user.username})
        data = serializer.validated_data
        new_phone = data.get('phone')

        if new_phone and User.objects.exclude(pk=user.pk).filter(username=new_phone).exists():
            return Response({'phone': ['Bu telefon numarası başka bir hesapta kullanılıyor.']}, status=status.HTTP_400_BAD_REQUEST)

        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            user.email = data['email']
        if new_phone is not None:
            user.username = new_phone
            profile.phone = new_phone
            profile.save(update_fields=['phone'])
        user.save(update_fields=['first_name', 'last_name', 'email', 'username'])

        return self.get(request)


class PasswordChangeAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])
        login(request, request.user)
        return Response({'detail': 'Şifre başarıyla güncellendi.'})


# ── Address endpoints ──────────────────────────────────────────────

class AddressListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        address = serializer.save(user=self.request.user)
        if address.is_default:
            Address.objects.filter(user=self.request.user).exclude(pk=address.pk).update(is_default=False)
        elif not Address.objects.filter(user=self.request.user).exclude(pk=address.pk).exists():
            address.is_default = True
            address.save(update_fields=['is_default'])


class AddressDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        address = serializer.save()
        if address.is_default:
            Address.objects.filter(user=self.request.user).exclude(pk=address.pk).update(is_default=False)
        elif not Address.objects.filter(user=self.request.user, is_default=True).exclude(pk=address.pk).exists():
            address.is_default = True
            address.save(update_fields=['is_default'])

    def perform_destroy(self, instance):
        user = instance.user
        was_default = instance.is_default
        instance.delete()
        if was_default:
            fallback_address = Address.objects.filter(user=user).first()
            if fallback_address:
                Address.objects.filter(pk=fallback_address.pk).update(is_default=True)


class UserReviewListAPIView(generics.ListAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProductReview.objects.filter(user=self.request.user).select_related('user', 'product').prefetch_related('product__images')


class UserQuestionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ProductQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProductQuestion.objects.filter(user=self.request.user).select_related('product').prefetch_related('product__images')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SupportTicketListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SupportTicket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
