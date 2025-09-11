from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SubscriptionTierViewSet,
    HospitalSubscriptionViewSet,
    SuperadminDashboardViewSet,
    SystemAlertViewSet,
    GlobalSettingsViewSet,
    UsageMetricsViewSet
)

router = DefaultRouter()
router.register(r'subscription-tiers', SubscriptionTierViewSet, basename='subscription-tier')
router.register(r'hospital-subscriptions', HospitalSubscriptionViewSet, basename='hospital-subscription')
router.register(r'dashboard', SuperadminDashboardViewSet, basename='dashboard')
router.register(r'alerts', SystemAlertViewSet, basename='alert')
router.register(r'settings', GlobalSettingsViewSet, basename='setting')
router.register(r'metrics', UsageMetricsViewSet, basename='metric')

app_name = 'superadmin'

urlpatterns = [
    path('api/superadmin/', include(router.urls)),
]
