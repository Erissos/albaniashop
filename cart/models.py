from decimal import Decimal

from django.conf import settings
from django.db import models


class Cart(models.Model):
	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
	session_key = models.CharField(max_length=80, null=True, blank=True, unique=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.user.username if self.user else f'Session cart {self.session_key}'

	@property
	def total(self):
		return sum((item.subtotal for item in self.items.select_related('product')), Decimal('0.00'))


class CartItem(models.Model):
	cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
	product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE)
	variation = models.ForeignKey('catalog.ProductVariation', null=True, blank=True, on_delete=models.SET_NULL)
	quantity = models.PositiveIntegerField(default=1)

	class Meta:
		unique_together = ('cart', 'product', 'variation')

	@property
	def unit_price(self):
		base_price = self.product.current_price
		if self.variation:
			return base_price + self.variation.price_delta
		return base_price

	@property
	def subtotal(self):
		return self.unit_price * self.quantity
