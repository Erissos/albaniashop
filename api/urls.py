from django.urls import path

from .views import (
    AddressDetailAPIView,
    AddressListCreateAPIView,
    BrandDetailAPIView,
    BrandListAPIView,
    BrandProductsAPIView,
    CartAddAPIView,
    CartAPIView,
    CartItemAPIView,
    CategoryTreeAPIView,
    FeaturedReviewsAPIView,
    LoginAPIView,
    LogoutAPIView,
    OrderCreateAPIView,
    OrderHistoryAPIView,
    PasswordChangeAPIView,
    ProductDetailAPIView,
    ProductListAPIView,
    ProductReviewListAPIView,
    ProfileAPIView,
    RegisterAPIView,
    SupportTicketListCreateAPIView,
    UserQuestionListCreateAPIView,
    UserReviewListAPIView,
    WishlistAPIView,
)

app_name = 'api'

urlpatterns = [
    # Catalog
    path('catalog/categories/', CategoryTreeAPIView.as_view(), name='category-tree'),
    path('catalog/products/', ProductListAPIView.as_view(), name='product-list'),
    path('catalog/products/<slug:slug>/', ProductDetailAPIView.as_view(), name='product-detail'),
    path('catalog/products/<slug:slug>/reviews/', ProductReviewListAPIView.as_view(), name='product-reviews'),
    path('catalog/brands/', BrandListAPIView.as_view(), name='brand-list'),
    path('catalog/brands/<slug:slug>/', BrandDetailAPIView.as_view(), name='brand-detail'),
    path('catalog/brands/<slug:slug>/products/', BrandProductsAPIView.as_view(), name='brand-products'),
    path('catalog/reviews/featured/', FeaturedReviewsAPIView.as_view(), name='featured-reviews'),
    # Cart
    path('cart/', CartAPIView.as_view(), name='cart-detail'),
    path('cart/add/', CartAddAPIView.as_view(), name='cart-add'),
    path('cart/items/<int:item_id>/', CartItemAPIView.as_view(), name='cart-item'),
    # Orders
    path('orders/history/', OrderHistoryAPIView.as_view(), name='order-history'),
    path('orders/create/', OrderCreateAPIView.as_view(), name='order-create'),
    # Wishlist
    path('wishlist/', WishlistAPIView.as_view(), name='wishlist'),
    # Auth
    path('auth/login/', LoginAPIView.as_view(), name='auth-login'),
    path('auth/register/', RegisterAPIView.as_view(), name='auth-register'),
    path('auth/logout/', LogoutAPIView.as_view(), name='auth-logout'),
    path('auth/profile/', ProfileAPIView.as_view(), name='auth-profile'),
    path('auth/change-password/', PasswordChangeAPIView.as_view(), name='auth-change-password'),
    path('auth/reviews/', UserReviewListAPIView.as_view(), name='auth-reviews'),
    path('auth/questions/', UserQuestionListCreateAPIView.as_view(), name='auth-questions'),
    path('auth/support/', SupportTicketListCreateAPIView.as_view(), name='auth-support'),
    # Addresses
    path('addresses/', AddressListCreateAPIView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', AddressDetailAPIView.as_view(), name='address-detail'),
]
