from django.core.exceptions import ValidationError

from .models import CartItem


class CartService:
    @staticmethod
    def add_item(cart, product, variation=None, quantity=1):
        available_stock = variation.stock_override if variation and variation.stock_override is not None else product.stock_quantity
        item, created = CartItem.objects.get_or_create(cart=cart, product=product, variation=variation)
        requested_quantity = quantity if created else item.quantity + quantity
        if available_stock <= 0 or requested_quantity > available_stock:
            raise ValidationError('Requested quantity is not available in stock.')
        item.quantity = requested_quantity
        item.save(update_fields=['quantity'])
        return item

    @staticmethod
    def update_item_quantity(item, action):
        if action == 'increase':
            item.quantity += 1
            item.save(update_fields=['quantity'])
        elif action == 'decrease':
            item.quantity -= 1
            if item.quantity <= 0:
                item.delete()
                return None
            item.save(update_fields=['quantity'])
        return item
