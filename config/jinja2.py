from decimal import Decimal

from django.templatetags.static import static
from django.urls import reverse
from jinja2 import Environment
from markupsafe import Markup


def money(value: Decimal | None, currency: str = 'Lekë') -> str:
    if value is None:
        return '-'
    formatted = f'{value:,.0f}'.replace(',', '.')
    return f'{formatted} {currency}'


def url(view_name, *args, **kwargs):
    return reverse(view_name, args=args or None, kwargs=kwargs or None)


def environment(**options):
    env = Environment(**options)
    env.globals.update(
        {
            'static': static,
            'url': url,
            'str': str,
        }
    )
    env.filters['money'] = money
    return env
