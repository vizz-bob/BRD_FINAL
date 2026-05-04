from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pendingtask',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='pendingtask',
            name='due_date',
        ),
        migrations.RemoveField(
            model_name='pendingtask',
            name='is_completed',
        ),
        migrations.AddField(
            model_name='pendingtask',
            name='status',
            field=models.CharField(choices=[('COMPLETE', 'COMPLETE'), ('INCOMPLETE', 'INCOMPLETE')], default='INCOMPLETE', max_length=20),
            preserve_default=False,
        ),
    ]
