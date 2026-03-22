import React from 'react';
import { MoreVertical, Activity, Zap, AlertTriangle } from 'lucide-react';
import { Athlete } from '../types';

interface AthleteCardProps {
  athlete: Athlete;
}

export const AthleteCard: React.FC<AthleteCardProps> = ({ athlete }) => {
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

  return (
    <div className="group bg-surface-card p-6 rounded-none relative overflow-hidden transition-all hover:bg-surface-container border-l-4 border-transparent hover:border-accent/50">
      <div className={`absolute top-0 left-0 w-1 h-full ${athlete.status === 'Fatiga Detectada' ? 'bg-red-400' : athlete.status === 'Alto Rendimiento' ? 'bg-primary-blue' : 'bg-accent'}`}></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-surface-container overflow-hidden border border-white/10">
            <img
              src={athlete.imageUrl}
              alt={athlete.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
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
        <button className="text-white/40 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-4 mb-8">
        <div>
          <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Edad / Sexo</div>
          <div className="text-white font-medium">{athlete.age} / {athlete.gender}</div>
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
        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue hover:text-accent transition-colors">
          Ver Telemetría
        </button>
      </div>
    </div>
  );
};
