from core.storefront import storefront_redirect


def product_list(request, category_slug=None):
	if category_slug:
		return storefront_redirect(request, f'/category/{category_slug}')
	return storefront_redirect(request, '/search')


def product_detail(request, slug):
	return storefront_redirect(request, f'/product/{slug}')
