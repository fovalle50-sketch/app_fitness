import React, { useState } from 'react';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../firebase';

export const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Error al iniciar sesión con Google. Inténtalo de nuevo.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(42,229,0,0.05),transparent_50%)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent/10 text-accent mb-6 border border-accent/20 shadow-[0_0_30px_rgba(42,229,0,0.1)]">
            <Lock size={40} />
          </div>
          <h1 className="font-headline text-4xl font-black tracking-tighter uppercase italic text-white">
            Kinetic <span className="text-accent">Precision</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium uppercase tracking-widest text-[10px]">Sistema de Control de Rendimiento</p>
        </div>

        <div className="bg-surface-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
          
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">Bienvenido</h2>
              <p className="text-sm text-white/40">Inicia sesión para gestionar tus atletas y evaluaciones.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest bg-red-400/10 p-3 rounded-lg border border-red-400/20 animate-shake">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-surface-dark py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-surface-dark border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                  Entrar con Google
                </>
              )}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
              © 2026 Kinetic Precision Lab • v2.5.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
