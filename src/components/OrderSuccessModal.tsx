import React from 'react';
import { CheckCircle2, MessageSquare, ShoppingBag } from 'lucide-react';

interface OrderSuccessModalProps {
  codigo: string | null;
  whatsappUrl: string | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  codigo,
  whatsappUrl,
  onClose,
}) => {
  if (!codigo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-[#721422] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          ¡Pedido Registrado!
        </h3>

        <div className="my-3 py-2 px-4 rounded-xl bg-slate-100 inline-block font-mono font-bold text-[#721422] text-base border border-slate-200">
          Folio: #{codigo}
        </div>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          Tu pedido quedó registrado en el sistema. Se abrió una ventana de WhatsApp para que nos envíes los datos del pedido y confirmemos tu entrega.
        </p>

        {/* Botón para volver a abrir WhatsApp */}
        {whatsappUrl && (
          <div className="mt-5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#721422] hover:bg-[#580f1a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#721422]/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Abrir chat de WhatsApp</span>
            </a>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-3 w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continuar navegando el catálogo</span>
        </button>
      </div>
    </div>
  );
};
