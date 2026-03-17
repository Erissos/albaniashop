from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone


class Coupon(models.Model):
    class DiscountType(models.TextChoices):
        FIXED = 'fixed', 'Fixed'
        PERCENTAGE = 'percentage', 'Percentage'
        FREE_SHIPPING = 'free_shipping', 'Free shipping'

    code = models.CharField(max_length=40, unique=True)
    description = models.CharField(max_length=160, blank=True)
    discount_type = models.CharField(max_length=20, choices=DiscountType.choices)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    usage_limit = models.PositiveIntegerField(default=0)
    usage_count = models.PositiveIntegerField(default=0)
    active_from = models.DateTimeField(default=timezone.now)
    active_until = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['code']

    def __str__(self):
        return self.code

    def is_currently_valid(self, subtotal):
        now = timezone.now()
        within_window = self.active_from <= now and (self.active_until is None or self.active_until >= now)
        usage_available = self.usage_limit == 0 or self.usage_count < self.usage_limit
        return self.is_active and within_window and usage_available and subtotal >= self.minimum_order_amount

    def calculate_discount(self, subtotal):
        if self.discount_type == self.DiscountType.FREE_SHIPPING:
            return Decimal('0.00')
        if self.discount_type == self.DiscountType.FIXED:
            discount = min(subtotal, self.value)
        else:
            discount = (subtotal * self.value / Decimal('100')).quantize(Decimal('0.01'))
        if self.max_discount_amount:
            discount = min(discount, self.max_discount_amount)
        return discount

    def register_usage(self, user):
        self.usage_count += 1
        self.save(update_fields=['usage_count'])
        CouponRedemption.objects.create(coupon=self, user=user)


class CouponRedemption(models.Model):
    coupon = models.ForeignKey(Coupon, related_name='redemptions', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='coupon_redemptions', on_delete=models.CASCADE)
    redeemed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-redeemed_at']

    def __str__(self):
        return f'{self.coupon.code} - {self.user}'
