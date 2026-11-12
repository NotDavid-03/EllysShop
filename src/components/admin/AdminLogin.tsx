import React, { useState } from 'react';
import { Lock, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

interface AdminLoginProps {
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBack }) => {
  const { loginAdmin, isDemoMode } = useCatalog();
  const [emailOrPassword, setEmailOrPassword] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin(emailOrPassword, password);
      if (!res.success) {
        setError(res.error || 'Credenciales inválidas');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Acceso Administrativo
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Inicia sesión para gestionar productos, costos, inventario y ver los pedidos recibidos.
        </p>

        {isDemoMode && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
            <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Modo demo activo:</span> Puedes ingresar usando la contraseña demo: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">admin123</code>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isDemoMode ? (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Contraseña demo
              </label>
              <input
                type="password"
                placeholder="Ingresa: admin123"
                value={emailOrPassword}
                onChange={(e) => setEmailOrPassword(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="admin@tunegocio.com"
                  value={emailOrPassword}
                  onChange={(e) => setEmailOrPassword(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Tu contraseña de Supabase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Entrar al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};
