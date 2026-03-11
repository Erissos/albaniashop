from decimal import Decimal

from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class Category(models.Model):
	name = models.CharField(max_length=120)
	slug = models.SlugField(unique=True, max_length=150)
	parent = models.ForeignKey(
		'self', related_name='children', on_delete=models.CASCADE, null=True, blank=True
	)
	is_active = models.BooleanField(default=True)

	class Meta:
		verbose_name_plural = 'Categories'
		ordering = ['name']

	def __str__(self):
		return self.name


class Brand(models.Model):
	name = models.CharField(max_length=120, unique=True)
	slug = models.SlugField(max_length=150, unique=True)

	def __str__(self):
		return self.name


class Tag(models.Model):
	name = models.CharField(max_length=80, unique=True)
	slug = models.SlugField(max_length=100, unique=True)

	def __str__(self):
		return self.name


class Product(models.Model):
	name = models.CharField(max_length=200)
	slug = models.SlugField(max_length=220, unique=True)
	short_description = models.CharField(max_length=255)
	description = models.TextField()
	price = models.DecimalField(max_digits=10, decimal_places=2)
	discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	stock_quantity = models.PositiveIntegerField(default=0)
	category = models.ForeignKey(Category, related_name='products', on_delete=models.PROTECT)
	brand = models.ForeignKey(Brand, related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
	tags = models.ManyToManyField(Tag, blank=True)
	sku = models.CharField(max_length=60, unique=True)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = slugify(self.name)
		super().save(*args, **kwargs)

	@property
	def current_price(self):
		if self.discounted_price and self.discounted_price > Decimal('0'):
			return self.discounted_price
		return self.price

	def get_absolute_url(self):
		return reverse('catalog:product_detail', kwargs={'slug': self.slug})


class ProductImage(models.Model):
	product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
	image = models.ImageField(upload_to='products/')
	alt_text = models.CharField(max_length=150, blank=True)
	is_primary = models.BooleanField(default=False)

	def __str__(self):
		return f'{self.product.name} image'


class ProductVariation(models.Model):
	class VariationType(models.TextChoices):
		COLOR = 'color', _('Color')
		SIZE = 'size', _('Size')
		OTHER = 'other', _('Other')

	product = models.ForeignKey(Product, related_name='variations', on_delete=models.CASCADE)
	variation_type = models.CharField(max_length=20, choices=VariationType.choices)
	value = models.CharField(max_length=80)
	sku_suffix = models.CharField(max_length=20, blank=True)
	price_delta = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
	stock_override = models.PositiveIntegerField(null=True, blank=True)

	class Meta:
		unique_together = ('product', 'variation_type', 'value')

	def __str__(self):
		return f'{self.product.name} - {self.variation_type}: {self.value}'
