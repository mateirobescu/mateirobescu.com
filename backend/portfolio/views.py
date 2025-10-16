import re

from decouple import config
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from .models import Stack, Project, EmailLog

def home(request):
    stacks = Stack.objects.all()
    projects = Project.objects.prefetch_related('stacks').filter(hide=False)
    
    return render(request, 'portfolio/home.html', {"stacks": stacks, "projects": projects, "timestamp": timezone.now().timestamp()})


def send_email(data, confirmation=False):
    
    if confirmation:
        subject = "We've received your message – Matei Robescu Portfolio"
        mail_file = 'confirmation'
        to_email = [data["email"]]
        reply_email = [config("PERSONAL_EMAIL")]
    else:
        subject = "You have received a new message from your Portfolio"
        mail_file = 'contact'
        to_email = [config("PERSONAL_EMAIL")]
        reply_email = [data["email"]]
        
    from_email = config("DEFAULT_FROM_EMAIL")
    
    text_content = render_to_string(f"email/{mail_file}.txt", data)
    html_content = render_to_string(f"email/{mail_file}.html", data)

    msg = EmailMultiAlternatives(subject, text_content, from_email, to_email, reply_to=reply_email)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
    
    
def log_mail(data, error_msg=None):
    first_name = data.get("first_name", "")
    last_name = data.get("last_name", "")
    company = data.get("company", "")
    message = data.get("message", "")
    sender_email = data.get("email", "unknown@example.com")

    info = f"""\
First Name: {first_name}
Last Name: {last_name}
Company: {company}

{message}
"""
    
    EmailLog.objects.create(
        sender_email=sender_email,
        send_time=timezone.now(),
        info=info.strip(),
        status="sent" if not error_msg else "failed",
        error_message=error_msg or "",
    )

@require_POST
def contact_api(request):
    if request.POST.get("extra_field"):
        return JsonResponse({"error": "Bot reported."}, status=400)
    
    timestamp = request.POST.get("timestamp")
    now = timezone.now().timestamp()
    delta = now - float(timestamp)
    if delta < 5:
        return JsonResponse({"error": "Too fast"}, status=400)
    
    data = {}
    
    for field in ("first_name", "last_name", "email", "company", "message"):
        data[field] = request.POST.get(field)
    
    if not (data["first_name"] and data["last_name"] and data["email"] and data["message"]) or not re.match(r"[^\s@]+@[^\s@]+\.[^\s@]+", data["email"]):
        return JsonResponse({"error": "Missing required fields"}, status=400)
    
    try:
        send_email(data)
        send_email(data, confirmation=True)
        log_mail(data)
        
        return JsonResponse({"success": "sent"})
    except Exception as error_msg:
        log_mail(data, error_msg)
        return JsonResponse({"error": "Something went wrong while sending your message. Please try again later."}, status=500)
    

def custom_server_error(request, *args, **argv):
    return render(request, "portfolio/500.html", status=500)
