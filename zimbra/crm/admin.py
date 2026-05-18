from django.contrib import admin
from .models import *

# Register your models here.

@admin.register(Vendedor)
class VendedorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'email', 'telefono', 'zona', 'meta_mensual', 'fecha_ingreso', 'activo')

@admin.register(CampanaMarketing)
class CampanaMarketingAdmin(admin.ModelAdmin):
    list_display = ('nombre_campania', 'tipo', 'fecha_creacion', 'fecha_inicio', 'fecha_fin', 'presupuesto', 'objetivo', 'activa', 'vendedor_responsable')

@admin.register(Prospecto)
class ProspectoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'email', 'telefono', 'empresa', 'cargo', 'vendedor')

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('prospecto', 'nombre_empresa', 'nombre_contacto', 'email_contacto', 'telefono', 'pais', 'tipo_cliente')

@admin.register(InteraccionMarketing)
class InteraccionMarketingAdmin(admin.ModelAdmin):
    list_display = ('prospecto', 'campana', 'tipo_interaccion', 'fecha_interaccion', 'respondido', 'genera_alerta')

@admin.register(MetricaCampana)
class MetricaCampanaAdmin(admin.ModelAdmin):
    list_display = ('campana', 'fecha_registro', 'total_enviadas', 'total_abiertas', 'total_respondidas', 'total_clicks')

@admin.register(Propuesta)
class PropuestaAdmin(admin.ModelAdmin):
    list_display = ('prospecto', 'vendedor', 'fecha_emision', 'monto_total', 'tipo_licencia' ,'num_usuarios')

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ('propuesta', 'cliente', 'vendedor', 'fecha_venta', 'monto_final', 'metodo_pago', 'estado_pago')