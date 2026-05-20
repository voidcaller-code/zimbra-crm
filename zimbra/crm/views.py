from django.http import JsonResponse
from .models import Cliente

def obtener_clientes(request):
    clientes = list(Cliente.objects.values())
    return JsonResponse(clientes, safe=False)
# Create your views here.
