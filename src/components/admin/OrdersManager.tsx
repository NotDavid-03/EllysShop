import React, { useState } from 'react';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Phone,
  MapPin,
  FileText,
  Filter,
} from 'lucide-react';
import type { EstadoPedido, Pedido } from '../../types';
import { useCatalog } from '../../context/CatalogContext';

export const OrdersManager: React.FC = () => {
  const { pedidos, updateOrderStatus, configuracion } = useCatalog();
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroEstado === 'todos') return true;
    return p.estado === filtroEstado;
  });

  const getStatusBadge = (estado: EstadoPedido) => {
    switch (estado) {
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
      case 'confirmado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <CheckCircle className="w-3.5 h-3.5" /> Confirmado
          </span>
        );
      case 'en_camino':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <Truck className="w-3.5 h-3.5" /> En camino
          </span>
        );
      case 'entregado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" /> Entregado
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            <XCircle className="w-3.5 h-3.5" /> Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  const handleOpenClientWhatsApp = (pedido: Pedido) => {
    const cleanPhone = pedido.cliente_telefono.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `¡Hola ${pedido.cliente_nombre}! Te escribo de *${configuracion.nombre_negocio}* en relación a tu pedido #${pedido.codigo}.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Barra de Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          <span>Filtrar por:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'todos', label: 'Todos', count: pedidos.length },
            {
              id: 'pendiente',
              label: 'Pendientes',
              count: pedidos.filter((p) => p.estado === 'pendiente').length,
            },
            {
              id: 'confirmado',
              label: 'Confirmados',
              count: pedidos.filter((p) => p.estado === 'confirmado').length,
            },
            {
              id: 'entregado',
              label: 'Entregados',
              count: pedidos.filter((p) => p.estado === 'entregado').length,
            },
            {
              id: 'cancelado',
              label: 'Cancelados',
              count: pedidos.filter((p) => p.estado === 'cancelado').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltroEstado(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                filtroEstado === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filtroEstado === tab.id
                    ? 'bg-purple-800 text-purple-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <FileText className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-700 text-base">No hay pedidos en esta sección</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Cuando un cliente confirme un pedido desde el catálogo, aparecerá aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pedidosFiltrados.map((pedido) => (
            <div
              key={pedido.id || pedido.codigo}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-200 transition-colors"
            >
              {/* Cabecera del pedido */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-lg">
                    #{pedido.codigo}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(pedido.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(pedido.estado)}

                  {/* Selector de cambio de estado */}
                  <select
                    value={pedido.estado}
                    onChange={(e) =>
                      updateOrderStatus(pedido.id, e.target.value as EstadoPedido)
                    }
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="pendiente">🟡 Pendiente</option>
                    <option value="confirmado">🔵 Confirmado</option>
                    <option value="en_camino">🟣 En camino</option>
                    <option value="entregado">🟢 Entregado</option>
                    <option value="cancelado">⚪ Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Información del cliente y detalles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {/* Datos del Cliente */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 text-sm">
                    {pedido.cliente_nombre}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pedido.cliente_telefono}</span>
                    <button
                      onClick={() => handleOpenClientWhatsApp(pedido)}
                      className="ml-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md"
                      title="Abrir chat en WhatsApp"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                  {pedido.cliente_direccion && (
                    <div className="flex items-start gap-1.5 text-slate-600 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{pedido.cliente_direccion}</span>
                    </div>
                  )}
                  {pedido.notas && (
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-900 text-[11px] mt-2">
                      <span className="font-bold">Nota:</span> {pedido.notas}
                    </div>
                  )}
                </div>

                {/* Items del Pedido */}
                <div className="md:col-span-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Productos del Pedido:
                  </span>
                  <div className="space-y-1.5">
                    {pedido.detalles?.map((det, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-slate-700"
                      >
                        <div>
                          <span className="font-bold text-slate-900">
                            {det.cantidad}x
                          </span>{' '}
                          <span>{det.producto_nombre}</span>
                          <span className="text-[11px] text-slate-400 ml-1.5">
                            ({configuracion.moneda}{det.precio_unitario.toFixed(2)} c/u)
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900">
                          {configuracion.moneda}{det.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Total a cobrar:</span>
                    <span className="text-base font-black text-emerald-700">
                      {configuracion.moneda}{pedido.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
