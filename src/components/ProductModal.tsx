import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, AlertCircle } from 'lucide-react';
import type { Producto } from '../types';
import { useCatalog } from '../context/CatalogContext';

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ producto, onClose, onOpenCart }) => {
  const { configuracion, addToCart, cart } = useCatalog();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!producto) return null;

  const itemInCart = cart.find((i) => i.producto.id === producto.id);
  const currentInCart = itemInCart ? itemInCart.cantidad : 0;
  const isOutOfStock = producto.stock <= 0;

  const [quantityToAdd, setQuantityToAdd] = useState(1);

  const images =
    producto.imagenes && producto.imagenes.length > 0
      ? producto.imagenes
      : ['https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80'];

  const maxAvailableToAdd = Math.max(0, producto.stock - currentInCart);

  const handleAdd = () => {
    if (quantityToAdd > 0 && maxAvailableToAdd > 0) {
      addToCart(producto, quantityToAdd);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 flex items-center justify-center backdrop-blur-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Galería de Fotos */}
        <div className="md:w-1/2 bg-slate-100 p-4 flex flex-col justify-between">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-xs">
            <img
              src={images[selectedImgIndex] || images[0]}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Miniaturas si hay más de 1 imagen */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImgIndex === idx
                      ? 'border-emerald-600 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalles e Interacción */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                {producto.categoria || 'General'}
              </span>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                  <AlertCircle className="w-3.5 h-3.5" /> Agotado
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-700">
                  {producto.stock} disponibles
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-2 leading-snug">
              {producto.nombre}
            </h2>

            <div className="flex items-baseline gap-1.5 mt-3">
              <span className="text-3xl font-black text-slate-900">
                {configuracion.moneda}{producto.precio_venta.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-slate-500">
                / {producto.unidad || 'pieza'}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Descripción
              </h4>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">
                {producto.descripcion || 'Este producto no cuenta con una descripción detallada por el momento.'}
              </p>
            </div>
          </div>

          {/* Sección de Agregar al Carrito */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            {currentInCart > 0 && (
              <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-xl flex items-center justify-between">
                <span>Ya tienes {currentInCart} en tu lista</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCart();
                  }}
                  className="font-bold underline hover:text-emerald-950"
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
                    className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-slate-800 text-sm">
                    {quantityToAdd}
                  </span>
                  <button
                    onClick={() => setQuantityToAdd((prev) => Math.min(maxAvailableToAdd, prev + 1))}
                    disabled={quantityToAdd >= maxAvailableToAdd}
                    className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-colors"
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
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-emerald-600/25 cursor-pointer'
              }`}
            >
              {isOutOfStock ? (
                'Producto no disponible'
              ) : maxAvailableToAdd <= 0 ? (
                'Alcanzaste el stock máximo en tu carrito'
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    Agregar al pedido • {configuracion.moneda}
                    {(producto.precio_venta * quantityToAdd).toFixed(2)}
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
