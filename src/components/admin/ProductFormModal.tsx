import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Check,
  Loader2,
  Trash2,
  Star,
  Plus,
} from 'lucide-react';
import type { Producto } from '../../types';
import { useCatalog } from '../../context/CatalogContext';

interface ProductFormModalProps {
  producto: Producto | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  producto,
  isOpen,
  onClose,
}) => {
  const { addProduct, updateProduct, uploadImage, configuracion } = useCatalog();

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('General');
  const [descripcion, setDescripcion] = useState('');
  const [precioVenta, setPrecioVenta] = useState<number | ''>('');
  const [costo, setCosto] = useState<number | ''>('');
  const [unidad, setUnidad] = useState('pieza');
  const [stock, setStock] = useState<number | ''>(0);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [activo, setActivo] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setCategoria(producto.categoria || 'General');
      setDescripcion(producto.descripcion || '');
      setPrecioVenta(producto.precio_venta);
      setCosto(producto.costo ?? 0);
      setUnidad(producto.unidad || 'pieza');
      setStock(producto.stock);
      setImagenes(producto.imagenes && producto.imagenes.length > 0 ? [...producto.imagenes] : []);
      setActivo(producto.activo !== false);
    } else {
      setNombre('');
      setCategoria('General');
      setDescripcion('');
      setPrecioVenta('');
      setCosto('');
      setUnidad('pieza');
      setStock(1);
      setImagenes([]);
      setActivo(true);
    }
    setUrlInput('');
    setError('');
  }, [producto, isOpen]);

  if (!isOpen) return null;

  // Subir uno o varios archivos a la vez
  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setError('');
      
      const fileList = Array.from(files);
      const uploadPromises = fileList.map((file) => uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const validUrls = results.filter((url): url is string => Boolean(url));

      if (validUrls.length > 0) {
        setImagenes((prev) => [...prev, ...validUrls]);
      } else {
        setError('No se pudieron subir las imágenes. Asegúrate de haber creado el bucket "fotos-productos" en Supabase.');
      }
    } catch (err) {
      setError('Error al subir los archivos');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setImagenes((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImagenes((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetMainImage = (indexToMakeMain: number) => {
    setImagenes((prev) => {
      const selected = prev[indexToMakeMain];
      const remaining = prev.filter((_, idx) => idx !== indexToMakeMain);
      return [selected, ...remaining];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre del producto es obligatorio.');
      return;
    }
    if (precioVenta === '' || Number(precioVenta) < 0) {
      setError('El precio de venta debe ser un número válido.');
      return;
    }
    if (stock === '' || Number(stock) < 0) {
      setError('El stock debe ser 0 o mayor.');
      return;
    }

    setIsSaving(true);
    try {
      const productPayload = {
        nombre: nombre.trim(),
        categoria: categoria.trim() || 'General',
        descripcion: descripcion.trim(),
        precio_venta: Number(precioVenta),
        costo: Number(costo || 0),
        unidad: unidad.trim() || 'pieza',
        stock: Number(stock),
        imagenes: imagenes,
        activo,
      };

      let success = false;
      if (producto) {
        success = await updateProduct(producto.id, productPayload);
      } else {
        success = await addProduct(productPayload);
      }

      if (success) {
        onClose();
      } else {
        setError('Error al guardar el producto. Inténtalo de nuevo.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-lg">
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Nombre y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                placeholder="Ej. Serum Vitamina C BIOGENCE"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Categoría
              </label>
              <input
                type="text"
                placeholder="Ej. Cuidado Facial"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Precios y Costo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-[#721422] uppercase tracking-wider mb-1">
                Precio de Venta * (Público)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-sm font-bold">
                  {configuracion.moneda}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={precioVenta}
                  onChange={(e) => setPrecioVenta(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#721422]/20 focus:border-[#721422]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Costo * (🔒 Privado Admin)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-sm font-bold">
                  {configuracion.moneda}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={costo}
                  onChange={(e) => setCosto(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Unidad
              </label>
              <input
                type="text"
                placeholder="pieza, litro, set..."
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Stock y Margen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Stock Disponible (Unidades) *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                required
              />
            </div>

            <div className="flex flex-col justify-end">
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-900 text-xs flex items-center justify-between">
                <span>Margen estimado unitario:</span>
                <span className="font-extrabold text-sm">
                  {configuracion.moneda}
                  {(Number(precioVenta || 0) - Number(costo || 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Descripción del Producto
            </label>
            <textarea
              rows={2}
              placeholder="Detalles sobre presentación, beneficios, modo de uso..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
            />
          </div>

          {/* SECCIÓN MULTI-IMAGEN (MÍNIMO 3 FOTOS SOPORTADAS) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Fotos del Producto ({imagenes.length} {imagenes.length === 1 ? 'foto' : 'fotos'})
                </label>
                <p className="text-[11px] text-slate-500">
                  Puedes subir varias imágenes a la vez (frente, reverso, textura). La primera foto será la portada.
                </p>
              </div>

              {imagenes.length >= 3 ? (
                <span className="text-[11px] font-bold text-[#721422] bg-rose-100 px-2 py-0.5 rounded-full">
                  ✓ {imagenes.length} fotos cargadas
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  {3 - imagenes.length} más recomendadas
                </span>
              )}
            </div>

            {/* Galería de vistas previas */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
              {imagenes.map((img, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-white shadow-xs"
                >
                  <img src={img} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />

                  {/* Badge de Portada */}
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Portada
                    </div>
                  )}

                  {/* Botones de acción al pasar el cursor o en móvil */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(index)}
                        className="text-[10px] bg-white text-slate-800 font-bold px-2 py-0.5 rounded-md hover:bg-purple-100 transition-colors cursor-pointer"
                        title="Convertir en foto de portada"
                      >
                        Hacer Portada
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Botón rápido para subir más archivos */}
              <label className="aspect-square rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors p-2 text-center">
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                    <span className="text-[10px] text-purple-700 font-bold">Subiendo...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-purple-600" />
                    <span className="text-[11px] font-bold text-purple-700">Subir fotos</span>
                    <span className="text-[9px] text-purple-400">Selecciona 1 o varias</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Opcional: Agregar por enlace URL */}
            <div className="pt-2 flex gap-2">
              <input
                type="url"
                placeholder="O pega el enlace URL de una imagen web..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!urlInput.trim()}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>
          </div>

          {/* Activo / Inactivo */}
          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded-sm focus:ring-purple-500"
              />
              <span>Producto visible en el catálogo</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  'Guardando...'
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{producto ? 'Guardar Cambios' : 'Crear Producto'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
