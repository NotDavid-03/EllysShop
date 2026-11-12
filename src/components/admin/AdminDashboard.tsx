import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  Settings,
  Plus,
  LogOut,
  ExternalLink,
  Edit2,
  Trash2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Search,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { Producto } from '../../types';
import { useCatalog } from '../../context/CatalogContext';
import { ProductFormModal } from './ProductFormModal';
import { OrdersManager } from './OrdersManager';
import { ConfigManager } from './ConfigManager';

interface AdminDashboardProps {
  onBackToCatalog: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToCatalog }) => {
  const { productos, pedidos, configuracion, deleteProduct, logoutAdmin } =
    useCatalog();

  const [activeTab, setActiveTab] = useState<'productos' | 'pedidos' | 'configuracion'>(
    'productos'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Producto | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Métricas de Inventario
  const totalProductos = productos.length;
  const totalStockUnidades = productos.reduce((sum, p) => sum + p.stock, 0);
  const productosBajoStock = productos.filter((p) => p.stock > 0 && p.stock <= 3).length;
  const productosAgotados = productos.filter((p) => p.stock <= 0).length;

  const valorInventarioCosto = productos.reduce(
    (sum, p) => sum + (p.costo || 0) * p.stock,
    0
  );
  const valorInventarioVenta = productos.reduce(
    (sum, p) => sum + p.precio_venta * p.stock,
    0
  );
  const margenEstimadoTotal = valorInventarioVenta - valorInventarioCosto;

  // Filtrado de productos en tabla
  const productosFiltrados = productos.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setSelectedProductForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (producto: Producto) => {
    setSelectedProductForEdit(producto);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}"?`)) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 pb-16">
      {/* Barra Superior del Panel Admin */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide block leading-none">
                Panel de Administración
              </span>
              <span className="text-[11px] text-slate-400">
                {configuracion.nombre_negocio}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToCatalog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Tienda</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="max-w-7xl mx-auto px-4 flex border-t border-slate-800 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('productos')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'productos'
                ? 'border-purple-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos & Inventario</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full">
              {productos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'pedidos'
                ? 'border-purple-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos Recibidos</span>
            <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold">
              {pedidos.filter((p) => p.estado === 'pendiente').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('configuracion')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'configuracion'
                ? 'border-purple-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configuración</span>
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
        {/* PESTAÑA: PRODUCTOS */}
        {activeTab === 'productos' && (
          <div className="space-y-6">
            {/* Tarjetas de Métricas de Negocio */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Productos</span>
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {totalProductos}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({totalStockUnidades} unidades)
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Stock Crítico</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-600">
                    {productosBajoStock + productosAgotados}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({productosAgotados} agotados)
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Inversión en Costo</span>
                  <DollarSign className="w-4 h-4 text-slate-600" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black text-slate-900">
                    {configuracion.moneda}{valorInventarioCosto.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Margen Potencial</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black text-emerald-600">
                    +{configuracion.moneda}{margenEstimadoTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Barra de Acciones y Búsqueda */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Producto</span>
              </button>
            </div>

            {/* Tabla de Productos */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Producto</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Precio Venta</th>
                      <th className="py-3 px-4 text-purple-700">🔒 Costo (Admin)</th>
                      <th className="py-3 px-4 text-emerald-700">Margen Unit.</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No se encontraron productos.
                        </td>
                      </tr>
                    ) : (
                      productosFiltrados.map((prod) => {
                        const img =
                          prod.imagenes && prod.imagenes.length > 0
                            ? prod.imagenes[0]
                            : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=150&q=80';
                        const margin = prod.precio_venta - (prod.costo || 0);

                        return (
                          <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={img}
                                  alt={prod.nombre}
                                  className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 block line-clamp-1">
                                    {prod.nombre}
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    {prod.unidad || 'pieza'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                                {prod.categoria || 'General'}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              {prod.stock <= 0 ? (
                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                                  0 (Agotado)
                                </span>
                              ) : prod.stock <= 3 ? (
                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                  {prod.stock} disponibles
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  {prod.stock} disponibles
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 font-bold text-slate-900">
                              {configuracion.moneda}{prod.precio_venta.toFixed(2)}
                            </td>

                            <td className="py-3 px-4 font-semibold text-purple-900 bg-purple-50/50">
                              {configuracion.moneda}{(prod.costo || 0).toFixed(2)}
                            </td>

                            <td className="py-3 px-4 font-bold text-emerald-700">
                              +{configuracion.moneda}{margin.toFixed(2)}
                            </td>

                            <td className="py-3 px-4">
                              {prod.activo !== false ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                                  <Eye className="w-3.5 h-3.5" /> Visible
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                                  <EyeOff className="w-3.5 h-3.5" /> Oculto
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right space-x-1">
                              <button
                                onClick={() => handleOpenEditModal(prod)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                title="Editar producto"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(prod.id, prod.nombre)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Eliminar producto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA: PEDIDOS */}
        {activeTab === 'pedidos' && <OrdersManager />}

        {/* PESTAÑA: CONFIGURACIÓN */}
        {activeTab === 'configuracion' && <ConfigManager />}
      </main>

      {/* Modal para Crear / Editar Producto */}
      <ProductFormModal
        producto={selectedProductForEdit}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
      />
    </div>
  );
};
