import React from 'react';
import { Plus, Check, AlertCircle } from 'lucide-react';
import type { Producto } from '../types';
import { useCatalog } from '../context/CatalogContext';

interface ProductCardProps {
  producto: Producto;
  onSelect: (producto: Producto) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ producto, onSelect }) => {
  const { configuracion, addToCart, cart } = useCatalog();

  const itemInCart = cart.find((item) => item.producto.id === producto.id);
  const currentQuantityInCart = itemInCart ? itemInCart.cantidad : 0;
  const isOutOfStock = producto.stock <= 0;
  const isMaxInCart = currentQuantityInCart >= producto.stock;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock && !isMaxInCart) {
      addToCart(producto, 1);
    }
  };

  const primaryImage =
    producto.imagenes && producto.imagenes.length > 0
      ? producto.imagenes[0]
      : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      onClick={() => onSelect(producto)}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badge de Stock / Disponibilidad */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/90 backdrop-blur-xs text-white shadow-xs">
              <AlertCircle className="w-3 h-3" />
              Agotado
            </span>
          ) : producto.stock <= 3 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/90 backdrop-blur-xs text-slate-950 shadow-xs">
              ¡Últimas {producto.stock} {producto.unidad}(s)!
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600/90 backdrop-blur-xs text-white shadow-xs">
              {producto.stock} en stock
            </span>
          )}
        </div>

        {/* Categoría */}
        {producto.categoria && (
          <div className="absolute top-2.5 right-2.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900/60 backdrop-blur-xs text-slate-100">
              {producto.categoria}
            </span>
          </div>
        )}
      </div>

      {/* Contenido / Información */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {producto.nombre}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {producto.descripcion || 'Sin descripción detallada.'}
          </p>
        </div>

        {/* Precio y Botón de Agregar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 block leading-none">Precio</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-extrabold text-slate-900">
                {configuracion.moneda}{producto.precio_venta.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-500">
                / {producto.unidad || 'pza'}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddClick}
            disabled={isOutOfStock || isMaxInCart}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isMaxInCart
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs'
            }`}
            title={
              isOutOfStock
                ? 'Producto agotado'
                : isMaxInCart
                ? 'Tienes el stock máximo en tu carrito'
                : 'Agregar al pedido'
            }
          >
            {currentQuantityInCart > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{currentQuantityInCart} en lista</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Pedir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
