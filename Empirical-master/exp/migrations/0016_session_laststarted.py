# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-07-10 17:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exp', '0015_auto_20160710_1232'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='lastStarted',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
