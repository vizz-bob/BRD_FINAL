from django.utils import timezone


def sync_crm_tool(tool):
    # Here you would integrate actual API logic
    tool.last_synced_at = timezone.now()
    tool.save()
    return True