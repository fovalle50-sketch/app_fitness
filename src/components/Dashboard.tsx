import React from 'react';
import { AthleteCard } from './AthleteCard';
import { Athlete, Evaluation, WeeklyStats } from '../types';

interface DashboardProps {
  athletes: Athlete[];
  evaluations: Evaluation[];
  onDeleteAthlete: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ athletes, evaluations, onDeleteAthlete }) => {
  // Calculate some stats from real data
  const totalAthletes = athletes.length;
  const inSessionCount = athletes.filter(a => a.status === 'Pro Elite').length; // Just a placeholder logic
  
  const latestEvaluations = evaluations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const averageGrade = evaluations.length > 0 
    ? (evaluations.reduce((acc, curr) => acc + curr.finalGrade, 0) / evaluations.length).toFixed(1)
    : '0.0';

  const weeklyStats: WeeklyStats = {
    points: evaluations.length > 0 ? Math.round(evaluations.reduce((acc, curr) => acc + curr.finalGrade, 0) / evaluations.length) : 0,
    vo2max: 54.2, // Still placeholder for now as we don't have this in the schema
    hrv: 82,
    repVol: '12.4k',
    recovery: 94,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black font-headline tracking-tighter mb-2 text-white uppercase">Roster Activo</h2>
          <p className="text-white/40 max-w-md">Supervisión en tiempo real de métricas biométricas y rendimiento cinético para atletas de élite.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-card px-6 py-3 rounded-none border-l-4 border-accent">
            <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Atletas Totales</div>
            <div className="text-3xl font-black font-headline">{totalAthletes.toString().padStart(2, '0')}</div>
          </div>
          <div className="bg-surface-card px-6 py-3 rounded-none border-l-4 border-primary-blue">
            <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Puntaje Promedio</div>
            <div className="text-3xl font-black font-headline text-primary-blue">{averageGrade}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {athletes.length > 0 ? (
          athletes.slice(0, 6).map(athlete => (
            <AthleteCard key={athlete.id} athlete={athlete} evaluations={evaluations} onDelete={onDeleteAthlete} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10">
            <p className="text-white/20 font-bold uppercase tracking-widest">No hay atletas registrados</p>
          </div>
        )}
      </div>

      <div className="group bg-surface-card p-8 rounded-none relative overflow-hidden transition-all hover:bg-surface-container border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2">Resumen Semanal</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-headline">{weeklyStats.points}</span>
                <span className="text-accent font-bold">PTS</span>
              </div>
            </div>
            <div className="hidden md:block h-12 w-[1px] bg-white/10"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">VO2 MAX</div>
                <div className="text-lg font-bold">{weeklyStats.vo2max}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">HRV</div>
                <div className="text-lg font-bold">{weeklyStats.hrv}ms</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">REP VOL</div>
                <div className="text-lg font-bold">{weeklyStats.repVol}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">RECOVERY</div>
                <div className="text-lg font-bold text-accent">{weeklyStats.recovery}%</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Estado de Flujo</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-6 bg-accent/20"></div>
                <div className="w-1.5 h-8 bg-accent/40"></div>
                <div className="w-1.5 h-10 bg-accent/60"></div>
                <div className="w-1.5 h-12 bg-accent"></div>
                <div className="w-1.5 h-9 bg-accent/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
