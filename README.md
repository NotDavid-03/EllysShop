# 🛍️ Catálogo Web con Pedidos por WhatsApp y Backend Administrativo

Un sistema completo de catálogo para pequeños negocios y emprendimientos con:
- **Frontend del Cliente:** Catálogo público responsivo (computadora y celular), vista de productos, fotos, disponibilidad de stock, precio y carrito de compras.
- **Backend Administrativo:** Panel privado (`/admin`) para dar de alta productos, subir fotos, gestionar stock, precios de venta y **costos de adquisición** (100% privados y ocultos para los clientes).
- **Pedidos por WhatsApp sin costo:** Registro automático del pedido en la base de datos con folio único y generación de la plantilla de WhatsApp lista para enviar al número del negocio.
- **Costo Total:** **$0 (100% Gratis)** en su capa gratuita (Supabase + Vercel / Cloudflare Pages).

---

## 📁 Estructura del Proyecto

```text
catalogo-negocio/
├── supabase_setup.sql         # Script SQL listo para copiar y pegar en Supabase
├── .env.example               # Ejemplo de variables de entorno
├── src/
│   ├── components/            # Componentes visuales
│   │   ├── Header.tsx         # Barra superior con carrito y acceso admin
│   │   ├── ProductCard.tsx    # Tarjeta de producto con foto y stock
│   │   ├── ProductModal.tsx   # Vista detallada de fotos y descripción
│   │   ├── CartDrawer.tsx     # Carrito y formulario de pedido
│   │   ├── OrderSuccessModal.tsx # Confirmación con folio y enlace WhatsApp
│   │   └── admin/
│   │       ├── AdminDashboard.tsx   # Panel con métricas de inventario y margen
│   │       ├── AdminLogin.tsx       # Inicio de sesión seguro
│   │       ├── ProductFormModal.tsx # Formulario para crear/editar productos
│   │       ├── OrdersManager.tsx    # Listado de pedidos recibidos
│   │       └── ConfigManager.tsx    # Configuración de WhatsApp y negocio
│   ├── context/
│   │   └── CatalogContext.tsx # Lógica de base de datos, carrito y WhatsApp
│   ├── lib/
│   │   ├── supabase.ts        # Cliente de conexión a Supabase
│   │   └── mockData.ts        # Datos iniciales para modo demostración
│   └── types/
│       └── index.ts           # Modelos de Producto, Pedido y Configuración
```

---

## 🚀 Probar el Proyecto Localmente

Para iniciar la página en tu computadora:

1. Abre tu terminal en esta carpeta:
   ```bash
   cd C:\Users\david\.gemini\antigravity\scratch\catalogo-negocio
   ```
2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre el enlace que te indica la terminal (usualmente `http://localhost:5173`).

> 💡 **Nota:** La aplicación cuenta con un **Modo Demostración integrado**. Puedes navegar, agregar productos al carrito, probar el envío a WhatsApp y entrar al panel de administración usando la contraseña: `admin123`.

---

## ☁️ Conexión con Supabase (Base de datos y Fotos 100% Gratis)

Para que tus productos, fotos y pedidos se almacenen en la nube en tiempo real:

1. Crea una cuenta gratuita en [supabase.com](https://supabase.com).
2. Crea un nuevo proyecto (ej. "catalogo-mi-negocio").
3. Ve a la pestaña **SQL Editor** en el menú lateral izquierdo de Supabase.
4. Abre el archivo `supabase_setup.sql` que creamos en este proyecto, copia todo su contenido, pégalo en el editor de Supabase y presiona **Run**.
   - Esto creará automáticamente las tablas: `productos`, `pedidos`, `pedido_detalles`, `configuracion`, la vista protegida `productos_publicos` y el bucket de fotos `fotos-productos`.
5. Ve a **Project Settings** -> **API** en Supabase y copia:
   - **Project URL**
   - **anon public key**
6. Crea un archivo `.env` en la raíz de este proyecto con tus claves:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```
7. Para crear tu usuario de administrador:
   - Ve a **Authentication** -> **Users** en Supabase.
   - Haz clic en **Add User** -> **Create User** e ingresa tu correo y contraseña personal.

---

## 🌐 Cómo Publicarlo en Internet Gratis (Vercel o Cloudflare Pages)

Para que tus clientes puedan entrar desde cualquier celular o computadora:

### Opción A: Vercel (Recomendada, 2 minutos)
1. Sube este proyecto a tu cuenta de GitHub.
2. Entra a [vercel.com](https://vercel.com) (gratis con tu cuenta de GitHub).
3. Haz clic en **Add New Project** y selecciona tu repositorio.
4. En la sección **Environment Variables**, agrega las dos variables de Supabase (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`).
5. Haz clic en **Deploy**. ¡Listo! Tendrás un enlace tipo `https://tu-tienda.vercel.app`.

### Opción B: Cloudflare Pages
1. Conecta tu repositorio de GitHub en [Cloudflare Pages](https://pages.cloudflare.com/).
2. Configura el comando de build como `npm run build` y el directorio de salida como `dist`.
3. Agrega tus variables de entorno y despliega.

---

## 📱 ¿Cómo funciona el Pedido por WhatsApp?

1. El cliente agrega productos y selecciona cantidades.
2. Hace clic en **Mi Pedido**, ingresa su Nombre, Teléfono y Dirección.
3. Al hacer clic en **"Confirmar y Enviar por WhatsApp"**:
   - El sistema registra el pedido en Supabase con folio único (ej. `#PED-4021`).
   - El inventario se actualiza automáticamente.
   - Se abre WhatsApp con la plantilla formateada:
     ```text
     🛍️ *Mi Tienda*
     ¡Hola! Me interesa realizar este pedido:

     📋 *Folio del Pedido:* #PED-4021
     👤 *Cliente:* Juan Pérez
     📞 *Teléfono:* 5512345678
     📍 *Dirección de entrega:* Av. Reforma 123

     🛒 *PRODUCTOS SOLICITADOS:*
     • 2x Café de Especialidad 500g ($180.00 c/u) = $360.00
     • 1x Taza Cerámica Hecha a Mano ($140.00 c/u) = $140.00

     💰 *TOTAL A PAGAR: $500.00*
     ```
4. El cliente solo presiona el botón verde de enviar en su WhatsApp.
5. Tú recibes el mensaje en tu teléfono y ves el pedido registrado en tu panel `/admin`.
