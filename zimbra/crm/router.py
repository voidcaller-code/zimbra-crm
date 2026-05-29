from rest_framework.routers import DefaultRouter
from crm.views import ProspectoApiViewSet, PropuestaApiViewSet

router_prospectos = DefaultRouter()
router_propuestas = DefaultRouter()

# PROSPECTOS
router_prospectos.register(prefix='prospectos', basename='prospectos', viewset=ProspectoApiViewSet)
# PROPUESTAS
router_propuestas.register(prefix='propuestas', basename='propuestas', viewset=PropuestaApiViewSet)