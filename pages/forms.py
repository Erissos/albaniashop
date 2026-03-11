from django import forms
from django.utils.translation import gettext_lazy as _

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input', 'placeholder': _('Your full name')}),
            'email': forms.EmailInput(attrs={'class': 'input', 'placeholder': _('name@example.com')}),
            'subject': forms.TextInput(attrs={'class': 'input', 'placeholder': _('How can we help you?')}),
            'message': forms.Textarea(
                attrs={
                    'class': 'input',
                    'rows': 6,
                    'placeholder': _('Tell us about your product request, partnership, or order question.'),
                }
            ),
        }
