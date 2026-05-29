from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Prospecto, Cliente
from .serializers import VendedorTokenObtainPairSerializer


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


def obtener_clientes(request):
    clientes = list(Cliente.objects.values())
    return JsonResponse(clientes, safe=False)


class VendedorLoginView(TokenObtainPairView):
    serializer_class = VendedorTokenObtainPairSerializer


@api_view(['POST'])
def registrar_vendedor(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    password_confirm = request.data.get('password_confirm')

    if not username or not email or not password or not password_confirm:
        return Response(
            {'error': 'Todos los campos son obligatorios.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if password != password_confirm:
        return Response(
            {'error': 'Las contraseñas no coinciden.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(password) < 8:
        return Response(
            {'error': 'La contraseña debe tener al menos 8 caracteres.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'El usuario ya existe.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'El correo ya está registrado.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response(
        {
            'message': 'Vendedor registrado correctamente.',
            'id': user.id,
            'username': user.username,
            'email': user.email,
        },
        status=status.HTTP_201_CREATED
    )