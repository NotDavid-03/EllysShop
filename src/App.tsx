import { useState, useMemo } from 'react';
import {
  Search,
  MessageCircle,
  Sparkles,
  ChevronRight,
  PackageX,
  Shield,
} from 'lucide-react';
import { useCatalog, CatalogProvider } from './context/CatalogContext';
import type { Producto } from './types';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function AppContent() {
  const { productos, configuracion, isAdmin, isLoading } = useCatalog();

  const [currentView, setCurrentView] = useState<'catalog' | 'admin'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Modal de pedido exitoso
  const [successOrderData, setSuccessOrderData] = useState<{
    codigo: string;
    whatsappUrl: string;
  } | null>(null);

  // Lista de categorías únicas extraídas de los productos
  const categories = useMemo(() => {
    const cats = new Set<string>();
    productos.forEach((p) => {
      if (p.categoria) cats.add(p.categoria);
    });
    return ['todos', ...Array.from(cats)];
  }, [productos]);

  // Filtrado de productos para el catálogo del cliente
  const filteredProducts = useMemo(() => {
    return productos.filter((p) => {
      // Si no es admin, solo mostrar activos
      if (!isAdmin && p.activo === false) return false;

      const matchesSearch =
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'todos' || p.categoria === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [productos, searchTerm, selectedCategory, isAdmin]);

  const handleOrderSuccess = (codigo: string, whatsappUrl: string) => {
    setSuccessOrderData({ codigo, whatsappUrl });
  };

  // Si estamos en vista administrativa
  if (currentView === 'admin') {
    if (!isAdmin) {
      return <AdminLogin onBack={() => setCurrentView('catalog')} />;
    }
    return <AdminDashboard onBackToCatalog={() => setCurrentView('catalog')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Encabezado */}
      <div>
        <Header
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAdmin={() => setCurrentView('admin')}
        />

        {/* Hero Banner en Color Corinto Elegante con Logo */}
        <section className="bg-linear-to-b from-[#721422] to-[#450a14] text-white py-8 sm:py-12 px-4 shadow-inner">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
              {/* Medallón elegante del Logo */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 bg-white shrink-0 group hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo.jpg"
                  alt="Elly's Maquillaje"
                  className="w-full h-full object-cover scale-105"
                />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-rose-100 border border-white/20 mb-2.5 backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Catálogo Oficial & Pedidos por WhatsApp
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  {configuracion.nombre_negocio}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-rose-100/90 max-w-xl">
                  Elige tus productos favoritos de maquillaje y cuidado personal, confirma tu pedido y te atenderemos de inmediato por WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white text-[#721422] hover:bg-rose-50 active:scale-95 font-bold text-xs sm:text-sm shadow-lg shadow-black/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hacer un pedido</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Controles de Búsqueda y Categorías */}
        <div className="max-w-6xl mx-auto px-4 mt-6 sm:mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Buscador */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#721422]/20 focus:border-[#721422] transition-all"
              />
            </div>

            {/* Contador de resultados */}
            <div className="text-xs text-slate-500 self-end sm:self-center font-medium">
              Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            </div>
          </div>

          {/* Filtros de Categorías */}
          {categories.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#721422] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'todos' ? 'Todos los productos' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid de Productos */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-64 border border-slate-100" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 my-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-700 text-lg">No encontramos productos</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                No hay coincidencias con tu búsqueda o categoría seleccionada.
              </p>
              {(searchTerm || selectedCategory !== 'todos') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('todos');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {filteredProducts.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Botón flotante de WhatsApp en color Corinto */}
      <a
        href={`https://wa.me/${configuracion.whatsapp_telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
          '¡Hola! Tengo una duda sobre los productos del catálogo.'
        )}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-20 bg-[#721422] hover:bg-[#580f1a] active:scale-95 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-[#721422]/30 flex items-center gap-2 transition-all cursor-pointer"
        title="Contáctanos por WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold hidden sm:inline">¿Dudas? Escríbenos</span>
      </a>

      {/* Pie de Página */}
      <footer className="mt-12 bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-slate-700 font-semibold">
            <img
              src="/logo.jpg"
              alt="Logo Elly's"
              className="w-6 h-6 rounded-full object-cover ring-1 ring-rose-300"
            />
            <span>{configuracion.nombre_negocio}</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Catálogo digital de productos • Envíos y pedidos vía WhatsApp
          </p>

          <button
            onClick={() => setCurrentView('admin')}
            className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Acceso Administración</span>
          </button>
        </div>
      </footer>

      {/* Modales y Drawers */}
      <ProductModal
        producto={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal
        codigo={successOrderData?.codigo || null}
        whatsappUrl={successOrderData?.whatsappUrl || null}
        onClose={() => setSuccessOrderData(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CatalogProvider>
      <AppContent />
    </CatalogProvider>
  );
}
