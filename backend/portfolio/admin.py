from django.contrib import admin
from modeltranslation.admin import TranslationAdmin, TranslationTabularInline

from .models import Stack, Project, ProjectStack, EmailLog, BulletPoint, CvItem, CvSection, CvFile


# Register your models here.
@admin.register(Stack)
class StackAdmin(admin.ModelAdmin):
    list_display = ("name", "order")
    search_fields = ("name",)
    ordering = ("order",)
    
class ProjectStackInline(admin.TabularInline):
    model=ProjectStack
    extra = 1
    autocomplete_fields = ["stack"]
    ordering = ("order",)
    
    
@admin.register(Project)
class ProjectAdmin(TranslationAdmin):
    list_display = ("title", "is_visible", "order")
    search_fields = ("title",)
    inlines = [ProjectStackInline]
    ordering = ("order",)

@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ("send_time", "sender_email")
    search_fields = ("sender_email",)
    ordering = ("-send_time",)
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
    
class BulletPointInline(TranslationTabularInline):
    model = BulletPoint
    extra = 1
    
@admin.register(CvItem)
class CvItemAdmin(TranslationAdmin):
    list_display = ('__str__', 'cv_section', 'order', 'is_visible')
    list_editable = ('order', 'is_visible')
    inlines = [BulletPointInline]
    
class CvItemInline(TranslationTabularInline):
    model = CvItem
    extra = 1

@admin.register(CvSection)
class CvSectionAdmin(TranslationAdmin):
    list_display = ('name', 'order', 'is_visible')
    list_editable = ('order', 'is_visible')
    inlines = [CvItemInline]

@admin.register(CvFile)
class CvFileAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        if CvFile.objects.exists():
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        return False