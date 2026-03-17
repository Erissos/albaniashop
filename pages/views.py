from django.contrib import messages
from django.shortcuts import render

from orders.models import ShipmentTracking

from .forms import ContactForm


def about(request):
	return render(request, 'pages/about.jinja')


def contracts(request):
	return render(request, 'pages/contracts.jinja')


def contact(request):
	form = ContactForm(request.POST or None)
	if request.method == 'POST' and form.is_valid():
		form.save()
		messages.success(request, 'Your message has been sent.')
		return render(request, 'pages/contact.jinja', {'form': ContactForm()})
	return render(request, 'pages/contact.jinja', {'form': form})


def cargo_tracking(request):
	code = request.GET.get('code', '').strip()
	tracking = None
	if code:
		tracking = ShipmentTracking.objects.filter(tracking_code=code).select_related('order').first()
		if tracking is None:
			messages.error(request, 'Tracking code not found.')
	return render(request, 'pages/cargo_tracking.jinja', {'tracking': tracking, 'code': code})
