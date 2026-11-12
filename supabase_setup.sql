-- ========================================================
-- SCRIPT DE BASE DE DATOS PARA SUPABASE
-- Copia y pega todo este script en el "SQL Editor" de Supabase
-- y haz clic en "RUN".
-- ========================================================

-- 1. TABLA DE CONFIGURACIÓN DEL NEGOCIO
CREATE TABLE IF NOT EXISTS public.configuracion (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    nombre_negocio TEXT NOT NULL DEFAULT 'Mi Negocio',
    whatsapp_telefono TEXT NOT NULL DEFAULT '5210000000000',
    moneda TEXT NOT NULL DEFAULT '$',
    mensaje_bienvenida TEXT DEFAULT '¡Hola! Me gustaría hacer el siguiente pedido:'
);

-- Insertar configuración inicial por defecto si no existe
INSERT INTO public.configuracion (id, nombre_negocio, whatsapp_telefono, moneda)
VALUES (1, 'Mi Catálogo', '5210000000000', '$')
ON CONFLICT (id) DO NOTHING;

-- 2. TABLA DE PRODUCTOS (ADMINISTRACIÓN E INVENTARIO)
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT DEFAULT '',
    categoria TEXT DEFAULT 'General',
    precio_venta NUMERIC(10,2) NOT NULL CHECK (precio_venta >= 0),
    costo NUMERIC(10,2) DEFAULT 0 CHECK (costo >= 0), -- Privado para el administrador
    unidad TEXT DEFAULT 'pieza', -- pieza, kg, paquete, litro, etc.
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imagenes TEXT[] DEFAULT '{}', -- URLs de las fotos
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. VISTA PÚBLICA DE PRODUCTOS (PROTEGE EL CAMPO "COSTO")
-- El cliente consulta esta vista, donde el campo 'costo' NO existe
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

-- 4. TABLA DE PEDIDOS
CREATE TABLE IF NOT EXISTS public.pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT NOT NULL UNIQUE,
    cliente_nombre TEXT NOT NULL,
    cliente_telefono TEXT NOT NULL,
    cliente_direccion TEXT DEFAULT '',
    notas TEXT DEFAULT '',
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABLA DE DETALLES DEL PEDIDO (PRODUCTOS POR PEDIDO)
CREATE TABLE IF NOT EXISTS public.pedido_detalles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES public.productos(id) ON DELETE SET NULL,
    producto_nombre TEXT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0)
);

-- ========================================================
-- SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ========================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_detalles ENABLE ROW LEVEL SECURITY;

-- Reglas para CONFIGURACION:
-- Público puede leer
CREATE POLICY "Publico puede ver configuracion" 
ON public.configuracion FOR SELECT 
TO anon, authenticated 
USING (true);

-- Solo administradores autenticados pueden modificar
CREATE POLICY "Admin puede actualizar configuracion" 
ON public.configuracion FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para PRODUCTOS:
-- Público puede consultar productos activos (para el catálogo)
CREATE POLICY "Publico puede ver productos activos" 
ON public.productos FOR SELECT 
TO anon 
USING (activo = true);

-- Administrador autenticado tiene acceso total (ver costos, crear, editar, eliminar)
CREATE POLICY "Admin acceso total productos" 
ON public.productos FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para PEDIDOS:
-- Público (clientes) puede crear pedidos
CREATE POLICY "Publico puede crear pedidos" 
ON public.pedidos FOR INSERT 
TO anon 
WITH CHECK (true);

-- Administrador puede ver, cambiar estado y administrar todos los pedidos
CREATE POLICY "Admin acceso total pedidos" 
ON public.pedidos FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Reglas para PEDIDO_DETALLES:
-- Público puede insertar los items de su pedido
CREATE POLICY "Publico puede insertar detalles de pedido" 
ON public.pedido_detalles FOR INSERT 
TO anon 
WITH CHECK (true);

-- Administrador puede ver todos los detalles
CREATE POLICY "Admin acceso total pedido_detalles" 
ON public.pedido_detalles FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Permisos sobre la vista pública
GRANT SELECT ON public.productos_publicos TO anon, authenticated;

-- ========================================================
-- STORAGE BUCKET PARA FOTOS
-- ========================================================
-- Crea el bucket 'fotos-productos' como público para que las imágenes se puedan ver
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos-productos', 'fotos-productos', true)
ON CONFLICT (id) DO NOTHING;

-- Política de Storage: cualquiera puede ver las imágenes
CREATE POLICY "Imagenes publicas para todos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'fotos-productos');

-- Política de Storage: solo usuarios autenticados (admin) pueden subir fotos
CREATE POLICY "Admin puede subir imagenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fotos-productos');

-- Política de Storage: solo usuarios autenticados pueden borrar fotos
CREATE POLICY "Admin puede borrar imagenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'fotos-productos');

-- ========================================================
-- FUNCIÓN AUTOMÁTICA PARA REDUCIR STOCK AL CREAR UN PEDIDO
-- ========================================================
CREATE OR REPLACE FUNCTION public.descontar_stock_pedido()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.productos
    SET stock = GREATEST(0, stock - NEW.cantidad)
    WHERE id = NEW.producto_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_descontar_stock ON public.pedido_detalles;
CREATE TRIGGER trigger_descontar_stock
AFTER INSERT ON public.pedido_detalles
FOR EACH ROW
EXECUTE FUNCTION public.descontar_stock_pedido();
