# from django.db.models.signals import post_migrate
# from django.dispatch import receiver
# from django.contrib.auth import get_user_model

# from .models import Role, Permission, RolePermission, UserRole


# @receiver(post_migrate)
# def setup_master_admin(sender, **kwargs):
#     """
#     Runs after migrate:
#     - creates all permissions
#     - creates Master Admin role
#     - assigns all permissions to Master Admin
#     """

#     # 🔑 ALL PERMISSIONS (single source of truth)
#     permission_list = [
#         ("dashboard.view", "View dashboard"),
#         ("organizations.view", "View organizations"),
#         ("users.view", "View users"),
#         ("roles.view", "View roles"),
#         ("subscriptions.view", "View subscriptions"),

#         ("approval.view", "View approvals"),
#         ("approval.manage", "Manage approvals"),
#         ("approval.escalation", "Approval escalation"),

#         ("product.view", "View products"),
#         ("product.manage", "Manage products"),
#         ("product.mix", "Manage product mix"),
#         ("fees.view", "View fees"),
#         ("charges.view", "View charges"),
#         ("interest.view", "View interest"),
#         ("repayment.view", "View repayment"),
#         ("penalties.view", "View penalties"),
#         ("moratorium.view", "View moratorium"),

#         ("loan.view", "View loan improvement"),
#         ("currency.view", "View currency"),
#         ("concession.view", "View concession"),

#         ("eligibility.view", "View eligibility"),
#         ("eligibility.create", "Create eligibility"),
#         ("eligibility.update", "Update eligibility"),

#         ("banking.view", "View banking"),
#         ("banking.create", "Create banking"),
#         ("banking.update", "Update banking"),

#         ("obligation.view", "View obligation"),
#         ("obligation.create", "Create obligation"),
#         ("obligation.update", "Update obligation"),

#         ("score.view", "View score card"),
#         ("score.create", "Create score card"),
#         ("score.update", "Update score card"),

#         ("template.view", "View templates"),
#         ("template.predefine", "Predefine templates"),
#         ("template.customize", "Customize templates"),

#         ("bankfund.view", "View bank & fund"),
#         ("bank.view", "View bank"),
#         ("fund.view", "View fund"),
#         ("portfolio.view", "View portfolio"),
#         ("mode.view", "View mode of bank"),
#         ("tax.view", "View taxation"),
#         ("business.view", "View business model"),

#         ("profile.view", "View profiles"),
#         ("profile.vendor", "Vendor profile"),
#         ("profile.agent", "Agent profile"),
#         ("profile.client", "Client profile"),

#         ("agent.view", "View agents"),
#         ("agent.channel", "Channel partner"),
#         ("agent.verification", "Verification agency"),
#         ("agent.collection", "Collection agent"),
#         ("agent.legal", "Legal agent"),

#         ("controls.view", "View controls"),
#         ("controls.language", "Manage language"),
#         ("controls.geo", "Manage geo"),
#         ("controls.login", "Login authentication"),
#         ("controls.coapplicant", "Co-applicant"),
#         ("controls.loginfee", "Login fee"),
#         ("controls.joint", "Joint applicant"),
#         ("controls.references", "References"),
#         ("controls.application", "Application process"),
#         ("controls.scorecard", "Score card rating"),
#         ("controls.verification", "Verification"),

#         ("rules.view", "View rules"),
#         ("rules.master", "Rule master"),
#         ("rules.impact", "Impact values"),
#         ("rules.client", "Client profile rules"),
#         ("rules.collateral", "Collateral quality"),
#         ("rules.financial", "Financial eligibility"),
#         ("rules.scorecard", "Rule score card"),
#         ("rules.risk", "Risk & mitigation"),
#         ("rules.verification", "Verification rules"),

#         ("audit.view", "View audits"),
#         ("reports.view", "View reports"),

#         ("employment.view", "View employment types"),
#         ("occupation.view", "View occupation types"),
#     ]

#     # 1️⃣ Create permissions
#     permission_objs = []
#     for code, desc in permission_list:
#         perm, _ = Permission.objects.get_or_create(
#             code=code,
#             defaults={"description": desc}
#         )
#         permission_objs.append(perm)

#     # 2️⃣ Create Master Admin role
#     master_role, _ = Role.objects.get_or_create(
#         name="Master Admin",
#         defaults={
#             "description": "System super administrator",
#             "is_active": True,
#         }
#     )

#     # 3️⃣ Assign all permissions to Master Admin
#     for perm in permission_objs:
#         RolePermission.objects.get_or_create(
#             role=master_role,
#             permission=perm
#         )


# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.contrib.auth import get_user_model


# User = get_user_model()


