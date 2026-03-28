import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Ha ocurrido un error inesperado en la aplicación.";
      let isFirestoreError = false;
      let firestoreInfo: any = null;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            isFirestoreError = true;
            firestoreInfo = parsed;
            errorMessage = `Error de Base de Datos: ${parsed.error}`;
          }
        }
      } catch (e) {
        // Not a JSON error message, use default
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-surface-dark flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-surface-card border border-red-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                <AlertTriangle size={40} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-black uppercase italic tracking-tighter">¡Ups! Algo salió mal</h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  {errorMessage}
                </p>
              </div>

              {isFirestoreError && firestoreInfo && (
                <div className="w-full bg-black/20 rounded-xl p-4 text-left space-y-2 border border-white/5">
                  <p className="text-[10px] uppercase font-black text-white/20 tracking-widest">Detalles Técnicos</p>
                  <div className="text-[10px] font-mono text-white/60 space-y-1">
                    <p>Operación: <span className="text-accent">{firestoreInfo.operationType}</span></p>
                    <p>Ruta: <span className="text-accent">{firestoreInfo.path}</span></p>
                    <p>Usuario: <span className="text-accent">{firestoreInfo.authInfo?.userId || 'No autenticado'}</span></p>
                  </div>
                </div>
              )}

              <div className="flex flex-col w-full gap-3 pt-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCcw size={18} />
                  Reintentar
                </button>
                <button 
                  onClick={this.handleReset}
                  className="w-full bg-accent text-surface-dark py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all"
                >
                  <Home size={18} />
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
