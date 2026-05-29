from django.db import connection


def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


def ejecutar_procedimiento(nombre_procedimiento, parametros=None):
    parametros = parametros or []

    with connection.cursor() as cursor:
        cursor.callproc(nombre_procedimiento, parametros)

        if cursor.description:
            return dictfetchall(cursor)

        return []