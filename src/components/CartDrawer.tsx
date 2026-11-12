import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (codigo: string, whatsappUrl: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
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
        // Abrir WhatsApp
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Carrito */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-lg">Mi Pedido</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded transition-colors"
                title="Vaciar carrito"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
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
                className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <>
              {/* Lista de Items */}
              <div className="space-y-3">
                {cart.map((item) => {
                  const img =
                    item.producto.imagenes && item.producto.imagenes.length > 0
                      ? item.producto.imagenes[0]
                      : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=150&q=80';

                  return (
                    <div
                      key={item.producto.id}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/70"
                    >
                      <img
                        src={img}
                        alt={item.producto.nombre}
                        className="w-14 h-14 rounded-xl object-cover bg-white shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {item.producto.nombre}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {configuracion.moneda}{item.producto.precio_venta.toFixed(2)} c/u
                        </div>

                        {/* Controles de Cantidad */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                            <button
                              onClick={() => updateCartQuantity(item.producto.id, item.cantidad - 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-slate-800">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.producto.id, item.cantidad + 1)}
                              disabled={item.cantidad >= item.producto.stock}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.producto.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Quitar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-slate-900 text-sm">
                          {configuracion.moneda}
                          {(item.producto.precio_venta * item.cantidad).toFixed(2)}
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
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Teléfono o WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej. 55 1234 5678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Dirección de entrega (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Calle, número, colonia o 'Paso a recoger'"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Notas especiales (Opcional)
                    </label>
                    <textarea
                      placeholder="Ej. Entregar después de las 4pm, referencia de casa..."
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      rows={2}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
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
              <span>Subtotal estimado:</span>
              <span className="font-bold text-slate-900 text-base">
                {configuracion.moneda}{cartTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
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
              🔒 Tu pedido se guarda en la base de datos y se abre WhatsApp para coordinar el pago y entrega.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
