from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Profile(models.Model):
	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
	phone = models.CharField(max_length=30, blank=True)
	birth_date = models.DateField(null=True, blank=True)

	def __str__(self):
		return f'Profile: {self.user.username}'


class Address(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='addresses', on_delete=models.CASCADE)
	title = models.CharField(max_length=80, help_text=_('Home, Office etc.'))
	full_name = models.CharField(max_length=120)
	phone = models.CharField(max_length=30)
	country = models.CharField(max_length=80, default='Albania')
	city = models.CharField(max_length=120)
	postal_code = models.CharField(max_length=20, blank=True)
	address_line = models.TextField()
	is_default = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-is_default', '-created_at']

	def __str__(self):
		return f'{self.title} - {self.user.username}'


class WishlistItem(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='wishlist_items', on_delete=models.CASCADE)
	product = models.ForeignKey('catalog.Product', related_name='wishlisted_by', on_delete=models.CASCADE)
	added_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ('user', 'product')
		ordering = ['-added_at']

	def __str__(self):
		return f'{self.user.username} -> {self.product.name}'
