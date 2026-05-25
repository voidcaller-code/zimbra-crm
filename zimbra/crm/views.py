from django.shortcuts import render
from django.http import JsonResponse
from .models import Prospecto


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