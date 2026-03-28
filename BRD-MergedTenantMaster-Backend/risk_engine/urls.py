# from django.urls import path
# from .views import (
#     CreditScoreRuleListCreateAPIView,
#     NegativeAreaListCreateAPIView
# )

# urlpatterns = [
#     path('risk/credit-rules/', CreditScoreRuleListCreateAPIView.as_view()),
#     path('risk/negative-areas/', NegativeAreaListCreateAPIView.as_view()),
# ]


# risk_engine/urls.py
from django.urls import path
from .views import (
    CreditScoreRuleListCreateAPIView,
    CreditScoreRuleDeleteAPIView,
    NegativeAreaListCreateAPIView,
)

urlpatterns = [
    path("risk/credit-rules/", CreditScoreRuleListCreateAPIView.as_view()),
    path("risk/credit-rules/<int:pk>/", CreditScoreRuleDeleteAPIView.as_view()),
    path("risk/negative-areas/", NegativeAreaListCreateAPIView.as_view()),
]
