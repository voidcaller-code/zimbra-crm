USE zimbra_crm_db;

-- Ver todos los procedimientos creados
SHOW PROCEDURE STATUS WHERE Db = 'zimbra_crm_db';

-- Efectividad general de prospectos
CALL sp_efectividad_prospectos();

-- Reporte mensual del año actual
CALL sp_reporte_mensual_prospectos(2026);

-- Prospectos con score igual o mayor a 70
CALL sp_prospectos_alta_probabilidad(70);

-- Efectividad por origen o campaña
CALL sp_efectividad_por_origen();

-- Resumen por estado
CALL sp_resumen_pipeline_estados();

-- Registrar descarga de prueba para el prospecto con id 1
-- CALL sp_registrar_descarga_prueba(1);

-- Aceptar propuesta para el prospecto con id 1
-- CALL sp_aceptar_propuesta(1);