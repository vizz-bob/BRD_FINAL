# from django.contrib import admin
# from import_export.admin import ImportExportModelAdmin
# from .models import QualifiedLead, Eligibility, DocumentCollection, ContactLead

# class EligibilityInline(admin.StackedInline):
#     model = Eligibility
#     fk_name = "lead"
#     can_delete = False
#     readonly_fields = (
#         "document_score",
#         "income_score",
#         "credit_score",
#         "property_score",
#         "overall_percentage",
#         "status",
#         "updated_at",
#     )
#     extra = 0

# class StatusFilter(admin.SimpleListFilter):
#     title = "Status"
#     parameter_name = "status"

#     def lookups(self, request, model_admin):
#         return (
#             ("all", "All Status"),
#             ("under_review", "Under Review"),
#             ("approved", "Approved"),
#             ("rejected", "Rejected"),
#         )

#     def queryset(self, request, queryset):
#         if self.value() == "all" or self.value() is None:
#             return queryset
#         return queryset.filter(status=self.value())

# @admin.register(QualifiedLead)
# class QualifiedLeadAdmin(ImportExportModelAdmin):
#     list_display = (
#         "display_lead_id",
#         "display_name",
#         "display_phone",
#         "interest",
#         "status",
#         "priority",
#         "updated_at",
#     )
#     inlines = [EligibilityInline]
#     list_filter = (StatusFilter,)
#     search_fields = (
#         "pipeline_lead__lead__name",
#         "pipeline_lead__lead__phone",
#     )
#     readonly_fields = ("updated_at",)

#     def display_lead_id(self, obj):
#         return obj.lead_id if obj.lead_id else "N/A"
#     display_lead_id.short_description = "Lead ID"

#     def display_name(self, obj):
#         return obj.name if obj.name else "N/A"
#     display_name.short_description = "Name"

#     def display_phone(self, obj):
#         return obj.phone_number if obj.phone_number else "N/A"
#     display_phone.short_description = "Phone"

# @admin.register(DocumentCollection)
# class DocumentCollectionAdmin(ImportExportModelAdmin):
#     list_display = ("lead", "pan_card", "aadhar_card")

# @admin.register(ContactLead)
# class ContactLeadAdmin(ImportExportModelAdmin):
#     list_display = ("lead_name", "phone_number", "email", "status", "created_at")
#     list_filter = ("status",)
#     search_fields = ("lead_name", "phone_number", "email")


# from django.contrib import admin
# from import_export.admin import ImportExportModelAdmin
# from .models import QualifiedLead, Eligibility, DocumentCollection, ContactLead

# # ---------------- Eligibility Inline ----------------
# class EligibilityInline(admin.StackedInline):
#     model = Eligibility
#     fk_name = "lead"
#     can_delete = False
#     readonly_fields = (
#         "document_score",
#         "income_score",
#         "credit_score",
#         "property_score",
#         "overall_percentage",
#         "status",
#         "updated_at",
#     )
#     extra = 0

# # ---------------- DocumentCollection Inline ----------------
# class DocumentCollectionInline(admin.StackedInline):
#     model = DocumentCollection
#     fk_name = "lead"
#     can_delete = False
#     readonly_fields = (
#         "pan_card",
#         "aadhar_card",
#         "salary_slips",
#         "bank_statement",
#         "employment_proof",
#         "address_proof",
#         "updated_at",
#     )
#     extra = 0

# # ---------------- ContactLead Inline ----------------
# # class ContactLeadInline(admin.StackedInline):
# #     model = ContactLead
# #     fk_name = "qualified_lead"
# #     can_delete = False
# #     readonly_fields = (
# #         "lead_name",
# #         "phone_number",
# #         "email",
# #         "city",
# #         "status",
# #         "follow_up_date",
# #         "created_at",
# #     )
# #     extra = 0

