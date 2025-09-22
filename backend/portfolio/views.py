from django.shortcuts import render
from .models import Stack, Project

def home(request):
	stacks = Stack.objects.all()
	projects = Project.objects.all()
	
	return render(request, 'portfolio/home.html', {"stacks": stacks, "projects": projects})