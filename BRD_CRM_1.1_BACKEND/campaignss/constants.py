# =====================================================
# PRODUCT CHOICES
# =====================================================

PRODUCT_CHOICES = [
    ("home_loan", "Home Loan"),
    ("personal_loan", "Personal Loan"),
    ("business_loan", "Business Loan"),
    ("car_loan", "Car Loan"),
    ("education_loan", "Education Loan"),
]


# =====================================================
# AUDIENCE GROUPS
# =====================================================

AUDIENCE_GROUPS = [
    ("warm_leads", "Warm Leads"),
    ("cold_leads", "Cold Leads"),
    ("hot_leads", "Hot Leads"),
    ("home_loan_prospects", "Home Loan Prospects"),
    ("business_owners", "Business Owners"),
    ("recent_inquiries", "Recent Inquiries"),
    ("sms_subscribers", "SMS Subscribers"),
]

TARGET_AUDIENCE_CHOICES = AUDIENCE_GROUPS


# =====================================================
# DIALER TYPES
# =====================================================

DIALER_TYPES = [
    ("preview", "Preview Dialer"),
    ("progressive", "Progressive Dialer"),
    ("predictive", "Predictive Dialer"),
]


# =====================================================
# AGENT GROUPS
# =====================================================

AGENT_GROUPS = [
    ("team_alpha", "Team Alpha"),
    ("team_beta", "Team Beta"),
    ("external_agency", "External Agency"),
]


# =====================================================
# TIMING
# =====================================================

TIMING_CHOICES = [
    ("now", "Start Now"),
    ("schedule", "Schedule for Later"),
]


# =====================================================
# EMAIL TEMPLATES
# =====================================================

EMAIL_TEMPLATES = [
    ("professional_blue", "Professional Blue"),
    ("modern_gradient", "Modern Gradient"),
    ("minimal_white", "Minimal White"),
]


# =====================================================
# SMS TEMPLATES
# =====================================================

SMS_TEMPLATES = [
    (
        "promo_1",
        "Flash Sale | Flash Sale! Get 20% off all {{product}} loans this week only. Apply here: {{link}}",
    ),
    (
        "remind_1",
        "Follow-Up | Hi {{firstName}}, following up on your inquiry about {{product}}. Do you have any questions?",
    ),
    (
        "alert_1",
        "Rate Alert | Good news! Interest rates for {{product}} just dropped to {{rate}}%. Check eligibility: {{link}}",
    ),
]


# =====================================================
# VOICE SOURCE
# =====================================================

VOICE_SOURCE_CHOICES = [
    ("upload", "Upload Audio"),
    ("tts", "Text To Speech"),
]


# =====================================================
# RETRY ATTEMPTS
# =====================================================

RETRY_ATTEMPTS = [
    (0, "No Retry"),
    (1, "1 Retry"),
    (2, "2 Retries"),
]
