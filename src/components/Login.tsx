import React, { useState, useEffect } from 'react';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signInAnonymously, db, getDocFromServer, doc } from '../firebase';

export const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        setConnectionStatus('online');
      } catch (err: any) {
        if (err.message?.includes('offline') || err.code === 'unavailable') {
          setConnectionStatus('offline');
        } else {
          // If it's a permission error, it means we ARE connected but just can't read this doc
          setConnectionStatus('online');
        }
      }
    };
    checkConnection();
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'kinetic2026') {
      setLoading(true);
      setError(null);
      
      const timeoutId = setTimeout(() => {
        if (loading) {
          setLoading(false);
          setError("La conexión con Firebase está tardando demasiado. Verifica tu conexión.");
        }
      }, 15000);

      try {
        // We'll use anonymous auth to have a UID for Firestore rules
        await signInAnonymously(auth);
        clearTimeout(timeoutId);
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error("Login error:", err);
        let msg = "Error al iniciar sesión. ";
        if (err.code === 'auth/operation-not-allowed') {
          msg += "El inicio de sesión anónimo no está habilitado en la consola de Firebase.";
        } else if (err.code === 'auth/network-request-failed') {
          msg += "Error de red. Verifica tu conexión a internet.";
        } else {
          msg += `[${err.code || 'unknown'}] ${err.message || "Inténtalo de nuevo."}`;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Contraseña incorrecta.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("La conexión con Google está tardando demasiado. Verifica tu conexión.");
      }
    }, 20000);

    try {
      await signInWithPopup(auth, googleProvider);
      clearTimeout(timeoutId);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Login error:", err);
      let msg = "Error al iniciar sesión con Google. ";
      if (err.code === 'auth/unauthorized-domain') {
        msg += "Este dominio no está autorizado en la consola de Firebase.";
      } else if (err.code === 'auth/popup-blocked') {
        msg += "El navegador bloqueó la ventana emergente.";
      } else if (err.code === 'auth/network-request-failed') {
        msg += "Error de red. Verifica tu conexión a internet.";
      } else {
        msg += `[${err.code || 'unknown'}] ${err.message || "Inténtalo de nuevo."}`;
      }
      setError(msg);
      setTimeout(() => setError(null), 10000);
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
            <div className="flex justify-center mb-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                connectionStatus === 'online' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                connectionStatus === 'offline' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                'bg-white/5 text-white/40 border-white/10'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  connectionStatus === 'online' ? 'bg-green-400 animate-pulse' :
                  connectionStatus === 'offline' ? 'bg-red-400' :
                  'bg-white/20'
                }`}></div>
                {connectionStatus === 'online' ? 'Servidor Conectado' :
                 connectionStatus === 'offline' ? 'Sin Conexión' :
                 'Verificando Conexión...'}
              </div>
            </div>

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

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold ml-1">Contraseña de Acceso</label>
                <div className="relative">
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-white/10 focus:outline-none focus:border-accent/50 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-surface-dark py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-surface-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={20} />
                    Entrar al Sistema
                  </>
                )}
              </button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-surface-card px-4 text-white/20">O también</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white/5 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 border border-white/10 hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Entrar con Google
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
