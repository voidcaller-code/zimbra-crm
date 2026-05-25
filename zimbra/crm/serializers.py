from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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