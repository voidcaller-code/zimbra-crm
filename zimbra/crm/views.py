from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from django.db import transaction

from .models import Prospecto, Cliente, EstadoProspecto, TipoCliente, Propuesta
from .serializers import VendedorTokenObtainPairSerializer, ProspectoSerializer, PropuestaSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action


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


# API PROSPPECTOS
# class ProspectoApiViewSet(ModelViewSet):
#     serializer_class = ProspectoSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user

#         if user.is_staff:
#             return Prospecto.objects.all()

#         return Prospecto.objects.filter(vendedor=user)

#     def perform_create(self, serializer):
#         serializer.save(vendedor=self.request.user)

class ProspectoApiViewSet(ModelViewSet):
    serializer_class = ProspectoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Prospecto.objects.all()

        return Prospecto.objects.filter(vendedor=user)

    def perform_create(self, serializer):
        serializer.save(vendedor=self.request.user)

    @action(detail=True, methods=['post'], url_path='convertir-cliente')
    def convertir_cliente(self, request, pk=None):
        prospecto = self.get_object()

        if Cliente.objects.filter(prospecto=prospecto).exists():
            return Response(
                {'message': 'Este prospecto ya fue convertido en cliente.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Cliente.objects.filter(email_contacto=prospecto.email).exists():
            return Response(
                {'message': 'Ya existe un cliente con este correo.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        pais = request.data.get('pais', 'Colombia')
        tipo_cliente = request.data.get('tipo_cliente', TipoCliente.EMPRESA)

        with transaction.atomic():
            cliente = Cliente.objects.create(
                prospecto=prospecto,
                nombre_empresa=prospecto.empresa,
                nombre_contacto=f'{prospecto.nombre} {prospecto.apellido}',
                email_contacto=prospecto.email,
                telefono=prospecto.telefono,
                pais=pais,
                tipo_cliente=tipo_cliente,
                activo=True
            )

            prospecto.estado = EstadoProspecto.CONVERTIDO
            prospecto.convertido_cliente = True
            prospecto.save(update_fields=['estado', 'convertido_cliente'])

        return Response(
            {
                'message': 'Prospecto convertido en cliente correctamente.',
                'cliente_id': cliente.id
            },
            status=status.HTTP_201_CREATED
        )
    

# API PROPUESTAS
class PropuestaApiViewSet(ModelViewSet):
    serializer_class = PropuestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Propuesta.objects.all().select_related('prospecto', 'vendedor')

        return Propuesta.objects.filter(vendedor=user).select_related('prospecto', 'vendedor')

    def perform_create(self, serializer):
        serializer.save(vendedor=self.request.user)