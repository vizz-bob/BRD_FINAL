from .models import Lead
from data_lead.utils import parse_file
from django.contrib.auth.models import User
from django.utils import timezone
from .models import CampaignLead
# import requests
import pandas as pd
from django.db import transaction
from ftplib import FTP
#import paramiko



def fetch_from_api(api_url, headers=None, params=None):
    """
    Fetch data from external API and return DataFrame
    """
    response = requests.get(api_url, headers=headers, params=params, timeout=30)
    response.raise_for_status()

    data = response.json()

    # Expecting list of dicts
    return pd.DataFrame(data)
def fetch_from_ftp(
    host,
    username,
    password,
    file_path
):
    """
    Downloads file from FTP and returns DataFrame
    """

    ftp = FTP(host)
    ftp.login(username, password)

    buffer = BytesIO()
    ftp.retrbinary(f"RETR {file_path}", buffer.write)
    ftp.quit()

    buffer.seek(0)

    if file_path.lower().endswith(".csv"):
        df = pd.read_csv(buffer)
    elif file_path.lower().endswith((".xls", ".xlsx")):
        df = pd.read_excel(buffer)
    else:
        raise ValueError("Unsupported FTP file format")

    return df


    leads = []

    for _, row in df.iterrows():
        leads.append(
            CampaignLead(
                campaign=campaign,
                product=campaign.product,
                lead_source=row.get("lead_source"),
                lead_status=row.get("lead_status"),
                contact_name=row.get("contact_name"),
                contact_phone=str(row.get("contact_phone")),
                contact_email=row.get("contact_email"),
                notes=row.get("notes", ""),
                tags=row.get("tags", ""),
                status="UPLOADED",
            )
        )

    CampaignLead.objects.bulk_create(leads, batch_size=500)

    return len(leads)

    campaign = Campaign.objects.get(id=campaign_id)

    try:
        if upload_source == "FILE":
            df = parse_file(file)

        elif upload_source == "API":
            df = fetch_from_api(
                api_url=api_url,
                headers=api_headers,
            )

        elif upload_source == "FTP":
            df = fetch_from_ftp(
                host=ftp_config["host"],
                username=ftp_config["username"],
                password=ftp_config["password"],
                file_path=ftp_config["file_path"],
            )

        else:
            raise ValueError("Invalid upload source")

        count = process_bulkuploads_dataframe(
            df=df,
            campaign=campaign,
            source=upload_source,
        )

        return {
            "status": "SUCCESS",
            "records_created": count,
        }

    except Exception as exc:
        return {
            "status": "FAILED",
            "error": str(exc),
        }

def process_campaign_lead_upload(upload):
    try:
        upload.status = 'PROCESSING'
        upload.save(update_fields=['status'])

        df = parse_file(upload.file)

        leads = []
        for _, row in df.iterrows():
            lead = CampaignLead(
                campaign=upload.campaign,
                product=row.get('product'),
                lead_source=row.get('lead_source'),
                lead_status=row.get('lead_status'),
                contact_name=row.get('contact_name'),
                contact_phone=row.get('contact_phone'),
                contact_email=row.get('contact_email'),
                notes=row.get('notes'),
                follow_up_date=row.get('follow_up_date'),
                conversion_status=row.get('conversion_status'),
                consent_obtained=row.get('consent_obtained', False),
                tags=row.get('tags'),
            )
            leads.append(lead)

        CampaignLead.objects.bulk_create(leads)

        upload.status = 'UPLOADED'
        upload.save(update_fields=['status'])

    except Exception as e:
        upload.status = 'FAILED'
        upload.error_message = str(e)
        upload.save(update_fields=['status', 'error_message'])

def process_third_party_leads(upload):
    try:
        upload.status = 'PROCESSING'
        upload.save(update_fields=['status'])

        df = parse_file(upload.file)

        leads = []
        for _, row in df.iterrows():
            lead = ThirdPartyLead(
                third_party_source=upload.third_party_source,
                third_party_lead_id=row.get('third_party_lead_id'),
                product=row.get('product'),
                campaign_name=row.get('campaign_name'),
                lead_status=row.get('lead_status'),
                contact_name=row.get('contact_name'),
                contact_phone=row.get('contact_phone'),
                contact_email=row.get('contact_email'),
                notes=row.get('notes'),
                follow_up_date=row.get('follow_up_date'),
                consent_obtained=row.get('consent_obtained', False),
                lead_quality=row.get('lead_quality'),
                tags=row.get('tags'),
            )
            leads.append(lead)

        ThirdPartyLead.objects.bulk_create(leads)

        upload.status = 'UPLOADED'
        upload.save(update_fields=['status'])

    except Exception as e:
        upload.status = 'FAILED'
        upload.error_message = str(e)
        upload.save(update_fields=['status', 'error_message'])