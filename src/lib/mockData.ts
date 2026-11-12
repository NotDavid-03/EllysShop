import type { Producto, Pedido, ConfiguracionNegocio } from '../types';

export const initialConfig: ConfiguracionNegocio = {
  nombre_negocio: 'Mi Tienda & Novedades',
  whatsapp_telefono: '5215512345678', // Reemplazar con el número real
  moneda: '$',
  mensaje_bienvenida: '¡Hola! Me interesa realizar este pedido:'
};

export const initialProducts: Producto[] = [
  {
    id: 'prod-1',
    nombre: 'Café de Especialidad 500g',
    descripcion: 'Granos de café seleccionados de altura, tueste medio artesanal con notas de chocolate y caramelo.',
    categoria: 'Bebidas',
    precio_venta: 180,
    costo: 95,
    unidad: 'bolsa',
    stock: 12,
    imagenes: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-2',
    nombre: 'Taza Cerámica Hecha a Mano',
    descripcion: 'Taza artesanal esmaltada en tonos mate. Capacidad de 350ml, resistente a microondas y lavavajillas.',
    categoria: 'Hogar',
    precio_venta: 140,
    costo: 60,
    unidad: 'pieza',
    stock: 5,
    imagenes: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-3',
    nombre: 'Miel de Abeja Pura 1kg',
    descripcion: 'Miel 100% pura y cruda recolectada en apiarios locales. Sin aditivos ni conservadores.',
    categoria: 'Alimentos',
    precio_venta: 220,
    costo: 130,
    unidad: 'frasco',
    stock: 8,
    imagenes: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-4',
    nombre: 'Vela Aromática de Soja (Lavanda)',
    descripcion: 'Cera de soja ecológica con aceites esenciales naturales. Duración estimada de 40 horas.',
    categoria: 'Hogar',
    precio_venta: 160,
    costo: 75,
    unidad: 'pieza',
    stock: 3,
    imagenes: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  },
  {
    id: 'prod-5',
    nombre: 'Libreta de Hojas Recicladas A5',
    descripcion: '100 hojas de papel kraft con pasta dura encuadernada en espiral metálico.',
    categoria: 'Papelería',
    precio_venta: 95,
    costo: 40,
    unidad: 'pieza',
    stock: 0,
    imagenes: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    ],
    activo: true
  }
];

export const initialOrders: Pedido[] = [
  {
    id: 'ped-demo-1',
    codigo: 'PED-1001',
    cliente_nombre: 'María Gómez',
    cliente_telefono: '525598765432',
    cliente_direccion: 'Calle Flor de Lis #24, Col. Esperanza',
    notas: 'Favor de tocar fuerte el timbre',
    total: 320,
    estado: 'pendiente',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    detalles: [
      {
        producto_id: 'prod-1',
        producto_nombre: 'Café de Especialidad 500g',
        cantidad: 1,
        precio_unitario: 180,
        subtotal: 180
      },
      {
        producto_id: 'prod-2',
        producto_nombre: 'Taza Cerámica Hecha a Mano',
        cantidad: 1,
        precio_unitario: 140,
        subtotal: 140
      }
    ]
  }
];
