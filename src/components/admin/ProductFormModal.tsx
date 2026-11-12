import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
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
  const [imageUrl, setImageUrl] = useState('');
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
      setImageUrl(producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : '');
      setActivo(producto.activo !== false);
    } else {
      setNombre('');
      setCategoria('General');
      setDescripcion('');
      setPrecioVenta('');
      setCosto('');
      setUnidad('pieza');
      setStock(1);
      setImageUrl('');
      setActivo(true);
    }
    setError('');
  }, [producto, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      } else {
        setError('No se pudo subir la imagen. Verifica el formato.');
      }
    } catch (err) {
      setError('Error al subir el archivo');
    } finally {
      setIsUploading(false);
    }
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
        imagenes: imageUrl.trim() ? [imageUrl.trim()] : [],
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
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-lg">
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
                placeholder="Ej. Café Molido 500g"
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
                placeholder="Ej. Bebidas"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Precios y Costo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
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
                  className="w-full text-sm pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
                placeholder="pieza, kg, bolsa..."
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
                <span>Ganancia estimada por unidad:</span>
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
              placeholder="Detalles sobre presentación, sabor, medidas, etc."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
            />
          </div>

          {/* Imagen del Producto */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Foto del Producto
            </label>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Preview */}
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-300" />
                )}
              </div>

              {/* Botón subir archivo o URL */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex gap-2">
                  <label className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                        <span>Subiendo...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-purple-600" />
                        <span>Subir foto desde dispositivo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                <input
                  type="url"
                  placeholder="O pega el enlace URL de la imagen..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
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
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
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
