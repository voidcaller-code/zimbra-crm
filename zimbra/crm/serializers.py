from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Prospecto, Propuesta


class VendedorTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
        }

        vendedor = getattr(user, 'vendedor', None)

        if vendedor:
            data['vendedor'] = {
                'id': vendedor.id,
                'nombre': vendedor.nombre,
                'apellido': vendedor.apellido,
                'email': vendedor.email,
                'zona': vendedor.zona,
                'activo': vendedor.activo,
            }
            data['rol'] = 'vendedor'
        else:
            data['vendedor'] = None
            data['rol'] = 'admin' if user.is_staff else 'usuario'

        return data
    
# SERIALIZER PROSPPECTOS

# class ProspectoSerializer(serializers.ModelSerializer):
#     vendedor_nombre = serializers.SerializerMethodField()

#     class Meta:
#         model = Prospecto
#         fields = [
#             'id',
#             'vendedor',
#             'vendedor_nombre',
#             'nombre',
#             'apellido',
#             'email',
#             'telefono',
#             'empresa',
#             'cargo',
#             'url_origen',
#             'paginas_visitadas',
#             'tiempo_sesion_seg',
#             'descargo_prueba',
#             'score_calificacion',
#             'estado',
#             'convertido_cliente',
#             'fecha_registro',
#         ]

#         read_only_fields = [
#             'vendedor',
#             'vendedor_nombre',
#             'convertido_cliente',
#             'fecha_registro',
#         ]

#     def get_vendedor_nombre(self, obj):
#         if obj.vendedor:
#             full_name = obj.vendedor.get_full_name()

#             if full_name:
#                 return full_name

#             return obj.vendedor.username

#         return None
class ProspectoSerializer(serializers.ModelSerializer):
    vendedor_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Prospecto
        fields = '__all__'
        read_only_fields = ['vendedor', 'fecha_registro', 'convertido_cliente']

    def get_vendedor_nombre(self, obj):
        if obj.vendedor:
            full_name = obj.vendedor.get_full_name()
            return full_name if full_name else obj.vendedor.username
        return None
    

# SERIALIZER PROPUESTAS
class PropuestaSerializer(serializers.ModelSerializer):
    prospecto_nombre = serializers.SerializerMethodField()
    vendedor_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Propuesta
        fields = [
            'id',
            'prospecto',
            'prospecto_nombre',
            'vendedor',
            'vendedor_nombre',
            'fecha_emision',
            'monto_total',
            'tipo_licencia',
            'num_usuarios',
            'estado',
            'observaciones',
        ]

        read_only_fields = [
            'vendedor',
            'vendedor_nombre',
            'prospecto_nombre',
            'fecha_emision',
        ]

    def get_prospecto_nombre(self, obj):
        if obj.prospecto:
            return f"{obj.prospecto.nombre} {obj.prospecto.apellido} - {obj.prospecto.empresa}"
        return None

    def get_vendedor_nombre(self, obj):
        if obj.vendedor:
            full_name = obj.vendedor.get_full_name()
            return full_name if full_name else obj.vendedor.username
        return None

    def validate(self, attrs):
        request = self.context.get('request')
        prospecto = attrs.get('prospecto')

        if request and request.user and not request.user.is_staff:
            if prospecto and prospecto.vendedor_id != request.user.id:
                raise serializers.ValidationError(
                    'No puedes crear una propuesta para un prospecto que no está asignado a ti.'
                )

        return attrs