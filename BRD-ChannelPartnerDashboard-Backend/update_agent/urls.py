from django.urls import path
from .views import UpdateAgentListCreateView, UpdateAgentDetailView, AgentKYCListCreateView, AgentKYCDetailView, AddressListCreateView, AddressDetailView, SettingListCreateView, SettingDetailView

urlpatterns = [
    path('agents/', UpdateAgentListCreateView.as_view(), name='agent-list-create'),
    path('agents/<int:pk>/', UpdateAgentDetailView.as_view(), name='agent-detail'),
    path('kyc/', AgentKYCListCreateView.as_view(), name='kyc-list-create'),
    path('kyc/<int:pk>/', AgentKYCDetailView.as_view(), name='kyc-detail'),
    path('address/', AddressListCreateView.as_view(), name='address-list-create'),
    path('address/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
    path('settings/', SettingListCreateView.as_view(), name='setting-list-create'),
    path('settings/<int:pk>/', SettingDetailView.as_view(), name='setting-detail'),
]