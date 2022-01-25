from django.shortcuts import render

# Create your views here.
def index(request):

    return render(request, 'reports_app/index.html')

def profile(request):

    return render(request, 'reports_app/index.html')