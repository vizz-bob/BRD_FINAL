from django.db import models


# ==================================================
# AGENT MASTER MODELS (REQUIRED – DO NOT REMOVE)
# ==================================================
# These exist ONLY to satisfy imports from agent_management
# They will NOT be used in admin or APIs if you don’t want

class AgentType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class AgentCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class AgentLevel(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class AgentConstitution(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class AgentServiceType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class AgentLocation(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name


class AgentResponsibility(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# ==================================================
# PROFILE MODELS (INPUT-BASED – YOUR REQUIREMENT)
# ==================================================

class VendorProfile(models.Model):
    vendor_type = models.CharField(max_length=100)
    vendor_category = models.CharField(max_length=100)
    vendor_constitution = models.CharField(max_length=100)
    vendor_location = models.CharField(max_length=150)
    vendor_service_type = models.CharField(max_length=150)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vendor_type} - {self.vendor_category}"


class AgentProfile(models.Model):
    agent_type = models.CharField(max_length=100)
    agent_category = models.CharField(max_length=100)
    agent_level = models.CharField(max_length=50)
    agent_constitution = models.CharField(max_length=100)
    agent_location = models.CharField(max_length=150)
    agent_service_type = models.CharField(max_length=150)

    agent_responsibility = models.TextField(
        help_text="Comma separated values e.g. Sourcing,Collection,Support"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.agent_type} - {self.agent_category}"


class ClientProfile(models.Model):
    client_category = models.CharField(max_length=100)
    client_type = models.CharField(max_length=100)
    constitution = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    industry = models.CharField(max_length=100)
    sector = models.CharField(max_length=100)
    applicant_type = models.CharField(max_length=100)

    employment_type = models.CharField(max_length=100)
    employment_category = models.CharField(max_length=100)
    employer_type = models.CharField(max_length=100)
    employer = models.CharField(max_length=150)

    qualification = models.CharField(max_length=100)
    occupation_type = models.CharField(max_length=100)
    occupation = models.CharField(max_length=100)
    mode_of_occupation = models.CharField(max_length=100)

    institution = models.CharField(max_length=150)
    membership_type = models.CharField(max_length=100)
    gender_salute = models.CharField(max_length=50)
    relationship = models.CharField(max_length=100)
    address_type = models.CharField(max_length=100)
    ownership = models.CharField(max_length=100)

    employee_quota = models.CharField(max_length=50)
    group_loans = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client_category} - {self.client_type}"
