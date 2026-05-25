from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import  obtener_clientes, VendedorLoginView, obtener_prospectos

urlpatterns = [

    path('prospectos/', obtener_prospectos, name='obtener_prospectos'),
    path('clientes/', obtener_clientes, name='obtener_clientes'),

    # TOKENS - VENDEDORES
    path('auth/login/', VendedorLoginView.as_view(), name='vendedor_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),



    path('clientes/', obtener_clientes, name='obtener_clientes'),

]