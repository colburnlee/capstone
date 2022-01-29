from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404, render, redirect, reverse
from django.http import HttpResponseRedirect
from django.contrib.auth import (
    authenticate,
    get_user_model,
    login as user_login,
    logout as user_logout,
)
from django.contrib.auth.decorators import login_required
from .forms import UserForm, UserAuthForm 
from django.contrib.auth.models import User

def register(request):
    # if 'GET' Request, serve the blank form
    if request.method == 'GET':
        new_form = UserForm()
        context = { 'form' : new_form }
        return render(request, 'users_app/register.html', context)

    # if 'POST' Request, check values are valid and (if they are) create a new user with the info
    elif request.method == 'POST':
        form = UserForm(request.POST)

        if not form.is_valid():

            context = {
                'form' : UserForm(),
                'error' : form.errors,
            }

        elif form.is_valid():

            add_user = form.save(commit=False)

            add_user.set_password(form.cleaned_data['password'])

            add_user.save()

    return HttpResponseRedirect(reverse('reports_app:home'))


def login(request):
    # If the login request is 'GET', render the login page
    if request.method == 'GET':
        login_form =  UserAuthForm()
        return render(request, 'users_app/login.html', {'form':login_form})

    # if it's a POST request, retrieve and send the login data to be authenticated in the DB
    elif request.method == 'POST':

        username = request.POST['username']
        password = request.POST['password']
        authenticated_user = authenticate(request, username=username, password=password)
        print(authenticated_user)

        # If invalid credentials, kick the user back to the login page with error message
        if authenticated_user is None:
            context = {
                'form': UserAuthForm(),
                'error': ['Username or password is incorrect! Please try again...']
            }
            return render(request, 'users_app/login.html', context)
        else:
            username = authenticated_user.username
            user_login(request, authenticated_user) 
            return redirect(reverse('users_app:profile', kwargs={'username': username}))

def logout(request):
    user_logout(request)
    return redirect(reverse('users_app:login'))

def profile(request, **kwargs):
    username=kwargs.get('username')
    user = get_object_or_404(get_user_model(), username=username)
    print(f'Profile view of user: {username}')
    profile_user = UserAuthForm(instance=user)

    return render(request, 'users_app/profile.html', {'form': profile_user})

