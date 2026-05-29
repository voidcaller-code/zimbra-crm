USE zimbra_crm_db;

DELIMITER $$

-- =====================================================
-- 1. Aceptar propuesta / convertir prospecto en cliente
-- =====================================================
DROP PROCEDURE IF EXISTS sp_aceptar_propuesta$$

CREATE PROCEDURE sp_aceptar_propuesta(
    IN p_prospecto_id INT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM prospectos WHERE id = p_prospecto_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El prospecto no existe';
    ELSE
        UPDATE prospectos
        SET
            convertido_cliente = 1,
            estado = 'CL'
        WHERE id = p_prospecto_id;

        SELECT
            id,
            nombre,
            apellido,
            email,
            empresa,
            descargo_prueba,
            score_calificacion,
            estado,
            convertido_cliente,
            fecha_registro
        FROM prospectos
        WHERE id = p_prospecto_id;
    END IF;
END$$


-- =====================================================
-- 2. Registrar descarga de versión de prueba
-- =====================================================
DROP PROCEDURE IF EXISTS sp_registrar_descarga_prueba$$

CREATE PROCEDURE sp_registrar_descarga_prueba(
    IN p_prospecto_id INT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM prospectos WHERE id = p_prospecto_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El prospecto no existe';
    ELSE
        UPDATE prospectos
        SET
            descargo_prueba = 1,
            score_calificacion = score_calificacion + 10
        WHERE id = p_prospecto_id;

        SELECT
            id,
            nombre,
            apellido,
            email,
            descargo_prueba,
            score_calificacion
        FROM prospectos
        WHERE id = p_prospecto_id;
    END IF;
END$$


-- =====================================================
-- 3. Reporte mensual de prospectos
-- =====================================================
DROP PROCEDURE IF EXISTS sp_reporte_mensual_prospectos$$

CREATE PROCEDURE sp_reporte_mensual_prospectos(
    IN p_anio INT
)
BEGIN
    SELECT
        YEAR(fecha_registro) AS anio,
        MONTH(fecha_registro) AS mes,
        COUNT(*) AS total_prospectos,

        COALESCE(
            SUM(CASE WHEN descargo_prueba = 1 THEN 1 ELSE 0 END),
            0
        ) AS total_descargaron_prueba,

        COALESCE(
            SUM(CASE WHEN convertido_cliente = 1 THEN 1 ELSE 0 END),
            0
        ) AS total_convertidos,

        ROUND(AVG(score_calificacion), 2) AS score_promedio,

        COALESCE(
            ROUND(
                SUM(CASE WHEN convertido_cliente = 1 THEN 1 ELSE 0 END) * 100.0
                / NULLIF(COUNT(*), 0),
                2
            ),
            0
        ) AS porcentaje_conversion
    FROM prospectos
    WHERE YEAR(fecha_registro) = p_anio
    GROUP BY YEAR(fecha_registro), MONTH(fecha_registro)
    ORDER BY anio, mes;
END$$


-- =====================================================
-- 4. Efectividad general de prospectos
-- =====================================================
DROP PROCEDURE IF EXISTS sp_efectividad_prospectos$$

CREATE PROCEDURE sp_efectividad_prospectos()
BEGIN
    SELECT
        COUNT(*) AS total_prospectos,

        COALESCE(
            SUM(CASE WHEN descargo_prueba = 1 THEN 1 ELSE 0 END),
            0
        ) AS descargaron_prueba,

        COALESCE(
            SUM(CASE WHEN convertido_cliente = 1 THEN 1 ELSE 0 END),
            0
        ) AS convertidos_cliente,

        COALESCE(
            ROUND(
                SUM(CASE WHEN descargo_prueba = 1 THEN 1 ELSE 0 END) * 100.0
                / NULLIF(COUNT(*), 0),
                2
            ),
            0
        ) AS porcentaje_descarga_prueba,

        COALESCE(
            ROUND(
                SUM(CASE WHEN convertido_cliente = 1 THEN 1 ELSE 0 END) * 100.0
                / NULLIF(COUNT(*), 0),
                2
            ),
            0
        ) AS porcentaje_conversion
    FROM prospectos;
END$$


-- =====================================================
-- 5. Prospectos con mayor probabilidad de conversión
-- =====================================================
DROP PROCEDURE IF EXISTS sp_prospectos_alta_probabilidad$$

CREATE PROCEDURE sp_prospectos_alta_probabilidad(
    IN p_score_minimo INT
)
BEGIN
    SELECT
        id,
        nombre,
        apellido,
        email,
        telefono,
        empresa,
        cargo,
        descargo_prueba,
        score_calificacion,
        estado,
        convertido_cliente,
        fecha_registro
    FROM prospectos
    WHERE score_calificacion >= p_score_minimo
      AND convertido_cliente = 0
    ORDER BY score_calificacion DESC, fecha_registro DESC;
END$$


-- =====================================================
-- 6. Efectividad por origen / campaña
-- Usa url_origen como referencia de campaña o fuente
-- =====================================================
DROP PROCEDURE IF EXISTS sp_efectividad_por_origen$$

CREATE PROCEDURE sp_efectividad_por_origen()
BEGIN
    SELECT
        COALESCE(url_origen, 'Sin origen') AS origen,
        COUNT(*) AS total_prospectos,

        COALESCE(
            SUM(CASE WHEN descargo_prueba = 1 THEN 1 ELSE 0 END),
            0
        ) AS descargaron_prueba,

        COALESCE(
            SUM(CASE WHEN convertido_cliente = 1 THEN 1 ELSE 0 END),
            0
        ) AS convertidos_cliente,

        ROUND(AVG(score_calificacion), 2) AS score_promedio,

        COALESCE(
            ROUND(
                SUM(CASE WHEN convertido_cliente = 1 THEN 1 ELSE 0 END) * 100.0
                / NULLIF(COUNT(*), 0),
                2
            ),
            0
        ) AS porcentaje_conversion
    FROM prospectos
    GROUP BY url_origen
    ORDER BY porcentaje_conversion DESC, total_prospectos DESC;
END$$


-- =====================================================
-- 7. Resumen del pipeline por estado
-- =====================================================
DROP PROCEDURE IF EXISTS sp_resumen_pipeline_estados$$

CREATE PROCEDURE sp_resumen_pipeline_estados()
BEGIN
    SELECT
        estado,
        COUNT(*) AS total_prospectos,

        COALESCE(
            SUM(CASE WHEN descargo_prueba = 1 THEN 1 ELSE 0 END),
            0
        ) AS descargaron_prueba,

        COALESCE(
            SUM(CASE WHEN convertido_cliente = 1 THEN 1 ELSE 0 END),
            0
        ) AS convertidos_cliente,

        ROUND(AVG(score_calificacion), 2) AS score_promedio
    FROM prospectos
    GROUP BY estado
    ORDER BY total_prospectos DESC;
END$$

DELIMITER ;
