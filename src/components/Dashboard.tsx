import React from 'react';
import { motion } from 'motion/react';
import { AthleteCard } from './AthleteCard';
import { Athlete, WeeklyStats } from '../types';

const MOCK_ATHLETES: Athlete[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    birthDate: '1999-05-15',
    gender: 'Masculino',
    weight: 78.4,
    activityLevel: 92,
    status: 'Pro Elite',
    imageUrl: 'https://picsum.photos/seed/athlete1/200/200',
  },
  {
    id: '2',
    name: 'Elena Vargas',
    birthDate: '2001-11-20',
    gender: 'Femenino',
    weight: 62.1,
    activityLevel: 78,
    status: 'Alto Rendimiento',
    imageUrl: 'https://picsum.photos/seed/athlete2/200/200',
  },
  {
    id: '3',
    name: 'Javier Mendez',
    birthDate: '1994-03-10',
    gender: 'Masculino',
    weight: 89.2,
    activityLevel: 34,
    status: 'Fatiga Detectada',
    imageUrl: 'https://picsum.photos/seed/athlete3/200/200',
  },
];

const WEEKLY_STATS: WeeklyStats = {
  points: 84,
  vo2max: 54.2,
  hrv: 82,
  repVol: '12.4k',
  recovery: 94,
};

export const Dashboard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black font-headline tracking-tighter mb-2 text-white">Roster Activo</h2>
          <p className="text-white/40 max-w-md">Supervisión en tiempo real de métricas biométricas y rendimiento cinético para atletas de élite.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-card px-4 py-2 rounded-lg border-l-2 border-accent">
            <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Atletas Totales</div>
            <div className="text-2xl font-black font-headline">42</div>
          </div>
          <div className="bg-surface-card px-4 py-2 rounded-lg border-l-2 border-primary-blue">
            <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">En Sesión</div>
            <div className="text-2xl font-black font-headline text-primary-blue">08</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {MOCK_ATHLETES.map(athlete => (
          <AthleteCard key={athlete.id} athlete={athlete} />
        ))}
      </div>

      <div className="group bg-surface-card p-8 rounded-none relative overflow-hidden transition-all hover:bg-surface-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2">Resumen Semanal</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-headline">{WEEKLY_STATS.points}</span>
                <span className="text-accent font-bold">PTS</span>
              </div>
            </div>
            <div className="hidden md:block h-12 w-[1px] bg-white/10"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">VO2 MAX</div>
                <div className="text-lg font-bold">{WEEKLY_STATS.vo2max}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">HRV</div>
                <div className="text-lg font-bold">{WEEKLY_STATS.hrv}ms</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">REP VOL</div>
                <div className="text-lg font-bold">{WEEKLY_STATS.repVol}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">RECOVERY</div>
                <div className="text-lg font-bold text-accent">{WEEKLY_STATS.recovery}%</div>
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
    </motion.div>
  );
};
