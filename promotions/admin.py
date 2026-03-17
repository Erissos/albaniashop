from django.contrib import admin

from .models import Coupon, CouponRedemption


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'value', 'minimum_order_amount', 'usage_limit', 'usage_count', 'is_active')
    list_filter = ('discount_type', 'is_active')
    search_fields = ('code', 'description')


@admin.register(CouponRedemption)
class CouponRedemptionAdmin(admin.ModelAdmin):
    list_display = ('coupon', 'user', 'redeemed_at')
    search_fields = ('coupon__code', 'user__username', 'user__email')
