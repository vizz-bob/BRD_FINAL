from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.timezone import now
import logging
from .models import Payment
from collectionagent.dashboard.models import DailyCollection

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Payment)
def update_daily_collection_on_payment(sender, instance, created, **kwargs):
    """
    Automatically update DailyCollection when a Payment is created or updated.
    """
    try:
        print(f"🔔 Signal fired for Payment {instance.id}: amount={instance.amount}, date={instance.collection_date}")
        
        # Get or create DailyCollection for the payment date
        daily_collection, created_collection = DailyCollection.objects.get_or_create(
            date=instance.collection_date,
            defaults={"target_amount": 0, "collected_amount": 0}
        )
        
        # Recalculate total for this date from all payments
        from django.db.models import Sum
        total_for_date = Payment.objects.filter(
            collection_date=instance.collection_date
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        print(f"📊 Total for {instance.collection_date}: {total_for_date}")
        
        # Update with the correct total
        daily_collection.collected_amount = float(total_for_date)
        daily_collection.save(update_fields=['collected_amount'])
        
        print(f"✅ Updated DailyCollection ID {daily_collection.id}: collected_amount={daily_collection.collected_amount}")
        logger.info(f"Updated DailyCollection for {instance.collection_date}: {total_for_date}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        logger.error(f"Error updating DailyCollection for payment {instance.id}: {str(e)}")


@receiver(post_delete, sender=Payment)
def update_daily_collection_on_payment_delete(sender, instance, **kwargs):
    """
    Automatically decrease DailyCollection when a Payment is deleted.
    """
    try:
        daily_collection = DailyCollection.objects.get(date=instance.collection_date)
        
        # Recalculate total for this date
        from django.db.models import Sum
        total_for_date = Payment.objects.filter(
            collection_date=instance.collection_date
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        daily_collection.collected_amount = float(total_for_date)
        daily_collection.save(update_fields=['collected_amount'])
        
        logger.info(f"Updated DailyCollection after delete for {instance.collection_date}: {total_for_date}")
        
    except DailyCollection.DoesNotExist:
        logger.warning(f"DailyCollection not found for date {instance.collection_date}")
    except Exception as e:
        logger.error(f"Error updating DailyCollection on payment delete: {str(e)}")
