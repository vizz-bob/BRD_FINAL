import uuid
import random
from django.conf import settings
from datetime import datetime


class SmartVerificationService:
    """
    Mock integration layer for external verifications.
    Replace methods with real API calls in production.
    """

    @staticmethod
    def perform_penny_drop(account_number, ifsc_code):
        """
        Simulates bank account verification (Penny Drop).
        """

        reference_id = str(uuid.uuid4())
        is_success = random.choice([True, True, False])  # 66% success

        response = {
            "reference_id": reference_id,
            "verified": is_success,
            "account_holder_name": None,
            "message": None,
            "timestamp": datetime.utcnow().isoformat()
        }

        if is_success:
            response.update({
                "account_holder_name": "TEST USER",
                "message": "Bank account verified successfully"
            })
        else:
            response.update({
                "message": "Bank account verification failed"
            })

        return response

    @staticmethod
    def generate_sanction_letter_pdf(application):
        """
        Mock sanction letter generation.
        """

        reference_id = str(uuid.uuid4())

        file_name = f"Sanction_{application.application_id}.pdf"

        return {
            "reference_id": reference_id,
            "document_type": "SANCTION_LETTER",
            "file_name": file_name,
            "status": "GENERATED",
            "generated_at": datetime.utcnow().isoformat()
        }
