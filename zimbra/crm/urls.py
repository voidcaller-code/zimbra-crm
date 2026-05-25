from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import  obtener_clientes, VendedorLoginView

urlpatterns = [
<<<<<<< HEAD
    path('prospectos/', views.obtener_prospectos, name='obtener_prospectos'),
    path('clientes/', views.obtener_clientes, name='obtener_clientes'),
=======
    # TOKENS - VENDEDORES
    path('auth/login/', VendedorLoginView.as_view(), name='vendedor_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),



    path('clientes/', obtener_clientes, name='obtener_clientes'),
>>>>>>> 7ad3ccd (add: se crea la api para autenticar los vendores en el login)
]