# @receiver(post_save, sender=User)
# def assign_master_admin_to_superuser(sender, instance, created, **kwargs):
#     """
#     Whenever createsuperuser is run:
#     - Assign Master Admin role automatically
#     """

#     if not instance.is_superuser:
#         return

#     master_role = Role.objects.filter(name="Master Admin").first()
#     if not master_role:
#         return

#     UserRole.objects.get_or_create(
#         user=instance,
#         role=master_role
#     )


from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.apps import apps

User = get_user_model()

# ------------------- POST MIGRATE -------------------
@receiver(post_migrate)
def setup_master_admin(sender, **kwargs):
    Role = apps.get_model("access_control", "Role")
    Permission = apps.get_model("access_control", "Permission")
    RolePermission = apps.get_model("access_control", "RolePermission")
    UserRole = apps.get_model("access_control", "UserRole")

    # Create Master Admin role
    master_role, _ = Role.objects.get_or_create(
        name="Master Admin",
        defaults={"description": "System Super Administrator"}
    )

    # Define all permissions
    PERMISSIONS = [

        # ========== Dasboard ==========
        ("dashboard.view", "View dashboard"),

        # ========== Organization ==========
        ("organization.view", "View organizations"),
        ("organization.create", "Create organizations"),
        ("organization.update", "Edit organizations"),

        # ========== Branch ==========
        ("branch.view", "View Branch"),
        ("branch.create", "Create Branch"),
        ("branch.update", "Edit Branch"),

        # ========== User ==========
        ("users.view", "View users"),
        ("users.create", "Create users"),

        # ========== Roles and Permissions ==========
        ("roles.view", "View roles"),
        ("roles.create", "Create roles"),
        ("permission.create", "Create Permissions"),
        ("permission.assign", "Assingn Permissions"),

        # ========== Subscription ==========
        ("subscriptions.view", "View subscriptions"),
        ("subscriptions.create", "Create subscriptions"),
        ("subscriptions.update", "Edit subscriptions"),
        ("coupon.create", "Create Coupon"),
        ("coupon.view", "View Coupon"),
        ("subscriber.view", "View subscribers"),

        # ========== Approval Master ==========
        ("approval.view", "View approvals"),
        ("approval.create", "Create approvals"),
        ("approval.update", "Edit approvals"),
        ("approval.assign", "Assign approvals"),
        ("approval.escalation", "Approval escalation"),

        # ========== Product Management ==========
        ("product.view", "View products"),
        ("product.create", "Create products"),
        ("product.update", "Update products"),
        ("product_mix.view", "view product mix"),
        ("product_mix.create", "Create product mix"),
        ("product_mix.update", "Edit product mix"),
        ("fees.view", "View fees"),
        ("fees.create", "Create fees"),
        ("fees.update", "Update fees"),
        ("charges.view", "View charges"),
        ("charges.create", "Create charges"),
        ("charges.update", "Update charges"),
        ("interest.view", "View interest"),
        ("interest.create", "Create interest"),
        ("interest.update", "Update interest"),
        ("repayment.view", "View repayment"),
        ("repayment.create", "Create repayment"),
        ("repayment.update", "Edit repayment"),
        ("penalties.view", "View penalties"),
        ("penalties.create", "Create penalties"),
        ("penalties.update", "Edit penalties"),
        ("moratorium.view", "View moratorium"),
        ("moratorium.create", "Create moratorium"),
        ("moratorium.update", "Edit moratorium"),

        ("loan_improvement.view", "View loan improvement"),
        ("loan_improvement.update", "Edit loan improvement"),

        # ========== Currency ==========
        ("currency.view", "View currency"),
        ("currency.create", "Create currency"),
        ("currency.update", "Edit currency"),

        # ========== Concession ==========
        ("concession.view", "View concession"),
        ("concession_type.create", "Create concession type"),
        ("concession_type.update", "Edit concession type"),
        ("concession_type.view", "View concession type"),
        ("concession_category.view", "View concession category"),
        ("concession_category.create", "Create concession category"),
        ("concession_category.update", "Edit concession category"),

        # ========== Eligibility & Score Management ==========
        ("eligibility.view", "View eligibility"),
        ("eligibility.create", "Create eligibility"),
        ("eligibility.update", "Update eligibility"),

        ("banking.view", "View banking"),
        ("banking.create", "Create banking"),
        ("banking.update", "Update banking"),

        ("obligation.view", "View obligation"),
        ("obligation.create", "Create obligation"),
        ("obligation.update", "Update obligation"),

        ("score.view", "View score card"),
        ("score.create", "Create score card"),
        ("score.update", "Update score card"),

        # ========== Template Managemnet ==========
        ("template.view", "View templates"),
        ("template.predefine", "Predefine templates"),
        ("template.customize", "Customize templates"),

        # ========== Bank & Fund ==========
        ("bank.view", "View bank"),
        ("bank.create", "Create bank"),
        ("bank.update", "Edit bank"),
        ("fund.view", "View fund"),
        ("fund.create", "Create fund"),
        ("fund.update", "Edit fund"),
        ("portfolio.view", "View portfolio"),
        ("portfolio.create", "Create portfolio"),
        ("portfolio.Update", "Edit portfolio"),
        ("mode.view", "View mode of bank"),
        ("tax.view", "View taxation"),
        ("business.view", "View business model"),

        ("profile_management.view", "View Profile Management"),
        ("vendor.view", "View Vendor Profile"),
        ("vendor.create", "Create Vendor Profile"),
        ("vendor.update", "Edit Vendor Profile"),
        ("agent.view", "View Agent Profile"),
        ("agent.create", "Create Agent profile"),
        ("agent.update", "Edit Agent profile"),
        ("client.view", "View Client Profile"),
        ("client.create", "Create Client profile"),
        ("client.update", "Edit Client profile"),

        ("channel_partners.view", "View Channel Partner"),
        ("channel_partners.create", "Create Channel Partner"),
        ("channel_partners.update", "Edit Channel Partner"),
        ("collection_agent.view", "View Collection Agent"),
        ("collection_agent.create", "Create Collection Agent"),
        ("collection_agent.update", "Edit Collection Agent"),
        ("legal_agent.view", "View Legal Agent"),
        ("legal_agent.create", "Create Legal Agent"),
        ("legal_agent.update", "Edit Legal Agent"),
        ("verification_agency.view", "View Verification Agency"),
        ("verification_agency.create", "Create Verification Agency"),
        ("verification_agency.update", "Edit Verification Agency"),

        ("language.view", "View language"),
        ("language.create", "Create language"),
        ("language.update", "Edit language"),
        ("geo.view", "View geo location"),
        ("geo.create", "Create geo location"),
        ("geo.update", "Edit geo location"),
        ("login_auth.view", "View Login authentication"),
        ("login_auth.create", "Create Login authentication"),
        ("login_auth.update", "Edit Login authentication"),
        ("coapplicant.view", "View Co-applicant"),
        ("coapplicant.create", "Create Co-applicant"),
        ("coapplicant.update", "Edit Co-applicant"),
        ("loginfee.view", "View Login fee"),
        ("loginfee.create", "Create Login fee"),
        ("loginfee.update", "Edit Login fee"),
        ("joint_applicant.view", "View Joint applicant"),
        ("joint_applicant.create", "Create Joint applicant"),
        ("joint_applicant.update", "Edit Joint applicant"),
        ("references.view", "View References"),
        ("references.create", "Create References"),
        ("references.update", "Edit References"),
        ("application.view", "View Application process"),
        ("application.create", "Create Application process"),
        ("application.update", "Edit Application process"),
        ("scorecard.view", "View Score card rating"),
        ("scorecard.create", "Create Score card rating"),
        ("scorecard.update", "Edit Score card rating"),
        ("verification.view", "View Verification"),
        ("verification.create", "Create Verification"),
        ("verification.update", "Edit Verification"),

        ("rules.view", "View rules"),
        ("rules.master", "Rule master"),
        ("rules.impact", "Impact values"),
        ("rules.client", "Client profile rules"),
        ("rules.collateral", "Collateral quality"),
        ("rules.financial", "Financial eligibility"),
        ("rules.scorecard", "Rule score card"),
        ("rules.risk", "Risk & mitigation"),
        ("rules.verification", "Verification rules"),

        ("audit.view", "View audits"),
        ("reports.view", "View reports"),

        ("employment.view", "View employment types"),
        ("occupation.view", "View occupation types"),
    ]

    # Create permissions + attach to Master Admin
    for code, desc in PERMISSIONS:
        perm, _ = Permission.objects.get_or_create(code=code, defaults={"description": desc})
        RolePermission.objects.get_or_create(role=master_role, permission=perm)

    # Assign role to all superusers
    for user in User.objects.filter(is_superuser=True):
        UserRole.objects.get_or_create(user=user, role=master_role)

# ------------------- POST SAVE -------------------
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.apps import apps

User = get_user_model()

@receiver(post_save, sender=User)
def auto_assign_master_admin(sender, instance, created, **kwargs):
    if not created:
        return

    if not instance.is_superuser:
        return

    Role = apps.get_model("access_control", "Role")
    UserRole = apps.get_model("access_control", "UserRole")

    master_role, _ = Role.objects.get_or_create(
        name="Master Admin",
        defaults={
            "description": "System Super Administrator",
            "is_active": True,
        }
    )

    # 🔥 THIS CREATES ENTRY IN UserRole TABLE
    UserRole.objects.get_or_create(
        user=instance,
        role=master_role
    )
