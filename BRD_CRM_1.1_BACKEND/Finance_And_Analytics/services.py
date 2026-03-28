# financial/services/notifications.py

def send_whatsapp(phone, message):
    """
    Integrate Twilio / Meta WhatsApp Cloud later
    """
    print(f"[WHATSAPP] {phone}: {message}")
    return {"status": "sent"}


def send_sms(phone, message):
    """
    Integrate Twilio / AWS SNS
    """
    print(f"[SMS] {phone}: {message}")
    return {"status": "sent"}


def trigger_ivr(phone):
    """
    Integrate IVR provider (Exotel, Knowlarity)
    """
    print(f"[IVR CALL] Calling {phone}")
    return {"status": "initiated"}

