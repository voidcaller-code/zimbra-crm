from django.urls import path
from . import views

urlpatterns = [
    path('clientes/', views.obtener_clientes, name='obtener_clientes'),
]