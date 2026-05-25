from django.shortcuts import render
from django.http import JsonResponse
<<<<<<< HEAD
from .models import Prospecto, Cliente


def obtener_prospectos(request):
    prospectos = Prospecto.objects.select_related('vendedor').all().order_by('-score_calificacion')

    data = []

    for prospecto in prospectos:
        data.append({
            'id': prospecto.id,
            'nombre': prospecto.nombre,
            'apellido': prospecto.apellido,
            'email': prospecto.email,
            'telefono': prospecto.telefono,
            'empresa': prospecto.empresa,
            'cargo': prospecto.cargo,
            'descargo_prueba': prospecto.descargo_prueba,
            'score_calificacion': prospecto.score_calificacion,
            'estado': prospecto.get_estado_display(),
            'convertido_cliente': prospecto.convertido_cliente,
            'fecha_registro': str(prospecto.fecha_registro),
            'vendedor': f'{prospecto.vendedor.nombre} {prospecto.vendedor.apellido}' if prospecto.vendedor else 'Sin asignar',
        })

    return JsonResponse(data, safe=False)
=======
from .models import Cliente
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import VendedorTokenObtainPairSerializer


class VendedorLoginView(TokenObtainPairView):
    serializer_class = VendedorTokenObtainPairSerializer
>>>>>>> 7ad3ccd (add: se crea la api para autenticar los vendores en el login)


def obtener_clientes(request):
    clientes = list(Cliente.objects.values())
<<<<<<< HEAD
    return JsonResponse(clientes, safe=False)
=======
    return JsonResponse(clientes, safe=False)

>>>>>>> 7ad3ccd (add: se crea la api para autenticar los vendores en el login)
