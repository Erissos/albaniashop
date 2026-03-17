from django.conf import settings
from django.db import models
from django.utils import timezone


class Order(models.Model):
	class Status(models.TextChoices):
		PENDING = 'pending', 'Pending'
		PAID = 'paid', 'Paid'
		PROCESSING = 'processing', 'Processing'
		SHIPPED = 'shipped', 'Shipped'
		DELIVERED = 'delivered', 'Delivered'
		CANCELLED = 'cancelled', 'Cancelled'

	class PaymentStatus(models.TextChoices):
		PENDING = 'pending', 'Pending'
		AUTHORIZED = 'authorized', 'Authorized'
		PAID = 'paid', 'Paid'
		FAILED = 'failed', 'Failed'
		REFUNDED = 'refunded', 'Refunded'

	user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.CASCADE)
	address = models.ForeignKey('accounts.Address', null=True, blank=True, on_delete=models.SET_NULL)
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
	payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
	order_number = models.CharField(max_length=30, unique=True)
	invoice_number = models.CharField(max_length=30, unique=True, blank=True, null=True)
	currency = models.CharField(max_length=3, default='EUR')
	subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	shipping_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	total_amount = models.DecimalField(max_digits=10, decimal_places=2)
	payment_provider = models.CharField(max_length=50, blank=True)
	guest_email = models.EmailField(blank=True)
	billing_snapshot = models.JSONField(default=dict, blank=True)
	shipping_snapshot = models.JSONField(default=dict, blank=True)
	note = models.CharField(max_length=255, blank=True)
	placed_at = models.DateTimeField(default=timezone.now)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return self.order_number


class OrderItem(models.Model):
	order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
	product = models.ForeignKey('catalog.Product', null=True, on_delete=models.SET_NULL)
	variation = models.ForeignKey('catalog.ProductVariation', null=True, blank=True, on_delete=models.SET_NULL)
	quantity = models.PositiveIntegerField(default=1)
	unit_price = models.DecimalField(max_digits=10, decimal_places=2)
	subtotal = models.DecimalField(max_digits=10, decimal_places=2)

	def __str__(self):
		product_name = self.product.name if self.product else 'Deleted product'
		return f'{self.order.order_number} - {product_name}'


class ShipmentTracking(models.Model):
	order = models.OneToOneField(Order, related_name='tracking', on_delete=models.CASCADE)
	tracking_code = models.CharField(max_length=80, unique=True)
	carrier_name = models.CharField(max_length=120)
	current_status = models.CharField(max_length=120, blank=True)
	tracking_url = models.URLField(blank=True)
	estimated_delivery = models.DateField(null=True, blank=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.tracking_code


class OrderEvent(models.Model):
	order = models.ForeignKey(Order, related_name='events', on_delete=models.CASCADE)
	status = models.CharField(max_length=40)
	note = models.CharField(max_length=255, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f'{self.order.order_number} - {self.status}'
