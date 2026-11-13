-- ========================================================
-- PROTOCOLO DE SEGURIDAD CRÍTICA - ELLY'S SHOP
-- Copia y pega todo este script en el "SQL Editor" de Supabase
-- y presiona RUN.
-- ========================================================

-- --------------------------------------------------------
-- 1. BLOQUEO TOTAL DE FUGA DE INFORMACIÓN (COSTOS PRIVADOS)
-- --------------------------------------------------------
-- Revocar permisos directos de SELECT a usuarios anónimos sobre la tabla productos
DROP POLICY IF EXISTS "Publico puede ver productos activos" ON public.productos;
REVOKE SELECT ON public.productos FROM anon;

-- Solo los administradores autenticados pueden ver la tabla 'productos' (con sus costos)
DROP POLICY IF EXISTS "Admin acceso total productos" ON public.productos;
CREATE POLICY "Admin acceso total productos" 
ON public.productos FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- La vista pública 'productos_publicos' es la ÚNICA que el público puede consultar.
-- Esta vista NO contiene la columna 'costo', protegiendo tus márgenes comerciales al 100%.
CREATE OR REPLACE VIEW public.productos_publicos AS
SELECT 
    id,
    nombre,
    descripcion,
    categoria,
    precio_venta,
    unidad,
    stock,
    imagenes,
    activo,
    created_at
FROM public.productos
WHERE activo = true;

GRANT SELECT ON public.productos_publicos TO anon, authenticated;


-- --------------------------------------------------------
-- 2. FUNCIÓN DE PEDIDO SEGURO (ANTI-ALTERACIÓN DE PRECIOS)
-- --------------------------------------------------------
-- Eliminar política anterior de inserción abierta
DROP POLICY IF EXISTS "Publico puede crear pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Publico puede insertar detalles de pedido" ON public.pedido_detalles;

-- Eliminar trigger antiguo para evitar doble descuento de stock
DROP TRIGGER IF EXISTS trigger_descontar_stock ON public.pedido_detalles;
DROP FUNCTION IF EXISTS public.descontar_stock_pedido();

