from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .router import router_prospectos, router_propuestas
from django.conf.urls import include

from .views import (
    obtener_clientes,
    obtener_prospectos,
    VendedorLoginView,
    registrar_vendedor,
    ReporteEfectividadProspectosAPIView,
    ReporteMensualProspectosAPIView,
    ProspectosAltaProbabilidadAPIView,
    ReportePipelineEstadosAPIView,
)

urlpatterns = [
    #path('prospectos/', obtener_prospectos, name='obtener_prospectos'),
    path('clientes/', obtener_clientes, name='obtener_clientes'),

    # TOKENS - VENDEDORES
    path('auth/login/', VendedorLoginView.as_view(), name='vendedor_login'),
    path('auth/register/', registrar_vendedor, name='registrar_vendedor'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # PROSPECTOS
    path('', include(router_prospectos.urls)),

    # PROPUESTAS
    path('', include(router_propuestas.urls)),

    # REPORTES, PROCEDIMIENTOS ALMACENADOS
    path(
        'reportes/efectividad-prospectos/',
        ReporteEfectividadProspectosAPIView.as_view(),
        name='reporte_efectividad_prospectos'
    ),
    path(
        'reportes/prospectos-mensual/',
        ReporteMensualProspectosAPIView.as_view(),
        name='reporte_mensual_prospectos'
    ),
    path(
        'reportes/prospectos-alta-probabilidad/',
        ProspectosAltaProbabilidadAPIView.as_view(),
        name='prospectos_alta_probabilidad'
    ),
    path(
        'reportes/pipeline-estados/',
        ReportePipelineEstadosAPIView.as_view(),
        name='reporte_pipeline_estados'
    ),
]