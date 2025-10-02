import re

from decouple import config
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from .models import Stack, Project

def home(request):
	stacks = Stack.objects.all()
	projects = Project.objects.filter(hide=False)
	
	return render(request, 'portfolio/home.html', {"stacks": stacks, "projects": projects})



def send_email(data, confirmation=False):
	
	if confirmation:
		subject = "We've received your message – Matei Robescu Portfolio"
		mail_file = 'confirmation'
		to_email = [data["email"]]
	else:
		subject = "You have received a new message from your Portfolio"
		mail_file = 'contact'
		to_email = [config("PERSONAL_EMAIL")]
		
	from_email = config("DEFAULT_FROM_EMAIL")
	
	text_content = render_to_string(f"email/{mail_file}.txt", data)
	html_content = render_to_string(f"email/{mail_file}.html", data)

	msg = EmailMultiAlternatives(subject, text_content, from_email, to_email, reply_to=[config("PERSONAL_EMAIL")] if confirmation else None)
	msg.attach_alternative(html_content, "text/html")
	msg.send()
	


@require_POST
def contact_api(request):
	data = {}
	
	for field in ("first_name", "last_name", "email", "company", "message"):
		data[field] = request.POST.get(field)
	
	if not (data["first_name"] and data["last_name"] and data["email"] and data["message"]) or not re.match(r"[^\s@]+@[^\s@]+\.[^\s@]+", data["email"]):
		return JsonResponse({"error": "Missing required fields"}, status=400)
	

	
	try:
		send_email(data)
		send_email(data, confirmation=True)
		
		return JsonResponse({"success": "sent"})
	except Exception as e:
		print(e)
		return JsonResponse({"error": str(e)}, status=500)