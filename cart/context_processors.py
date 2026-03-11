from .utils import get_or_create_cart


def cart_summary(request):
    cart = get_or_create_cart(request)
    total_items = sum(item.quantity for item in cart.items.all())
    return {'header_cart': cart, 'header_cart_total_items': total_items}