# class ContactLeadInline(admin.StackedInline):
#     model = ContactLead
#     fk_name = "qualified_lead"
#     can_delete = False
#     readonly_fields = (
#         "lead_name", "phone_number", "email", "city",
#         "status", "follow_up_date", "created_at"
#     )
#     extra = 0

# @admin.register(QualifiedLead)
# class QualifiedLeadAdmin(ImportExportModelAdmin):
#     inlines = [EligibilityInline, DocumentCollectionInline, ContactLeadInline]

# # ---------------- Status Filter ----------------
# class StatusFilter(admin.SimpleListFilter):
#     title = "Status"
#     parameter_name = "status"

#     def lookups(self, request, model_admin):
#         return (
#             ("all", "All Status"),
#             ("under_review", "Under Review"),
#             ("approved", "Approved"),
#             ("rejected", "Rejected"),
#         )

#     def queryset(self, request, queryset):
#         if self.value() == "all" or self.value() is None:
#             return queryset
#         return queryset.filter(status=self.value())

# # ---------------- QualifiedLead Admin ----------------
# @admin.register(QualifiedLead)
# class QualifiedLeadAdmin(ImportExportModelAdmin):
#     list_display = (
#         "display_lead_id",
#         "display_name",
#         "display_phone",
#         "interest",
#         "status",
#         "priority",
#         "updated_at",
#     )

#     # ✅ Add all inlines here
#     inlines = [EligibilityInline, DocumentCollectionInline, ContactLeadInline]

#     list_filter = (StatusFilter,)
#     search_fields = (
#         "pipeline_lead__lead__name",
#         "pipeline_lead__lead__phone",
#     )
#     readonly_fields = ("updated_at",)

#     # ----------- Helper Display Methods -----------
#     def display_lead_id(self, obj):
#         return obj.lead_id if obj.lead_id else "N/A"
#     display_lead_id.short_description = "Lead ID"

#     def display_name(self, obj):
#         return obj.name if obj.name else "N/A"
#     display_name.short_description = "Name"

#     def display_phone(self, obj):
#         return obj.phone_number if obj.phone_number else "N/A"
#     display_phone.short_description = "Phone"

# ---------------- Optional: Remove separate admin registrations ----------------
# You can comment/remove these if you only want inlines
# @admin.register(DocumentCollection)
# class DocumentCollectionAdmin(ImportExportModelAdmin):
#     list_display = ("lead", "pan_card", "aadhar_card")

# @admin.register(ContactLead)
# class ContactLeadAdmin(ImportExportModelAdmin):
#     list_display = ("lead_name", "phone_number", "email", "status", "created_at")
#     list_filter = ("status",)
#     search_fields = ("lead_name", "phone_number", "email")



# from django.contrib import admin
# from import_export.admin import ImportExportModelAdmin
# from .models import QualifiedLead, Eligibility, DocumentCollection, ContactLead

# # ---------------- Eligibility Inline ----------------
# class EligibilityInline(admin.StackedInline):
#     model = Eligibility
#     fk_name = "lead"
#     can_delete = False
#     readonly_fields = (
#         "document_score",
#         "income_score",
#         "credit_score",
#         "property_score",
#         "overall_percentage",
#         "status",
#         "updated_at",
#     )
#     extra = 0

# # ---------------- DocumentCollection Inline ----------------
# class DocumentCollectionInline(admin.StackedInline):
#     model = DocumentCollection
#     fk_name = "lead"
#     can_delete = False
#     readonly_fields = (
#         "pan_card",
#         "aadhar_card",
#         "salary_slips",
#         "bank_statement",
#         "employment_proof",
#         "address_proof",
#         "updated_at",
#     )
#     extra = 0

# # ---------------- ContactLead Inline ----------------
# class ContactLeadInline(admin.StackedInline):
#     model = ContactLead
#     fk_name = "qualified_lead"  # <-- make sure this FK exists in ContactLead
#     can_delete = False
#     readonly_fields = (
#         "lead_name", "phone_number", "email", "city",
#         "status", "follow_up_date", "created_at"
#     )
#     extra = 0

