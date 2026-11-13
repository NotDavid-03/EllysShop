import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, KeyRound, AlertCircle, ShieldAlert } from 'lucide-react';
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
  
  // Protección contra ataques de fuerza bruta (Rate-limit en cliente)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    if (lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin(emailOrPassword, password);
      if (!res.success) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        if (nextAttempts >= 5) {
          setLockoutTimer(30);
          setError('Demasiados intentos fallidos por seguridad. Espera 30 segundos.');
        } else {
          setError(res.error || 'Credenciales inválidas');
        }
      } else {
        setFailedAttempts(0);
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-rose-100/60">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#721422]/10 text-[#721422] flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
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

        {lockoutTimer > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Acceso bloqueado temporalmente: reintenta en {lockoutTimer}s</span>
          </div>
        )}

        {error && lockoutTimer === 0 && (
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
                disabled={lockoutTimer > 0 || loading}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#721422]/20 focus:border-[#721422] disabled:opacity-50"
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
                  disabled={lockoutTimer > 0 || loading}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#721422]/20 focus:border-[#721422] disabled:opacity-50"
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
                  disabled={lockoutTimer > 0 || loading}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#721422]/20 focus:border-[#721422] disabled:opacity-50"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || lockoutTimer > 0}
            className="w-full py-3 px-4 rounded-xl bg-[#721422] hover:bg-[#590f1a] active:scale-98 text-white font-bold text-sm shadow-md shadow-[#721422]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando con servidor seguro...' : lockoutTimer > 0 ? `Espera (${lockoutTimer}s)` : 'Entrar al Panel Seguro'}
          </button>
        </form>
      </div>
    </div>
  );
};
