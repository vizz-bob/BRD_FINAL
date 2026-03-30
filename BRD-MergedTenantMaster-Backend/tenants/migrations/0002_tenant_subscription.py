# Placeholder migration — 0003 depends on this.
# The original 0002 was not committed; this stub keeps the chain intact.

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tenants', '0001_initial'),
    ]

    operations = [
        # No-op: this migration was lost; 0003 carries the real changes.
    ]
