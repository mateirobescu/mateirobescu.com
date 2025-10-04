import os.path

from cloudinary.api import upload_preset
from cloudinary.models import CloudinaryField
from cloudinary.uploader import destroy
from django.db import models
from django.core.validators import RegexValidator
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils.text import slugify

# Create your models here.
class Stack(models.Model):
	name = models.CharField(max_length=50, unique=True)
	icon = models.CharField(max_length=50)
	iconColor = models.CharField(max_length=7, validators=[
		RegexValidator(
			regex="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
			message="Enter a valid HEX color (e.g., #1a2b3c)"
		)])
	order = models.PositiveIntegerField(default=0, db_index=True)
	
	class Meta:
		ordering = ["order"]
	
	@property
	def name_lower(self):
		return self.name.lower()
	
	def clean(self):
		super().clean()
		
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
	hide = models.BooleanField(default=False)
	
	class Meta:
		ordering = ["order"]
	
	
	def __str__(self):
		return self.title
	
	@property
	def data_stacks(self):
		return ";".join(stack.name_lower for stack in self.stacks.all())
	
	@property
	def active(self):
		return not self.hide

		
@receiver(post_delete, sender=Project)
def delete_project_image(sender, instance, **kwargs):
	if instance.image and getattr(instance.image, "public_id", None):
		public_id = str(instance.image)
		print("deleted",public_id)
		print(destroy(public_id))
			
		
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
	
	class Meta:
		ordering = ["-send_time"]
		verbose_name = "Email Log"
		verbose_name_plural = "Email Logs"
	
	def __str__(self):
		return f"{self.sender_email} — {self.status} at {self.send_time:%Y-%m-%d %H:%M}"