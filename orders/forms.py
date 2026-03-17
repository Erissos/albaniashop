from django import forms

from accounts.models import Address


class CheckoutForm(forms.Form):
    address = forms.ModelChoiceField(queryset=Address.objects.none(), required=False)
    coupon_code = forms.CharField(required=False, max_length=40)
    note = forms.CharField(required=False, widget=forms.Textarea(attrs={'rows': 3}))

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super().__init__(*args, **kwargs)
        self.fields['address'].queryset = Address.objects.filter(user=user)
