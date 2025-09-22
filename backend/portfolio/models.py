import os.path

from django.db import models
from django.core.validators import RegexValidator
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
	
	
def project_image_path(instance, filename):
	project_slug = slugify(instance.title)
	ext = filename.split('.')[-1]
	
	filename = f"{project_slug}.{ext}"
	
	return os.path.join("projects", project_slug, filename)
	
	
class Project(models.Model):
	title = models.CharField(max_length=50, unique=True)
	description = models.TextField()
	image = models.ImageField(upload_to=project_image_path,)
	stacks = models.ManyToManyField(Stack, through="ProjectStack", related_name="projects")
	github_url = models.URLField(null=True, blank=True)
	live_demo_url = models.URLField(null=True, blank=True)
	order = models.PositiveIntegerField(default=0)
	
	class Meta:
		ordering = ["order"]
	
	
	def __str__(self):
		return self.title
	
	@property
	def data_stacks(self):
		return ";".join(stack.name_lower for stack in self.stacks.all())
		
		
class ProjectStack(models.Model):
	project = models.ForeignKey("Project", on_delete=models.CASCADE, related_name="projects_stacks")
	stack = models.ForeignKey("Stack", on_delete=models.CASCADE, related_name="projects_stacks")
	order = models.PositiveIntegerField(default=0)
	
	class Meta:
		ordering = ["order"]
		unique_together = ("project", "stack")
	
	def __str__(self):
		return f"{self.project.title} - {self.stack.name} ({self.order})"