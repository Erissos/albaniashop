from decimal import Decimal
from uuid import uuid4

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect, render

from cart.utils import get_or_create_cart

from .forms import CheckoutForm
from .models import Order, OrderItem


@login_required
@transaction.atomic
def checkout(request):
	cart = get_or_create_cart(request)
	if not cart.items.exists():
		messages.error(request, 'Your cart is empty.')
		return redirect('cart:detail')

	form = CheckoutForm(request.POST or None, user=request.user)
	if request.method == 'POST' and form.is_valid():
		order = Order.objects.create(
			user=request.user,
			address=form.cleaned_data['address'],
			note=form.cleaned_data['note'],
			order_number=f'ALB-{uuid4().hex[:10].upper()}',
			total_amount=cart.total,
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
			cart_item.product.stock_quantity = max(
				0,
				cart_item.product.stock_quantity - cart_item.quantity,
			)
			cart_item.product.save(update_fields=['stock_quantity'])
		cart.items.all().delete()
		return redirect('orders:success', order_number=order.order_number)

	return render(request, 'orders/checkout.html', {'form': form, 'cart': cart})


@login_required
def order_success(request, order_number):
	order = get_object_or_404(Order, order_number=order_number, user=request.user)
	return render(request, 'orders/order_success.html', {'order': order})
