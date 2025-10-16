from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import handler500
from portfolio.views import custom_server_error


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('portfolio.urls')),
    path("i18n/", include("django.conf.urls.i18n")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


handler500 = custom_server_error
