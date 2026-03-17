from .storefront import storefront_redirect


def home(request):
	return storefront_redirect(request, '/')


def all_products(request):
	return storefront_redirect(request, '/search')
