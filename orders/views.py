from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.core.exceptions import ValidationError

from cart.utils import get_or_create_cart

from .forms import CheckoutForm
from .models import Order
from .services import CheckoutService


@login_required
def checkout(request):
	cart = get_or_create_cart(request)
	if not cart.items.exists():
		messages.error(request, 'Your cart is empty.')
		return redirect('cart:detail')

	form = CheckoutForm(request.POST or None, user=request.user)
	selected_address_id = str(form.data.get('address', ''))
	if request.method == 'POST' and form.is_valid():
		try:
			order = CheckoutService.place_order(
				user=request.user,
				cart=cart,
				address=form.cleaned_data['address'],
				note=form.cleaned_data['note'],
				coupon_code=form.cleaned_data['coupon_code'],
			)
		except ValidationError as exc:
			form.add_error('coupon_code', exc.message)
		else:
			messages.success(request, 'Order placed successfully.')
			return redirect('orders:success', order_number=order.order_number)

	pricing_preview = None
	if cart.items.exists():
		try:
			pricing_preview = CheckoutService.calculate_totals(cart, coupon_code=form.data.get('coupon_code', ''))
		except ValidationError:
			pricing_preview = CheckoutService.calculate_totals(cart)
	return render(
		request,
		'orders/checkout.jinja',
		{
			'form': form,
			'cart': cart,
			'cart_items': cart.items.select_related('product', 'variation'),
			'addresses': request.user.addresses.all(),
			'selected_address_id': selected_address_id,
			'pricing_preview': pricing_preview,
		},
	)


@login_required
def order_success(request, order_number):
	order = get_object_or_404(Order, order_number=order_number, user=request.user)
	return render(request, 'orders/order_success.jinja', {'order': order})
