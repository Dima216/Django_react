# Generated by Django 3.1.3 on 2021-05-02 06:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0009_auto_20210307_1147'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='currency',
        ),
        migrations.AddField(
            model_name='transaction',
            name='current_exchange',
            field=models.FloatField(null=True, verbose_name='Current exchange'),
        ),
    ]