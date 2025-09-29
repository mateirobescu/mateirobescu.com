from django.contrib import admin
from .models import Stack, Project, ProjectStack

# Register your models here.
@admin.register(Stack)
class StackAdmin(admin.ModelAdmin):
    list_display = ("name", "icon", "iconColor", "order")
    search_fields = ("name",)
    ordering = ("order",)
    
class ProjectStackInline(admin.TabularInline):
    model=ProjectStack
    extra = 1
    autocomplete_fields = ["stack"]
    ordering = ("order",)
    
    
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "hide")
    # hide.boolean = True
    search_fields = ("title",)
    inlines = [ProjectStackInline]
    ordering = ("order",)
