import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, AlertCircle, Sparkles } from 'lucide-react';
import type { Producto } from '../types';
import type { LegalTab } from './LegalModal';
import { useCatalog } from '../context/CatalogContext';

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
  onOpenCart: () => void;
  onOpenLegal?: (tab: LegalTab) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  producto, 
  onClose, 
  onOpenCart,
  onOpenLegal 
}) => {
  const { configuracion, addToCart, cart } = useCatalog();
  
  // Todos los Hooks SIEMPRE al inicio (sin retornos condicionales antes)
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  // Reiniciar estado cada vez que cambia el producto seleccionado
  useEffect(() => {
    setSelectedImgIndex(0);
    setQuantityToAdd(1);
  }, [producto?.id]);

  // Cerrar modal al presionar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!producto) return null;

  const itemInCart = cart.find((i) => i.producto?.id === producto.id);
  const currentInCart = itemInCart ? itemInCart.cantidad : 0;
  const stock = Number(producto.stock ?? 0);
  const isOutOfStock = stock <= 0;
  const precioVenta = Number(producto.precio_venta ?? 0);

  const images =
    Array.isArray(producto.imagenes) && producto.imagenes.length > 0
      ? producto.imagenes
      : ['https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80'];

  const maxAvailableToAdd = Math.max(0, stock - currentInCart);

  const handleAdd = () => {
    if (quantityToAdd > 0 && maxAvailableToAdd > 0) {
      addToCart(producto, quantityToAdd);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm transition-opacity"
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/70 text-white hover:bg-[#721422] flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
          title="Cerrar (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Galería de Fotos */}
        <div className="md:w-1/2 bg-slate-100 p-4 sm:p-5 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-xs border border-slate-200/60 select-none">
            <img
              src={images[selectedImgIndex] || images[0]}
              alt={producto.nombre}
              onDragStart={(e) => e.preventDefault()}
              className="w-full h-full object-cover"
            />
            {/* Aviso discreto de propiedad de imagen */}
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/50 backdrop-blur-xs text-[10px] text-white/90 font-medium tracking-wide pointer-events-none">
              © Elly's Maquillaje
            </span>
          </div>

          {/* Miniaturas si hay más de 1 imagen */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImgIndex === idx
                      ? 'border-[#721422] scale-105 shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt="" 
                    onDragStart={(e) => e.preventDefault()}
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalles e Interacción */}
        <div className="p-5 sm:p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {producto.categoria || 'General'}
              </span>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                  <AlertCircle className="w-3.5 h-3.5" /> Agotado
                </span>
              ) : (
                <span className="text-xs font-bold text-[#721422]">
                  {stock} disponibles
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mt-2.5 leading-snug">
              {producto.nombre}
            </h2>

            <div className="flex items-baseline gap-1.5 mt-3">
              <span className="text-2xl sm:text-3xl font-black text-[#721422]">
                {configuracion.moneda}{precioVenta.toFixed(2)}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-500">
                / {producto.unidad || 'pieza'}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Descripción
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">
                {producto.descripcion || 'Este producto no cuenta con una descripción detallada por el momento.'}
              </p>

              {/* Descargo discreto dermatológico */}
              <div className="mt-3.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#721422] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block text-slate-900">Cosmético de uso externo</span>
                  <span>No somos dermatólogos. Realiza una prueba de sensibilidad previa. </span>
                  {onOpenLegal && (
                    <button
                      type="button"
                      onClick={() => onOpenLegal('salud')}
                      className="text-[#721422] font-bold underline hover:text-[#580f1a] cursor-pointer inline ml-0.5"
                    >
                      Aviso legal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Agregar al Carrito */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            {currentInCart > 0 && (
              <div className="bg-rose-50 text-[#721422] text-xs px-3 py-2 rounded-xl flex items-center justify-between border border-rose-100 font-medium">
                <span>Ya tienes {currentInCart} en tu lista</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCart();
                  }}
                  className="font-bold underline hover:text-[#4e0c16] cursor-pointer"
                >
                  Ver carrito
                </button>
              </div>
            )}

            {!isOutOfStock && maxAvailableToAdd > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Cantidad:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <button
                    onClick={() => setQuantityToAdd((prev) => Math.max(1, prev - 1))}
                    disabled={quantityToAdd <= 1}
                    className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-slate-800 text-sm">
                    {quantityToAdd}
                  </span>
                  <button
                    onClick={() => setQuantityToAdd((prev) => Math.min(maxAvailableToAdd, prev + 1))}
                    disabled={quantityToAdd >= maxAvailableToAdd}
                    className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  (Máx. {maxAvailableToAdd})
                </span>
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={isOutOfStock || maxAvailableToAdd <= 0}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                isOutOfStock || maxAvailableToAdd <= 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-[#721422] hover:bg-[#580f1a] active:scale-98 text-white shadow-[#721422]/25 cursor-pointer'
              }`}
            >
              {isOutOfStock ? (
                'Producto agotado'
              ) : maxAvailableToAdd <= 0 ? (
                'Alcanzaste el stock máximo en tu carrito'
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    Agregar al pedido • {configuracion.moneda}
                    {(precioVenta * quantityToAdd).toFixed(2)}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
