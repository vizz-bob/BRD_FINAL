from django.urls import path
from . import views

urlpatterns = [
    # ... existing patterns ...
    
    # User Profile endpoints
    path('profile/<str:user_id>/', views.ProfileView.as_view(), name='agent_profile'),
    path('profile/<str:user_id>/settings/', views.UpdateSettingsView.as_view(), name='update_settings'),
    path('<str:user_id>/settings/', views.UpdateSettingsView.as_view(), name='update_settings_legacy'),
    
    # Static content endpoints
    path('privacy-policy/', views.PrivacyPolicyView.as_view(), name='privacy_policy'),
    path('faq/', views.FAQView.as_view(), name='faq'),
    path('support/contact/', views.SupportContactView.as_view(), name='support_contact'),
    path('support/create-ticket/', views.CreateSupportTicketView.as_view(), name='create_support_ticket'),
    path('support/my-tickets/', views.MySupportTicketsView.as_view(), name='my_tickets'),
]