"""
WSGI config for mateirobescu project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mateirobescu.settings')

application = get_wsgi_application()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.getenv("USER", "admin")
email = os.getenv("EMAIL", "admin@example.com")
password = os.getenv("PASSWORD", "changeme123")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )