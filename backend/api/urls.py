from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path('skinImage/', views.skinImage, name="Skin Image")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)