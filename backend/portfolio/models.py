from cloudinary.models import CloudinaryField
from cloudinary.uploader import destroy
from django.db import models
from django.core.validators import RegexValidator
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

# Create your models here.
class Stack(models.Model):
	name = models.CharField(max_length=50, unique=True)
	icon = models.CharField(max_length=50)
	iconColor = models.CharField(max_length=7, null=True, blank=True, validators=[
		RegexValidator(
			regex="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
			message="Enter a valid HEX color (e.g., #1a2b3c)"
		)])
	order = models.PositiveIntegerField(default=0, db_index=True)
	is_filterable = models.BooleanField(default=False)
	is_visible = models.BooleanField(default=True)
	
	class Meta:
		ordering = ["order"]
	
	@property
	def name_lower(self):
		return self.name.lower()
	
	def clean(self):
		super().clean()
		
		if not self.iconColor:
			return
		
		self.iconColor = self.iconColor.lower()
		if len(self.iconColor) == 4:
			self.iconColor = "#" + "".join([ch * 2 for ch in self.iconColor[1:]])
			
	def save(self, *args, **kwargs):
		self.full_clean()
		super().save(*args, **kwargs)


	def __str__(self):
		return self.name


class Project(models.Model):
	title = models.CharField(max_length=50, unique=True)
	description = models.TextField()
	image = CloudinaryField('img', null=True, blank=True, upload_preset="projects_default")
	stacks = models.ManyToManyField(Stack, through="ProjectStack", related_name="projects")
	github_url = models.URLField(null=True, blank=True)
	live_demo_url = models.URLField(null=True, blank=True)
	order = models.PositiveIntegerField(default=0)
	is_visible = models.BooleanField(default=True)
	
	class Meta:
		ordering = ["order"]
	
	
	def __str__(self):
		return self.title
	
	def ordered_stacks(self):
		return self.stacks.all().order_by("projects_stacks__order")
	
	@property
	def data_stacks(self):
		return ";".join(stack.name_lower for stack in self.stacks.all())
		
@receiver(post_delete, sender=Project)
def delete_project_image(sender, instance, **kwargs):
	if instance.image and getattr(instance.image, "public_id", None):
		public_id = str(instance.image.public_id)
		destroy(public_id, invalidate=True)
		
@receiver(pre_save, sender=Project)
def delete_changed_project_image(sender, instance, **kwargs):
	if not instance.pk:
		return
	try:
		old_image = sender.objects.get(pk=instance.pk).image
	except sender.DoesNotExist:
		return
	
	new_image = instance.image
	if old_image and str(old_image) != str(new_image):
		if hasattr(old_image, "public_id"):
			public_id = str(old_image.public_id)
			destroy(public_id, invalidate=True)
	
		
class ProjectStack(models.Model):
	project = models.ForeignKey("Project", on_delete=models.CASCADE, related_name="projects_stacks")
	stack = models.ForeignKey("Stack", on_delete=models.CASCADE, related_name="projects_stacks")
	order = models.PositiveIntegerField(default=0)
	
	class Meta:
		ordering = ["order"]
		unique_together = ("project", "stack")
	
	def __str__(self):
		return f"{self.project.title} - {self.stack.name} ({self.order})"
	

class EmailLog(models.Model):
	sender_email = models.EmailField()
	send_time = models.DateTimeField()
	info = models.TextField()
	status = models.CharField(max_length=20, choices=[
		("sent", "Sent"),
		("failed", "Failed"),
	])
	error_message = models.TextField(blank=True, null=True)
	recaptcha_score = models.FloatField(null=True, blank=True)
	
	class Meta:
		ordering = ["-send_time"]
		verbose_name = "Email Log"
		verbose_name_plural = "Email Logs"
	
	def __str__(self):
		return f"{self.sender_email} — {self.status} at {self.send_time:%Y-%m-%d %H:%M}"
	
	
class CvSection(models.Model):
	name = models.CharField(max_length=100, blank=False)
	is_visible = models.BooleanField(default=True)
	order = models.PositiveIntegerField(default=0)
	
	class Meta:
		ordering = ["order"]
		verbose_name = "CV Section"
		verbose_name_plural = "CV Sections"

		
	def __str__(self):
			return self.name
		
		
class CvItem(models.Model):
	cv_section = models.ForeignKey('CvSection', null=False, related_name='items',on_delete=models.CASCADE)
	title = models.CharField(max_length=100, blank=True)
	subtitle = models.CharField(max_length=200, blank=True)
	start_date = models.CharField(max_length=50, blank=True)
	end_date = models.CharField(max_length=50, blank=True)
	location = models.CharField(max_length=50, blank=True)
	is_visible = models.BooleanField(default=True)
	order = models.PositiveIntegerField(default=0)
	
	class Meta:
		ordering = ["order"]
		verbose_name = "CV Item"
		verbose_name_plural = "CV Items"
	
	def __str__(self):
		if self.title:
			return self.title
		if self.subtitle:
			return self.subtitle
		return f"Untitled Item ({self.cv_section.name} #{self.pk or 'New'})"

class BulletPoint(models.Model):
	cv_item = models.ForeignKey('CvItem', null=False,  related_name='bullets', on_delete=models.CASCADE)
	text = models.TextField(blank=False)
	is_visible = models.BooleanField(default=True)
	order = models.PositiveIntegerField(default=0)
	
	class Meta:
		ordering = ["order"]
		verbose_name = "CV Bullet Point"
		verbose_name_plural = "CV Bullet Points"
		
	def __str__(self):
		return self.text[:50]
	

class CvFile(models.Model):
	file = CloudinaryField('raw', resource_type='raw', null=True, blank=True, upload_preset="cv_default")
	updated_at = models.DateTimeField(auto_now=True)
	
	class Meta:
		verbose_name = "CV PDF"
		verbose_name_plural = "CV PDF"
	
	def save(self, *args, **kwargs):
		self.pk = 1
		super(CvFile, self).save(*args, **kwargs)
	
	def delete(self, *args, **kwargs):
		pass
	
	def __str__(self):
		return "Your CV PDF (Main)"
	
@receiver(pre_save, sender=CvFile)
def delete_old_cv(sender, instance, **kwargs):
	if not instance.pk:
		return
	try:
		old_file = sender.objects.get(pk=instance.pk).file
	except sender.DoesNotExist:
		return
	
	new_file = instance.file
	if old_file and str(old_file) != str(new_file):
		if hasattr(old_file, "public_id"):
			public_id = str(old_file.public_id) + ".pdf"
			destroy(public_id, resource_type='raw', invalidate=True)