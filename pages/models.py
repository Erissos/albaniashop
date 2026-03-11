from django.db import models


class StaticPage(models.Model):
	title = models.CharField(max_length=160)
	slug = models.SlugField(max_length=180, unique=True)
	content = models.TextField()
	is_published = models.BooleanField(default=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['title']

	def __str__(self):
		return self.title


class ContactMessage(models.Model):
	name = models.CharField(max_length=120)
	email = models.EmailField()
	subject = models.CharField(max_length=160)
	message = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	is_read = models.BooleanField(default=False)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f'{self.name} - {self.subject}'


class SiteSetting(models.Model):
	site_name = models.CharField(max_length=120, default='Albaniashop')
	email = models.EmailField(blank=True)
	phone = models.CharField(max_length=30, blank=True)
	address = models.TextField(blank=True)
	whatsapp_number = models.CharField(max_length=30, blank=True)

	def __str__(self):
		return self.site_name
