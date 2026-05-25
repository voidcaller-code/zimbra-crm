from django.urls import path
from . import views

urlpatterns = [
    path('prospectos/', views.obtener_prospectos, name='obtener_prospectos'),
]