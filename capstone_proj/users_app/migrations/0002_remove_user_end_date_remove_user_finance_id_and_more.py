# Generated by Django 4.0.1 on 2022-01-25 04:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users_app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='end_date',
        ),
        migrations.RemoveField(
            model_name='user',
            name='finance_id',
        ),
        migrations.RemoveField(
            model_name='user',
            name='start_date',
        ),
    ]
