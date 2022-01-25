from django import forms
from .models import User

class UserForm(forms.ModelForm):

    class Meta:
        model = User

        fields = [
            'first_name',
            'last_name',
            'email',
            'username',
            'password',
            'finance_id',
            'start_date',
            'end_date',
        ]

        #Customize the HTML Class for each
        widgets = {
            'first_name': forms.TextInput(attrs={'class':'form-control'}),
            'last_name': forms.TextInput(attrs={'class':'form-control'}),
            'email' : forms.TextInput(attrs={'class':'form-control'}),
            'username': forms.TextInput(attrs={'class':'form-control'}),
            'password': forms.PasswordInput(attrs={'class':'form-control'}),
            'finance_id': forms.TextInput(attrs={'class':'form-control'}),
            'start_date': forms.DateTimeInput(attrs={'class':'form-control'}),
            'end_date': forms.DateTimeInput(attrs={'class':'form-control'}),
        }

class UserAuthForm(UserForm):
    class Meta(UserForm.Meta):
        fields = ['username', 'password']