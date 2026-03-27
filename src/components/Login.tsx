import React, { useState } from 'react';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 3000);
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Acceso Restringido</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña de acceso"
                  className={`w-full bg-surface-dark border ${error ? 'border-red-500/50' : 'border-white/5'} text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-accent/50 transition-all font-bold placeholder:text-white/10`}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest bg-red-400/10 p-3 rounded-lg border border-red-400/20 animate-shake">
                <AlertCircle size={14} />
                Acceso Denegado
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-accent text-surface-dark py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(42,229,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              <LogIn size={20} /> Entrar al Sistema
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
              Â© 2026 Kinetic Precision Lab â€¢ v2.4.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
