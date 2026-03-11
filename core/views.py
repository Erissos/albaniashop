from django.db.models import Q
from django.shortcuts import render

from catalog.models import Brand, Category, Product


def home(request):
	featured_products = Product.objects.filter(is_active=True)[:8]
	campaign_products = Product.objects.filter(is_active=True, discounted_price__isnull=False)[:8]
	new_arrivals = Product.objects.filter(is_active=True)[:12]
	partner_brands = Brand.objects.all()[:8]
	root_categories = Category.objects.filter(parent__isnull=True, is_active=True)
	return render(
		request,
		'core/home.html',
		{
			'featured_products': featured_products,
			'campaign_products': campaign_products,
			'new_arrivals': new_arrivals,
			'partner_brands': partner_brands,
			'root_categories': root_categories,
		},
	)


def all_products(request):
	query = request.GET.get('q', '').strip()
	products = Product.objects.filter(is_active=True)
	if query:
		products = products.filter(
			Q(name__icontains=query)
			| Q(short_description__icontains=query)
			| Q(description__icontains=query)
			| Q(sku__icontains=query)
		)
	return render(request, 'core/all_products.html', {'products': products, 'query': query})
