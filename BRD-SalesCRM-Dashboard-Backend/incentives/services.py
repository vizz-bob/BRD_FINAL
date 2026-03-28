from django.utils import timezone
from django.db.models import Sum, Count
from datetime import datetime
from pipeline.models import Lead


def calculate_current_month_commission(user):

    now = timezone.now()

    leads = Lead.objects.filter(
        assigned_to=user,
        stage="DISBURSED",
        created_at__month=now.month,
        created_at__year=now.year,
    )

    total_disbursed = leads.aggregate(total=Sum("amount"))["total"] or 0

    # Commission Rules (You can customize)
    disbursed_bonus = total_disbursed * 0.015  # 1.5%
    conversion_bonus = 18000
    speed_bonus = 12400
    team_bonus = 14000

    total = disbursed_bonus + conversion_bonus + speed_bonus + team_bonus

    return {
        "total": round(total, 2),
        "disbursed_bonus": round(disbursed_bonus, 2),
        "conversion_bonus": conversion_bonus,
        "speed_bonus": speed_bonus,
        "team_bonus": team_bonus,
        "disbursed_volume": total_disbursed,
    }


def payment_history(user):

    statements = user.commissionstatement_set.all().order_by("-year", "-month")

    return [
        {
            "month": f"{s.month}/{s.year}",
            "amount": s.total_amount,
            "status": s.status
        }
        for s in statements
    ]