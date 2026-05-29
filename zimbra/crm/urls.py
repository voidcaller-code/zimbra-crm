from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    obtener_clientes,
    obtener_prospectos,
    VendedorLoginView,
    registrar_vendedor,
)

urlpatterns = [
    path('prospectos/', obtener_prospectos, name='obtener_prospectos'),
    path('clientes/', obtener_clientes, name='obtener_clientes'),

    # TOKENS - VENDEDORES
    path('auth/login/', VendedorLoginView.as_view(), name='vendedor_login'),
    path('auth/register/', registrar_vendedor, name='registrar_vendedor'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]