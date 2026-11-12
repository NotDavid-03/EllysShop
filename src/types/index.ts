export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio_venta: number;
  costo?: number; // Solo visible para el administrador
  unidad: string; // ej. pieza, kg, paquete, litro
  stock: number;
  imagenes: string[];
  activo: boolean;
  created_at?: string;
}

export type EstadoPedido = 'pendiente' | 'confirmado' | 'en_camino' | 'entregado' | 'cancelado';

export interface PedidoItem {
  id?: string;
  pedido_id?: string;
  producto_id: string;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  codigo: string;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_direccion: string;
  notas: string;
  total: number;
  estado: EstadoPedido;
  created_at: string;
  detalles?: PedidoItem[];
}

export interface ConfiguracionNegocio {
  nombre_negocio: string;
  whatsapp_telefono: string;
  moneda: string;
  mensaje_bienvenida: string;
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
}
