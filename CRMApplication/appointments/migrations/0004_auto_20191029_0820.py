# Generated by Django 2.2.3 on 2019-10-29 08:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0003_auto_20191028_1120'),
    ]

    operations = [
        migrations.AlterField(
            model_name='services',
            name='location',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