# # ---------------- Status Filter ----------------
# class StatusFilter(admin.SimpleListFilter):
#     title = "Status"
#     parameter_name = "status"

#     def lookups(self, request, model_admin):
#         return (
#             ("all", "All Status"),
#             ("under_review", "Under Review"),
#             ("approved", "Approved"),
#             ("rejected", "Rejected"),
#         )

#     def queryset(self, request, queryset):
#         if self.value() == "all" or self.value() is None:
#             return queryset
#         return queryset.filter(status=self.value())

# # ---------------- QualifiedLead Admin ----------------
# @admin.register(QualifiedLead)
# class QualifiedLeadAdmin(ImportExportModelAdmin):
#     list_display = (
#         "display_lead_id",
#         "display_name",
#         "display_phone",
#         "interest",
#         "status",
#         "priority",
#         "updated_at",
#     )
#     inlines = [EligibilityInline, DocumentCollectionInline, ContactLeadInline]
#     list_filter = (StatusFilter,)
#     search_fields = ("pipeline_lead__lead__name", "pipeline_lead__lead__phone")
#     readonly_fields = ("updated_at",)

#     # ----------- Helper Display Methods -----------
#     def display_lead_id(self, obj):
#         return obj.lead_id if obj.lead_id else "N/A"
#     display_lead_id.short_description = "Lead ID"

#     def display_name(self, obj):
#         return obj.name if obj.name else "N/A"
#     display_name.short_description = "Name"

#     def display_phone(self, obj):
#         return obj.phone_number if obj.phone_number else "N/A"
#     display_phone.short_description = "Phone"


from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import QualifiedLead, Eligibility, DocumentCollection, ContactLead

# ---------------- Eligibility Inline ----------------
class EligibilityInline(admin.StackedInline):
    model = Eligibility
    fk_name = "lead"
    extra = 0  # show no extra blank forms by default
    can_delete = True  # allow deletion
    # Removed readonly_fields so it can be edited

# ---------------- DocumentCollection Inline ----------------
class DocumentCollectionInline(admin.StackedInline):
    model = DocumentCollection
    fk_name = "lead"
    extra = 0
    can_delete = True
    # Removed readonly_fields to allow upload/edit

# ---------------- ContactLead Inline ----------------
class ContactLeadInline(admin.StackedInline):
    model = ContactLead
    fk_name = "qualified_lead"
    extra = 0
    can_delete = True
    # Removed readonly_fields so admin can add/edit

# ---------------- Status Filter ----------------
class StatusFilter(admin.SimpleListFilter):
    title = "Status"
    parameter_name = "status"

    def lookups(self, request, model_admin):
        return (
            ("all", "All Status"),
            ("under_review", "Under Review"),
            ("approved", "Approved"),
            ("rejected", "Rejected"),
        )

    def queryset(self, request, queryset):
        if self.value() in (None, "all"):
            return queryset
        return queryset.filter(status=self.value())

# ---------------- QualifiedLead Admin ----------------
@admin.register(QualifiedLead)
class QualifiedLeadAdmin(ImportExportModelAdmin):
    list_display = (
        "display_name",
        "display_phone",
        "interest",
        "status",
        "priority",
        "updated_at",
    )
    inlines = [EligibilityInline, DocumentCollectionInline, ContactLeadInline]
    list_filter = (StatusFilter,)
    search_fields = ("pipeline_lead__lead__name", "pipeline_lead__lead__phone")
    readonly_fields = ("updated_at",)  # only updated_at stays readonly

    # ----------- Helper Display Methods -----------

    def display_name(self, obj):
        return obj.name or "N/A"
    display_name.short_description = "Name"

    def display_phone(self, obj):
        return obj.phone_number or "N/A"
    display_phone.short_description = "Phone"
