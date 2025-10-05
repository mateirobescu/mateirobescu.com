from django.contrib import admin
from .models import Stack, Project, ProjectStack, EmailLog


# Register your models here.
@admin.register(Stack)
class StackAdmin(admin.ModelAdmin):
    list_display = ("name", "icon", "iconColor")
    search_fields = ("name",)
    ordering = ("order",)
    
class ProjectStackInline(admin.TabularInline):
    model=ProjectStack
    extra = 1
    autocomplete_fields = ["stack"]
    ordering = ("order",)
    
    
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "active", "order")
    search_fields = ("title",)
    inlines = [ProjectStackInline]
    ordering = ("order",)

@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ("send_time", "sender_email")
    search_fields = ("sender_email",)
    ordering = ("send_time",)
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False