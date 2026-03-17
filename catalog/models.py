from decimal import Decimal

from django.conf import settings
from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class Category(models.Model):
	name = models.CharField(max_length=120)
	slug = models.SlugField(unique=True, max_length=150)
	description = models.TextField(blank=True)
	parent = models.ForeignKey(
		'self', related_name='children', on_delete=models.CASCADE, null=True, blank=True
	)
	is_active = models.BooleanField(default=True)
	sort_order = models.PositiveIntegerField(default=0)
	seo_title = models.CharField(max_length=160, blank=True)
	seo_description = models.CharField(max_length=320, blank=True)

	class Meta:
		verbose_name_plural = 'Categories'
		ordering = ['sort_order', 'name']

	def __str__(self):
		return self.name


class Brand(models.Model):
	name = models.CharField(max_length=120, unique=True)
	slug = models.SlugField(max_length=150, unique=True)
	description = models.TextField(blank=True)
	is_featured = models.BooleanField(default=False)

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
	safety_stock = models.PositiveIntegerField(default=0)
	category = models.ForeignKey(Category, related_name='products', on_delete=models.PROTECT)
	brand = models.ForeignKey(Brand, related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
	tags = models.ManyToManyField(Tag, blank=True)
	sku = models.CharField(max_length=60, unique=True)
	is_active = models.BooleanField(default=True)
	is_featured = models.BooleanField(default=False)
	is_discreet = models.BooleanField(default=True)
	badge_text = models.CharField(max_length=40, blank=True)
	meta_title = models.CharField(max_length=160, blank=True)
	meta_description = models.CharField(max_length=320, blank=True)
	rating_average = models.DecimalField(max_digits=3, decimal_places=2, default=Decimal('0.00'))
	review_count = models.PositiveIntegerField(default=0)
	published_at = models.DateTimeField(null=True, blank=True)
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
	title = models.CharField(max_length=120, blank=True)
	sku_suffix = models.CharField(max_length=20, blank=True)
	price_delta = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
	stock_override = models.PositiveIntegerField(null=True, blank=True)
	barcode = models.CharField(max_length=64, blank=True)
	is_default = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)

	class Meta:
		unique_together = ('product', 'variation_type', 'value')

	def __str__(self):
		return f'{self.product.name} - {self.variation_type}: {self.value}'


class ProductAttribute(models.Model):
	name = models.CharField(max_length=80)
	code = models.SlugField(max_length=80, unique=True)
	is_filterable = models.BooleanField(default=True)
	is_variant_axis = models.BooleanField(default=False)

	class Meta:
		ordering = ['name']

	def __str__(self):
		return self.name


class ProductAttributeValue(models.Model):
	product = models.ForeignKey(Product, related_name='attribute_values', on_delete=models.CASCADE)
	attribute = models.ForeignKey(ProductAttribute, related_name='values', on_delete=models.CASCADE)
	value = models.CharField(max_length=120)
	display_value = models.CharField(max_length=120, blank=True)

	class Meta:
		unique_together = ('product', 'attribute', 'value')
		ordering = ['attribute__name', 'value']

	def __str__(self):
		return f'{self.product.name} - {self.attribute.name}: {self.value}'


class InventoryMovement(models.Model):
	class MovementType(models.TextChoices):
		PURCHASE = 'purchase', _('Purchase')
		SALE = 'sale', _('Sale')
		RETURN = 'return', _('Return')
		ADJUSTMENT = 'adjustment', _('Adjustment')

	product = models.ForeignKey(Product, related_name='inventory_movements', on_delete=models.CASCADE)
	variation = models.ForeignKey(ProductVariation, related_name='inventory_movements', null=True, blank=True, on_delete=models.SET_NULL)
	movement_type = models.CharField(max_length=20, choices=MovementType.choices)
	quantity = models.IntegerField()
	reference = models.CharField(max_length=120, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f'{self.product.name} ({self.movement_type}) {self.quantity}'


class ProductReview(models.Model):
	product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='product_reviews', on_delete=models.CASCADE)
	rating = models.PositiveSmallIntegerField(default=5)
	title = models.CharField(max_length=120)
	comment = models.TextField()
	is_approved = models.BooleanField(default=False)
	is_verified_purchase = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']
		unique_together = ('product', 'user')

	def __str__(self):
		return f'{self.product.name} review by {self.user}'
