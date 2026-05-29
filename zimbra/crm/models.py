from django.db import models

# VENDEDORES

from django.db import models
from django.contrib.auth.models import User


class Vendedor(models.Model):
    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='vendedor'
    )
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, unique=True)
    zona = models.CharField(max_length=20)
    meta_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_ingreso = models.DateField()
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

    class Meta:
        db_table = 'vendedores'
        verbose_name = 'Vendedor'
        verbose_name_plural = 'Vendedores'
# CAMPANIAS MARKETING

class TiposCampanias(models.TextChoices):
    SEMANAL = 'SE', 'Semanal'
    QUINCENAL = 'QU', 'Quincenal'
    MENSUAL = 'ME', 'Mensual'


class CampanaMarketing(models.Model):
    nombre_campania = models.CharField(max_length=50)
    tipo = models.CharField(
        max_length=2,
        choices=TiposCampanias.choices,
        default=TiposCampanias.SEMANAL
    )
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    presupuesto = models.DecimalField(max_digits=10, decimal_places=2)
    objetivo = models.CharField(max_length=100)
    activa = models.BooleanField(default=True)

    vendedor_responsable = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='campanias',
        db_column='vendedor_id'
    )

    def __str__(self):
        return f"{self.nombre_campania}"

    class Meta:
        verbose_name = 'Campaña'
        verbose_name_plural = 'Campañas'
        ordering = ['-fecha_creacion']
        db_table = 'campanas_marketing'


# PROSPECTOS

class EstadoProspecto(models.TextChoices):
    NUEVO = 'NU', 'Nuevo'
    CONTACTADO = 'CO', 'Contactado'
    CALIFICADO = 'CA', 'Calificado'
    CONVERTIDO = 'CV', 'Convertido'
    DESCARTADO = 'DE', 'Descartado'


class Prospecto(models.Model):
    vendedor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='prospectos',
        db_column='vendedor_id'
    )
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    empresa = models.CharField(max_length=100)
    cargo = models.CharField(max_length=80, blank=True, null=True)

    url_origen = models.URLField(max_length=250, blank=True, null=True)
    paginas_visitadas = models.PositiveIntegerField(default=0)
    tiempo_sesion_seg = models.PositiveIntegerField(default=0)
    descargo_prueba = models.BooleanField(default=False)

    score_calificacion = models.PositiveIntegerField(default=0)
    estado = models.CharField(
        max_length=2,
        choices=EstadoProspecto.choices,
        default=EstadoProspecto.NUEVO
    )
    convertido_cliente = models.BooleanField(default=False)
    fecha_registro = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.empresa}"

    class Meta:
        verbose_name = 'Prospecto'
        verbose_name_plural = 'Prospectos'
        ordering = ['-fecha_registro']
        db_table = 'prospectos'


# CLIENTES

class TipoCliente(models.TextChoices):
    EMPRESA = 'EM', 'Empresa'
    INSTITUCION = 'IN', 'Institución'
    INDIVIDUAL = 'ID', 'Individual'


class Cliente(models.Model):
    prospecto = models.OneToOneField(
        Prospecto,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cliente',
        db_column='prospecto_id'
    )
    nombre_empresa = models.CharField(max_length=100)
    nombre_contacto = models.CharField(max_length=100)
    email_contacto = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    pais = models.CharField(max_length=50)
    tipo_cliente = models.CharField(
        max_length=2,
        choices=TipoCliente.choices,
        default=TipoCliente.EMPRESA
    )
    fecha_conversion = models.DateField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre_empresa} - {self.nombre_contacto}"

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
        ordering = ['-fecha_conversion']
        db_table = 'clientes'


# INTERACCIONES DE MARKETING


class TipoInteraccion(models.TextChoices):
    EMAIL = 'EM', 'Email'
    LLAMADA = 'LL', 'Llamada'
    VISITA_WEB = 'VW', 'Visita web'
    DEMO = 'DE', 'Demo'
    DESCARGA = 'DS', 'Descarga'