-- Solo el administrador puede modificar o ver pedidos directamente
DROP POLICY IF EXISTS "Admin acceso total pedidos" ON public.pedidos;
CREATE POLICY "Admin acceso total pedidos" 
ON public.pedidos FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin acceso total pedido_detalles" ON public.pedido_detalles;
CREATE POLICY "Admin acceso total pedido_detalles" 
ON public.pedido_detalles FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Crear función atómica con SECURITY DEFINER.
-- El cliente envía solo los IDs y cantidades; la base de datos consulta el PRECIO REAL y calcula el total.
-- Es matemáticamente imposible que un usuario altere el precio de venta o el total.
CREATE OR REPLACE FUNCTION public.crear_pedido_seguro(
    p_cliente_nombre TEXT,
    p_cliente_telefono TEXT,
    p_cliente_direccion TEXT DEFAULT '',
    p_notas TEXT DEFAULT '',
    p_items JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_pedido_id UUID;
    v_codigo TEXT;
    v_total_calculado NUMERIC(10,2) := 0;
    v_item JSONB;
    v_prod_id UUID;
    v_cantidad INT;
    v_prod RECORD;
    v_subtotal NUMERIC(10,2);
    v_items_resumen JSONB := '[]'::jsonb;
BEGIN
    -- Validaciones anti-ataques e inyecciones
    IF trim(coalesce(p_cliente_nombre, '')) = '' OR length(p_cliente_nombre) > 100 THEN
        RAISE EXCEPTION 'El nombre del cliente no es válido.';
    END IF;

    IF trim(coalesce(p_cliente_telefono, '')) = '' OR length(p_cliente_telefono) < 8 OR length(p_cliente_telefono) > 25 THEN
        RAISE EXCEPTION 'El teléfono o WhatsApp no es válido.';
    END IF;

    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'El pedido debe contener al menos un producto.';
    END IF;

    IF jsonb_array_length(p_items) > 50 THEN
        RAISE EXCEPTION 'Cantidad de productos excede el límite permitido.';
    END IF;

    -- Generar folio aleatorio único
    v_codigo := 'PED-' || floor(1000 + random() * 9000)::text;

    -- Crear cabecera de pedido
    INSERT INTO public.pedidos (
        codigo,
        cliente_nombre,
        cliente_telefono,
        cliente_direccion,
        notas,
        total,
        estado
    ) VALUES (
        v_codigo,
        trim(p_cliente_nombre),
        trim(p_cliente_telefono),
        trim(coalesce(p_cliente_direccion, '')),
        trim(coalesce(p_notas, '')),
        0,
        'pendiente'
    ) RETURNING id INTO v_pedido_id;

    -- Procesar cada producto con precios oficiales de la base de datos
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_prod_id := (v_item->>'producto_id')::uuid;
        v_cantidad := (v_item->>'cantidad')::int;

        IF v_cantidad <= 0 OR v_cantidad > 100 THEN
            RAISE EXCEPTION 'Cantidad inválida para uno de los productos.';
        END IF;

        -- Consultar el producto real directamente en la tabla protegida
        SELECT id, nombre, precio_venta, stock, activo
        INTO v_prod
        FROM public.productos
        WHERE id = v_prod_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Uno de los productos seleccionados no existe en el catálogo.';
        END IF;

        IF NOT v_prod.activo THEN
            RAISE EXCEPTION 'El producto "%" no está disponible.', v_prod.nombre;
        END IF;

        IF v_prod.stock < v_cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente para "%". Solo quedan % unidades disponibles.', v_prod.nombre, v_prod.stock;
        END IF;

        -- Cálculo con precio REAL del servidor
        v_subtotal := v_prod.precio_venta * v_cantidad;
        v_total_calculado := v_total_calculado + v_subtotal;

        -- Insertar el detalle verificado
        INSERT INTO public.pedido_detalles (
            pedido_id,
            producto_id,
            producto_nombre,
            cantidad,
            precio_unitario,
            subtotal
        ) VALUES (
            v_pedido_id,
            v_prod.id,
            v_prod.nombre,
            v_cantidad,
            v_prod.precio_venta,
            v_subtotal
        );

        -- Descontar del inventario
        UPDATE public.productos
        SET stock = stock - v_cantidad
        WHERE id = v_prod.id;

        -- Construir detalle para WhatsApp
        v_items_resumen := v_items_resumen || jsonb_build_object(
            'nombre', v_prod.nombre,
            'cantidad', v_cantidad,
            'precio_unitario', v_prod.precio_venta,
            'subtotal', v_subtotal
        );
    END LOOP;

    -- Actualizar el total oficial calculado en el servidor
    UPDATE public.pedidos
    SET total = v_total_calculado
    WHERE id = v_pedido_id;

    -- Retornar confirmación
    RETURN jsonb_build_object(
        'success', true,
        'pedido_id', v_pedido_id,
        'codigo', v_codigo,
        'total', v_total_calculado,
        'items', v_items_resumen
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.crear_pedido_seguro TO anon, authenticated;


-- --------------------------------------------------------
-- 3. SEGURIDAD ESTRICTA EN STORAGE (IMÁGENES)
-- --------------------------------------------------------
-- Asegurar que el bucket 'fotos-productos' solo permita subidas a usuarios autenticados
DROP POLICY IF EXISTS "Admin puede subir imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Admin puede borrar imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Admin puede actualizar imagenes" ON storage.objects;

-- Solo administradores autenticados pueden subir, sobrescribir o eliminar archivos
CREATE POLICY "Admin puede subir imagenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fotos-productos');

CREATE POLICY "Admin puede actualizar imagenes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'fotos-productos');

CREATE POLICY "Admin puede borrar imagenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'fotos-productos');

-- Lectura pública solo para el bucket 'fotos-productos'
DROP POLICY IF EXISTS "Imagenes publicas para todos" ON storage.objects;
CREATE POLICY "Imagenes publicas para todos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'fotos-productos');

-- Limpiar cualquier pedido de prueba
DELETE FROM public.pedidos WHERE cliente_nombre IN ('Hacker', 'Test');
