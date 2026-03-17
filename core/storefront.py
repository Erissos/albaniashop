import os
from urllib.parse import urlencode

from django.http import HttpRequest, HttpResponseRedirect


def storefront_url(path: str = '/', query: dict[str, str] | None = None) -> str:
    base_url = os.getenv('NEXT_STOREFRONT_URL', 'http://localhost:3000').rstrip('/')
    normalized_path = path if path.startswith('/') else f'/{path}'
    url = f'{base_url}{normalized_path}'
    if query:
        encoded = urlencode({key: value for key, value in query.items() if value not in (None, '')}, doseq=True)
        if encoded:
            url = f'{url}?{encoded}'
    return url


def storefront_redirect(request: HttpRequest, path: str = '/', query: dict[str, str] | None = None) -> HttpResponseRedirect:
    merged_query: dict[str, str] = {}
    if request.GET:
        merged_query.update({key: value for key, value in request.GET.items() if value not in (None, '')})
    if query:
        merged_query.update({key: value for key, value in query.items() if value not in (None, '')})
    return HttpResponseRedirect(storefront_url(path, merged_query))