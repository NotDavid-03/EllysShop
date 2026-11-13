import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Camera, FileText, CheckCircle2, HeartHandshake } from 'lucide-react';

export type LegalTab = 'salud' | 'copyright' | 'terminos';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  nombreNegocio?: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'salud',
  nombreNegocio = "Elly's Maquillaje",
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-rose-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 via-white to-amber-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#721422]/10 text-[#721422] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Información Legal y Políticas
              </h2>
              <p className="text-xs text-slate-500">
                {nombreNegocio} • Transparencia, bioseguridad y derechos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-4 pt-2 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('salud')}
            className={`flex items-center gap-1.5 py-2.5 px-3 rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'salud'
                ? 'bg-white text-[#721422] border-t-2 border-t-[#721422] border-x border-slate-200 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Aviso Dermatológico</span>
          </button>

          <button
            onClick={() => setActiveTab('copyright')}
            className={`flex items-center gap-1.5 py-2.5 px-3 rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'copyright'
                ? 'bg-white text-[#721422] border-t-2 border-t-[#721422] border-x border-slate-200 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Propiedad de Imágenes</span>
          </button>

          <button
            onClick={() => setActiveTab('terminos')}
            className={`flex items-center gap-1.5 py-2.5 px-3 rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'terminos'
                ? 'bg-white text-[#721422] border-t-2 border-t-[#721422] border-x border-slate-200 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Términos y Devoluciones</span>
          </button>
        </div>

        {/* Contenido Scrollable */}
        <div className="p-5 sm:p-7 overflow-y-auto text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
          {activeTab === 'salud' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-950 mb-0.5">
                    Descargo de Responsabilidad Médica y Dermatológica
                  </span>
                  En {nombreNegocio} comercializamos exclusivamente productos cosméticos y de cuidado estético de uso externo. No somos médicos, dermatólogos ni profesionales de la salud.
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#721422]" />
                  Naturaleza de la Información
                </h3>
                <p>
                  Todas las descripciones, fichas técnicas, beneficios atribuidos y recomendaciones de uso publicadas en este catálogo tienen carácter estrictamente informativo y estético. Ninguna información aquí contenida debe interpretarse como diagnóstico, prescripción médica, tratamiento ni cura para afecciones cutáneas, alergias o problemas dermatológicos.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#721422]" />
                  Prueba de Sensibilidad (Patch Test)
                </h3>
                <p>
                  Cada tipo de piel y organismo reacciona de manera particular a los ingredientes cosméticos. Recomendamos enfáticamente realizar una prueba de sensibilidad aplicando una pequeña cantidad del producto en el antebrazo o detrás de la oreja 24 horas antes de su aplicación completa.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#721422]" />
                  Reacciones Adversas y Exención de Responsabilidad
                </h3>
                <p>
                  En caso de presentarse cualquier señal de irritación, enrojecimiento, ardor o molestia, suspenda inmediatamente el uso del producto, enjuague con abundante agua y consulte a su médico dermatólogo de confianza. {nombreNegocio} no asume responsabilidad alguna por reacciones alérgicas individuales, hipersensibilidades preexistentes o uso indebido de los cosméticos comercializados. Si usted padece afecciones en la piel, se encuentra bajo tratamiento médico o en estado de embarazo, consulte a su especialista antes de utilizar cualquier cosmético.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-rose-950 text-xs flex items-start gap-3">
                <Camera className="w-5 h-5 text-[#721422] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">
                    Aviso Estricto de Derechos de Autor y Propiedad Intelectual
                  </span>
                  Todo el material gráfico, producciones fotográficas y composiciones visuales expuestas en este catálogo son propiedad intelectual exclusiva de {nombreNegocio}.
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#721422]" />
                  Titularidad de las Imágenes
                </h3>
                <p>
                  Las fotografías de productos, sesiones fotográficas, renders, logotipo comercial, diseño de marca y presentaciones visuales han sido producidos por y para {nombreNegocio}. Todos los derechos de reproducción y distribución están reservados conforme a las leyes nacionales e internacionales de propiedad intelectual y derechos de autor.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#721422]" />
                  Prohibición de Uso No Autorizado
                </h3>
                <p>
                  Queda terminantemente prohibida la descarga, reproducción, copia, distribución, manipulación, modificación, reventa o utilización no autorizada de cualquiera de nuestras imágenes, catálogos o recursos visuales en páginas web de terceros, marketplaces (Facebook Marketplace, MercadoLibre, etc.), tiendas en línea o redes sociales ajenas a {nombreNegocio}.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#721422]" />
                  Acciones Legales por Infracción
                </h3>
                <p>
                  La apropiación indebida de nuestro material fotográfico para suplantación de identidad comercial, engaño al consumidor o uso no consentido facultará a {nombreNegocio} para solicitar la eliminación inmediata de los contenidos mediante notificaciones DMCA / de cese y desista, así como el inicio de las acciones legales y reclamos por daños y perjuicios a que haya lugar.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terminos' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#721422]" />
                  1. Procedimiento de Pedidos y Precios
                </h3>
                <p>
                  El catálogo web actúa como un visualizador oficial de productos. Al seleccionar productos y pulsar "Confirmar pedido", se generará un folio oficial y se abrirá nuestro canal verificado de WhatsApp para coordinar los detalles de pago y entrega. Los precios expresados en el catálogo son oficiales en la moneda indicada y están sujetos a disponibilidad de inventario al momento de procesar la solicitud.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#721422]" />
                  2. Política de Higiene y Bioseguridad (Sin Devoluciones en Cosméticos Abiertos)
                </h3>
                <p>
                  Por estrictas normas de salubridad, higiene personal y bioseguridad, <strong>no se admiten devoluciones ni cambios de ningún producto cosmético, maquillaje o cuidado capilar/facial que haya sido abierto, manipulado, desprecintado o probado</strong>.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#721422]" />
                  3. Garantía por Defectos de Fábrica
                </h3>
                <p>
                  Únicamente se atenderán reclamaciones por defectos evidentes de fabricación o inconsistencias en el envío si el cliente lo notifica formalmente a través de nuestro WhatsApp dentro de las primeras <strong>24 horas posteriores a la recepción</strong>, adjuntando fotografías del producto en su empaque original sellado y con su sello de seguridad intacto.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#721422]" />
                  4. Exactitud de Tonos y Variaciones
                </h3>
                <p>
                  Hacemos nuestro mayor esfuerzo para que los tonos de los cosméticos mostrados en pantalla sean lo más fieles posible a la realidad. Sin embargo, las tonalidades pueden presentar ligeras variaciones debido a la calibración de brillo y color de cada pantalla o dispositivo móvil.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>{nombreNegocio} • Políticas actualizadas 2026</span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#721422] hover:bg-[#580f1a] text-white font-bold transition-all cursor-pointer shadow-xs"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
