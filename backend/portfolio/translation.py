from modeltranslation.translator import register, TranslationOptions
from .models import Project, CvSection, CvItem, BulletPoint


@register(Project)
class ProjectTranslationOptions(TranslationOptions):
    fields = ('title', 'description')
    
@register(CvSection)
class CvSectionTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(CvItem)
class CvItemTranslationOptions(TranslationOptions):
    fields = ('title', 'subtitle', 'location', 'start_date', 'end_date')

@register(BulletPoint)
class BulletPointTranslationOptions(TranslationOptions):
    fields = ('text',)