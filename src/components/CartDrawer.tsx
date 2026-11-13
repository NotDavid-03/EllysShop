import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import type { LegalTab } from './LegalModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (codigo: string, whatsappUrl: string) => void;
  onOpenLegal?: (tab: LegalTab) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  onOpenLegal,
}) => {
  const {
    cart,
    cartTotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    configuracion,
    createOrder,
  } = useCatalog();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [notas, setNotas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!nombre.trim()) {
      setFormError('Por favor ingresa tu nombre');
      return;
    }
    if (!telefono.trim() || telefono.trim().length < 8) {
      setFormError('Por favor ingresa un teléfono o WhatsApp de contacto válido');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createOrder({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        notas: notas.trim(),
      });

      if (result.success) {
        window.open(result.whatsappUrl, '_blank');
        onClose();
        onOrderSuccess(result.codigo, result.whatsappUrl);
      }
    } catch (err) {
      setFormError('Hubo un problema al registrar el pedido. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Carrito */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#721422]" />
            <h2 className="font-bold text-slate-900 text-lg">Mi Pedido</h2>
            <span className="text-xs bg-rose-100 text-[#721422] font-bold px-2 py-0.5 rounded-full">
              {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded transition-colors cursor-pointer"
                title="Vaciar carrito"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido / Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-700 text-base">Tu pedido está vacío</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Explora el catálogo y agrega los productos que desees comprar.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#721422] hover:bg-[#580f1a] text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <>
              {/* Lista de Items */}
              <div className="space-y-3">
                {cart.map((item) => {
                  const prod = item.producto;
                  if (!prod) return null;

                  const img =
                    Array.isArray(prod.imagenes) && prod.imagenes.length > 0
                      ? prod.imagenes[0]
                      : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=150&q=80';

                  const precioVenta = Number(prod.precio_venta ?? 0);

                  return (
                    <div
                      key={prod.id}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/70"
                    >
                      <img
                        src={img}
                        alt={prod.nombre}
                        className="w-14 h-14 rounded-xl object-cover bg-white shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {prod.nombre}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {configuracion.moneda}{precioVenta.toFixed(2)} c/u
                        </div>

                        {/* Controles de Cantidad */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                            <button
                              onClick={() => updateCartQuantity(prod.id, item.cantidad - 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-slate-800">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(prod.id, item.cantidad + 1)}
                              disabled={item.cantidad >= Number(prod.stock ?? 0)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(prod.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Quitar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-[#721422] text-sm">
                          {configuracion.moneda}
                          {(precioVenta * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Formulario de Datos del Cliente */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Datos para tu Pedido
                </h3>

                {formError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {formError}
                  </div>
                )}

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#721422]/20 focus:border-[#721422]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Teléfono o WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej. 4249 0720"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#721422]/20 focus:border-[#721422]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Dirección de entrega (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Dirección, zona o 'Paso a recoger'"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#721422]/20 focus:border-[#721422]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Notas especiales (Opcional)
                    </label>
                    <textarea
                      placeholder="Ej. Entregar después de las 3pm, referencia de lugar..."
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      rows={2}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#721422]/20 focus:border-[#721422] resize-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer / Botón de Enviar Pedido a WhatsApp */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-slate-600 text-xs sm:text-sm">
              <span>Total del pedido:</span>
              <span className="font-black text-[#721422] text-lg">
                {configuracion.moneda}{Number(cartTotal || 0).toFixed(2)}
              </span>
            </div>

            {/* Aviso legal discreto de bioseguridad y compra */}
            <div className="p-2.5 rounded-xl bg-slate-200/60 text-[11px] text-slate-600 leading-snug">
              <span>Al enviar tu pedido aceptas nuestros </span>
              <button
                type="button"
                onClick={() => onOpenLegal?.('terminos')}
                className="text-[#721422] font-bold underline hover:text-[#580f1a] cursor-pointer"
              >
                Términos
              </button>
              <span> y </span>
              <button
                type="button"
                onClick={() => onOpenLegal?.('salud')}
                className="text-[#721422] font-bold underline hover:text-[#580f1a] cursor-pointer"
              >
                Aviso Dermatológico
              </button>
              <span>. Por bioseguridad sanitaria, cosméticos abiertos no aplican para devolución.</span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#721422] hover:bg-[#580f1a] active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#721422]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registrando pedido...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirmar y Enviar por WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              🔒 Tu pedido se guarda automáticamente y se abre WhatsApp para coordinar el pago y entrega.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