class InteraccionMarketing(models.Model):
    prospecto = models.ForeignKey(
        Prospecto,
        on_delete=models.CASCADE,
        related_name='interacciones',
        db_column='prospecto_id'
    )
    campana = models.ForeignKey(
        CampanaMarketing,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='interacciones',
        db_column='campana_id'
    )
    tipo_interaccion = models.CharField(
        max_length=2,
        choices=TipoInteraccion.choices
    )
    asunto = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    fecha_interaccion = models.DateTimeField(auto_now_add=True)

    abierto = models.BooleanField(default=False)
    respondido = models.BooleanField(default=False)
    genera_alerta = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.prospecto} - {self.get_tipo_interaccion_display()}"

    class Meta:
        verbose_name = 'Interacción de Marketing'
        verbose_name_plural = 'Interacciones de Marketing'
        ordering = ['-fecha_interaccion']
        db_table = 'interacciones_marketing'


# MÉTRICAS DE CAMPAÑA

class MetricaCampana(models.Model):
    campana = models.ForeignKey(
        CampanaMarketing,
        on_delete=models.CASCADE,
        related_name='metricas',
        db_column='campana_id'
    )
    total_enviadas = models.PositiveIntegerField(default=0)
    total_abiertas = models.PositiveIntegerField(default=0)
    total_respondidas = models.PositiveIntegerField(default=0)
    total_clicks = models.PositiveIntegerField(default=0)

    tasa_apertura = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tasa_respuesta = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    fecha_registro = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Métricas - {self.campana.nombre_campania}"

    class Meta:
        verbose_name = 'Métrica de Campaña'
        verbose_name_plural = 'Métricas de Campaña'
        ordering = ['-fecha_registro']
        db_table = 'metricas_campana'


# PROPUESTAS

class EstadoPropuesta(models.TextChoices):
    ENVIADA = 'EN', 'Enviada'
    ACEPTADA = 'AC', 'Aceptada'
    RECHAZADA = 'RE', 'Rechazada'
    VENCIDA = 'VE', 'Vencida'


class TipoLicencia(models.TextChoices):
    BASICA = 'BA', 'Básica'
    PROFESIONAL = 'PR', 'Profesional'
    EMPRESARIAL = 'EM', 'Empresarial'


class Propuesta(models.Model):
    prospecto = models.ForeignKey(
        Prospecto,
        on_delete=models.CASCADE,
        related_name='propuestas',
        db_column='prospecto_id'
    )
    vendedor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='propuestas',
        db_column='vendedor_id'
    )
    fecha_emision = models.DateField(auto_now_add=True)
    monto_total = models.DecimalField(max_digits=12, decimal_places=2)
    tipo_licencia = models.CharField(
        max_length=2,
        choices=TipoLicencia.choices,
        default=TipoLicencia.BASICA
    )
    num_usuarios = models.PositiveIntegerField(default=1)
    estado = models.CharField(
        max_length=2,
        choices=EstadoPropuesta.choices,
        default=EstadoPropuesta.ENVIADA
    )
    observaciones = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Propuesta #{self.id} - {self.prospecto}"

    class Meta:
        verbose_name = 'Propuesta'
        verbose_name_plural = 'Propuestas'
        ordering = ['-fecha_emision']
        db_table = 'propuestas'


# VENTAS

class EstadoPago(models.TextChoices):
    PENDIENTE = 'PE', 'Pendiente'
    PAGADO = 'PA', 'Pagado'
    RECHAZADO = 'RE', 'Rechazado'


class MetodoPago(models.TextChoices):
    TARJETA = 'TA', 'Tarjeta'
    TRANSFERENCIA = 'TR', 'Transferencia'
    PAYPAL = 'PP', 'PayPal'


class Venta(models.Model):
    propuesta = models.OneToOneField(
        Propuesta,
        on_delete=models.CASCADE,
        related_name='venta',
        db_column='propuesta_id'
    )
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        related_name='ventas',
        db_column='cliente_id'
    )
    vendedor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ventas',
        db_column='vendedor_id'
    )
    fecha_venta = models.DateField(auto_now_add=True)
    monto_final = models.DecimalField(max_digits=12, decimal_places=2)

    metodo_pago = models.CharField(
        max_length=2,
        choices=MetodoPago.choices,
        default=MetodoPago.TRANSFERENCIA
    )
    estado_pago = models.CharField(
        max_length=2,
        choices=EstadoPago.choices,
        default=EstadoPago.PENDIENTE
    )
    notas = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Venta #{self.id} - {self.cliente}"

    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'
        ordering = ['-fecha_venta']
        db_table = 'ventas'