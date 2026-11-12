import React from 'react';
import { ShoppingBag, Store, ShieldCheck, Lock } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenAdmin }) => {
  const { configuracion, cartCount, cartTotal, isAdmin, isDemoMode } = useCatalog();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Barra de aviso de modo demo si Supabase aún no está enlazado */}
      {isDemoMode && (
        <div className="bg-amber-500 text-slate-950 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>⚡ Modo demostración activo (sin costo). Los pedidos y cambios se guardan localmente hasta conectar Supabase.</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Marca y Nombre del Negocio */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
              {configuracion.nombre_negocio}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Catálogo de productos disponibles
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón de Administración */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isAdmin
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title={isAdmin ? 'Panel de Administrador (Conectado)' : 'Acceso Administrador'}
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">Panel Admin</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </>
            )}
          </button>

          {/* Botón del Carrito / Pedido */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[11px] text-emerald-100 block leading-none">Mi Pedido</span>
              <span className="text-xs font-bold leading-tight">
                {configuracion.moneda}{cartTotal.toFixed(2)}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
