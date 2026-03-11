from django.contrib import admin

from .models import Order, OrderItem, ShipmentTracking


class OrderItemInline(admin.TabularInline):
	model = OrderItem
	extra = 0
	readonly_fields = ('product', 'variation', 'quantity', 'unit_price', 'subtotal')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
	list_display = ('order_number', 'user', 'status', 'total_amount', 'created_at')
	list_filter = ('status', 'created_at')
	search_fields = ('order_number', 'user__username', 'user__email')
	inlines = [OrderItemInline]


@admin.register(ShipmentTracking)
class ShipmentTrackingAdmin(admin.ModelAdmin):
	list_display = ('tracking_code', 'order', 'carrier_name', 'current_status', 'updated_at')
	search_fields = ('tracking_code', 'order__order_number')
