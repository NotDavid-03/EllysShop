import React, { useState } from 'react';
import { Save, Check, HelpCircle, PhoneCall } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

export const ConfigManager: React.FC = () => {
  const { configuracion, updateConfiguracion, isDemoMode } = useCatalog();

  const [nombre, setNombre] = useState(configuracion.nombre_negocio);
  const [telefono, setTelefono] = useState(configuracion.whatsapp_telefono);
  const [moneda, setMoneda] = useState(configuracion.moneda);
  const [mensaje, setMensaje] = useState(configuracion.mensaje_bienvenida);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    const success = await updateConfiguracion({
      nombre_negocio: nombre.trim(),
      whatsapp_telefono: telefono.replace(/[^0-9]/g, ''),
      moneda: moneda.trim() || '$',
      mensaje_bienvenida: mensaje.trim(),
    });

    setIsSaving(false);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleTestWhatsApp = () => {
    const clean = telefono.replace(/[^0-9]/g, '');
    const text = encodeURIComponent('¡Hola! Este es un mensaje de prueba desde tu catálogo.');
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-lg">
          Configuración General del Negocio
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Ajusta los datos de contacto y el número donde recibirás los pedidos por WhatsApp.
        </p>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Configuración guardada correctamente.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nombre del Negocio
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Teléfono de WhatsApp para recibir pedidos *
              </label>
              <button
                type="button"
                onClick={handleTestWhatsApp}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Probar número</span>
              </button>
            </div>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej. 5215512345678"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Incluye el código de país sin el signo '+' ni espacios (ej. México: 521 + 10 dígitos).
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Símbolo de Moneda
              </label>
              <input
                type="text"
                value={moneda}
                onChange={(e) => setMoneda(e.target.value)}
                placeholder="$"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mensaje inicial de WhatsApp
              </label>
              <input
                type="text"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="¡Hola! Me gustaría hacer el siguiente pedido:"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Configuración'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tarjeta Informativa sobre Supabase */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <span>Base de Datos y Nube (Supabase)</span>
          {isDemoMode ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">Modo Local / Demo</span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">Conectado en Vivo</span>
          )}
        </h4>
        <p className="leading-relaxed">
          {isDemoMode
            ? 'Actualmente estás usando almacenamiento local gratuito de demostración. Cuando crees tu cuenta gratuita en Supabase (plan Free $0), solo coloca tus claves en el archivo .env para que tus fotos y productos se sincronicen en la nube.'
            : 'Tu aplicación está conectada con Supabase. Los productos, fotos y pedidos se guardan en tiempo real en la nube sin costo.'}
        </p>
      </div>
    </div>
  );
};
