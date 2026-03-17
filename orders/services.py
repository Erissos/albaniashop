from decimal import Decimal
from uuid import uuid4

from django.core.exceptions import ValidationError
from django.db import transaction

from catalog.models import InventoryMovement
from promotions.models import Coupon

from .models import Order, OrderEvent, OrderItem


class CheckoutService:
    shipping_threshold = Decimal('120.00')
    standard_shipping = Decimal('8.90')
    tax_ratio = Decimal('0.20')

    @classmethod
    def calculate_totals(cls, cart, coupon_code=''):
        subtotal = cart.total
        shipping_amount = Decimal('0.00') if subtotal >= cls.shipping_threshold else cls.standard_shipping
        tax_amount = (subtotal * cls.tax_ratio).quantize(Decimal('0.01'))
        discount_amount = Decimal('0.00')
        coupon = None

        if coupon_code:
            coupon = Coupon.objects.filter(code__iexact=coupon_code.strip(), is_active=True).first()
            if not coupon or not coupon.is_currently_valid(subtotal):
                raise ValidationError('Coupon code is not valid for this order.')
            if coupon.discount_type == Coupon.DiscountType.FREE_SHIPPING:
                shipping_amount = Decimal('0.00')
            else:
                discount_amount = coupon.calculate_discount(subtotal)

        total_amount = max(Decimal('0.00'), subtotal + shipping_amount + tax_amount - discount_amount)
        return {
            'coupon': coupon,
            'subtotal_amount': subtotal,
            'shipping_amount': shipping_amount,
            'tax_amount': tax_amount,
            'discount_amount': discount_amount,
            'total_amount': total_amount,
        }

    @classmethod
    @transaction.atomic
    def place_order(cls, *, user, cart, address=None, note='', coupon_code='', payment_provider='manual'):
        if not cart.items.exists():
            raise ValidationError('Cart is empty.')

        totals = cls.calculate_totals(cart, coupon_code=coupon_code)
        order = Order.objects.create(
            user=user,
            address=address,
            note=note,
            order_number=f'ALB-{uuid4().hex[:10].upper()}',
            invoice_number=f'INV-{uuid4().hex[:10].upper()}',
            subtotal_amount=totals['subtotal_amount'],
            discount_amount=totals['discount_amount'],
            shipping_amount=totals['shipping_amount'],
            tax_amount=totals['tax_amount'],
            total_amount=totals['total_amount'],
            payment_provider=payment_provider,
            billing_snapshot=cls._serialize_address(address),
            shipping_snapshot=cls._serialize_address(address),
        )

        for cart_item in cart.items.select_related('product', 'variation'):
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                variation=cart_item.variation,
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
                subtotal=cart_item.subtotal,
            )
            cart_item.product.stock_quantity = max(0, cart_item.product.stock_quantity - cart_item.quantity)
            cart_item.product.save(update_fields=['stock_quantity'])
            InventoryMovement.objects.create(
                product=cart_item.product,
                variation=cart_item.variation,
                movement_type=InventoryMovement.MovementType.SALE,
                quantity=-cart_item.quantity,
                reference=order.order_number,
            )

        OrderEvent.objects.create(order=order, status=Order.Status.PENDING, note='Order created')
        cart.items.all().delete()

        if totals['coupon']:
            totals['coupon'].register_usage(user)

        return order

    @staticmethod
    def _serialize_address(address):
        if not address:
            return {}
        return {
            'title': address.title,
            'full_name': address.full_name,
            'phone': address.phone,
            'country': address.country,
            'city': address.city,
            'postal_code': address.postal_code,
            'address_line': address.address_line,
            'address_line_2': address.address_line_2,
            'company_name': address.company_name,
        }
