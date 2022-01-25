from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

# Create your models here.
class User(AbstractUser):
    finance_id = models.PositiveSmallIntegerField(),
    start_date = models.DateTimeField(auto_now_add=True),
    end_date = models.DateTimeField(null=True, blank=True),

    def __str__(self):
        return self.username