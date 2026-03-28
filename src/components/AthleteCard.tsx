import React, { useState } from 'react';
import { MoreVertical, Activity, Zap, AlertTriangle, Trash2, BrainCircuit, X, Loader2 } from 'lucide-react';
import { Athlete, Evaluation } from '../types';
import { calculateAge } from '../utils/athleteUtils';
import { analyzeAthletePerformance } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';

interface AthleteCardProps {
  athlete: Athlete;
  evaluations: Evaluation[];
  onDelete: (id: string) => void;
}

export const AthleteCard: React.FC<AthleteCardProps> = ({ athlete, evaluations, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusColors = {
    'Pro Elite': 'bg-accent/10 text-accent',
    'Alto Rendimiento': 'bg-primary-blue/10 text-primary-blue',
    'Fatiga Detectada': 'bg-red-400/10 text-red-400',
  };

  const barColors = {
    'Pro Elite': 'bg-accent shadow-[0_0_8px_rgba(42,229,0,0.5)]',
    'Alto Rendimiento': 'bg-primary-blue',
    'Fatiga Detectada': 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]',
  };

  const age = calculateAge(athlete.birthDate);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeAthletePerformance(athlete, evaluations);
      setAnalysisResult(result || "No se pudo generar el análisis.");
      setShowAnalysisModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="group bg-surface-card p-6 rounded-none relative overflow-hidden transition-all hover:bg-surface-container border-l-4 border-transparent hover:border-accent/50">
      <div className={`absolute top-0 left-0 w-1 h-full ${athlete.status === 'Fatiga Detectada' ? 'bg-red-400' : athlete.status === 'Alto Rendimiento' ? 'bg-primary-blue' : 'bg-accent'}`}></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-surface-container overflow-hidden border border-white/10">
            <img
              src={athlete.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(athlete.name)}/200/200`}
              alt={athlete.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/200?text=${encodeURIComponent(athlete.name)}`;
              }}
            />
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg leading-tight">{athlete.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`${statusColors[athlete.status]} text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-full`}>
                {athlete.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
            className="text-white/20 hover:text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
          <button className="text-white/40 hover:text-white transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-surface-dark/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-sm font-bold mb-4">¿Eliminar a {athlete.name}?</p>
          <div className="flex gap-4 w-full">
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-white/5 py-2 rounded font-bold text-xs uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button 
              onClick={() => onDelete(athlete.id)}
              className="flex-1 bg-red-500 text-white py-2 rounded font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-y-4 mb-8">
        <div>
          <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Edad / Sexo</div>
          <div className="text-white font-medium">{age} / {athlete.gender}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Peso</div>
          <div className="text-white font-medium">{athlete.weight} kg</div>
        </div>
        <div className="col-span-2">
          <div className="flex justify-between items-end mb-2">
            <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Nivel de Actividad</div>
            <div className={`font-black font-headline text-sm ${athlete.status === 'Fatiga Detectada' ? 'text-red-400' : 'text-accent'}`}>
              {athlete.activityLevel}%
            </div>
          </div>
          <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${barColors[athlete.status]}`}
              style={{ width: `${athlete.activityLevel}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              isAnalyzing ? 'text-white/20' : 'text-accent hover:text-white'
            }`}
          >
            {isAnalyzing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <BrainCircuit size={14} />
            )}
            Análisis IA
          </button>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue hover:text-accent transition-colors">
            Telemetría
          </button>
        </div>
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-surface-container border border-surface-dark flex items-center justify-center">
            <Activity size={12} className="text-white/60" />
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container border border-surface-dark flex items-center justify-center">
            <Zap size={12} className="text-white/60" />
          </div>
          {athlete.status === 'Fatiga Detectada' && (
            <div className="w-8 h-8 rounded-full bg-surface-container border border-surface-dark flex items-center justify-center">
              <AlertTriangle size={12} className="text-red-400" />
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {showAnalysisModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAnalysisModal(false)}
              className="absolute inset-0 bg-surface-dark/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-card border border-white/10 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary-blue to-accent"></div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent">
                      <BrainCircuit size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black font-headline uppercase tracking-tight">Análisis de Rendimiento</h2>
                      <p className="text-white/40 text-xs uppercase tracking-widest font-bold">{athlete.name}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAnalysisModal(false)}
                    className="text-white/20 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="bg-surface-dark/50 p-6 border border-white/5 font-sans text-sm leading-relaxed text-white/80 whitespace-pre-wrap max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {analysisResult}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={() => setShowAnalysisModal(false)}
                    className="bg-accent text-surface-dark px-8 py-3 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_20px_rgba(42,229,0,0.3)]"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {error && (
        <div className="absolute bottom-2 left-6 right-6 bg-red-500/10 border border-red-500/20 p-2 text-[10px] text-red-400 font-bold uppercase tracking-widest text-center">
          {error}
        </div>
      )}
    </div>
  );
};
