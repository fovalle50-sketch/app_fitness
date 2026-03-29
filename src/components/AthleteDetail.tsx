import React, { useMemo } from 'react';
import { ArrowLeft, Edit2, Calendar, TrendingUp, BarChart3, Activity, Award, ChevronRight } from 'lucide-react';
import { Athlete, Evaluation } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';

interface AthleteDetailProps {
  athlete: Athlete;
  evaluations: Evaluation[];
  onBack: () => void;
  onEdit: () => void;
}

export const AthleteDetail: React.FC<AthleteDetailProps> = ({ athlete, evaluations, onBack, onEdit }) => {
  const sortedEvaluations = useMemo(() => 
    [...evaluations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [evaluations]
  );

  const chartData = useMemo(() => 
    sortedEvaluations.map(e => ({
      date: new Date(e.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      score: e.finalGrade,
      fullDate: new Date(e.date).toLocaleDateString('es-ES')
    })),
    [sortedEvaluations]
  );

  const lastEvaluation = sortedEvaluations[sortedEvaluations.length - 1];
  const previousEvaluation = sortedEvaluations[sortedEvaluations.length - 2];
  
  const scoreChange = useMemo(() => {
    if (!lastEvaluation || !previousEvaluation) return 0;
    return parseFloat((lastEvaluation.finalGrade - previousEvaluation.finalGrade).toFixed(1));
  }, [lastEvaluation, previousEvaluation]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest"
        >
          <ArrowLeft size={16} /> Volver a la lista
        </button>
        <button 
          onClick={onEdit}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5"
        >
          <Edit2 size={14} /> Editar Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-card rounded-3xl p-8 border border-white/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-surface-dark border-4 border-accent/20 p-1 mb-6">
                <img 
                  src={athlete.imageUrl} 
                  alt={athlete.name} 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="font-headline text-3xl font-black tracking-tighter uppercase italic leading-none mb-2">{athlete.name}</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest">
                  Nivel {athlete.level}
                </span>
                <span className="px-3 py-1 bg-white/5 text-white/40 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {athlete.status}
                </span>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Peso</p>
                  <p className="text-xl font-bold">{athlete.weight} <span className="text-sm font-normal text-white/40">kg</span></p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Género</p>
                  <p className="text-xl font-bold">{athlete.gender}</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Nacimiento</p>
                  <p className="text-sm font-bold">{new Date(athlete.birthDate).toLocaleDateString('es-ES')}</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Evaluaciones</p>
                  <p className="text-xl font-bold">{evaluations.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-card rounded-3xl p-8 border border-white/5 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Activity size={14} className="text-accent" /> Estado Actual
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] uppercase font-bold mb-2">
                  <span className="text-white/40">Nivel de Progreso</span>
                  <span className="text-accent">{athlete.level * 10}%</span>
                </div>
                <div className="h-1.5 bg-surface-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-1000"
                    style={{ width: `${athlete.level * 10}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-white/40 italic leading-relaxed">
                El alumno se encuentra en el nivel {athlete.level} de 10. 
                {athlete.level >= 8 ? ' Muestra un rendimiento excepcional.' : 
                 athlete.level >= 5 ? ' Sigue progresando de manera constante.' : 
                 ' Está en las etapas iniciales de su desarrollo.'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-card p-6 rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2">Último Score</p>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-headline font-black text-white leading-none">{lastEvaluation?.finalGrade || 'N/A'}</p>
                {scoreChange !== 0 && (
                  <span className={`text-xs font-bold mb-1 ${scoreChange > 0 ? 'text-accent' : 'text-red-400'}`}>
                    {scoreChange > 0 ? '+' : ''}{scoreChange}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-surface-card p-6 rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2">Mejor Score</p>
              <p className="text-4xl font-headline font-black text-white leading-none">
                {evaluations.length > 0 ? Math.max(...evaluations.map(e => e.finalGrade)) : 'N/A'}
              </p>
            </div>
            <div className="bg-surface-card p-6 rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2">Tendencia</p>
              <div className="flex items-center gap-2">
                <TrendingUp size={24} className={scoreChange >= 0 ? 'text-accent' : 'text-red-400'} />
                <span className="font-bold uppercase text-xs tracking-widest">
                  {scoreChange > 0 ? 'Mejorando' : scoreChange < 0 ? 'Descendiendo' : 'Estable'}
                </span>
              </div>
            </div>
          </div>

          {/* Evolution Chart */}
          <div className="bg-surface-card p-8 rounded-3xl border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-xl font-bold uppercase italic tracking-tight flex items-center gap-3">
                <BarChart3 size={20} className="text-accent" /> Evolución del Score
              </h3>
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-accent rounded-full"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Score de Evaluación</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2ae500" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2ae500" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#ffffff20" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#ffffff20" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      domain={[0, 10]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#151619', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                      itemStyle={{ color: '#2ae500', fontWeight: 'bold' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#2ae500" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-2xl">
                  <Activity size={48} className="mb-4 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Datos insuficientes para graficar</p>
                  <p className="text-[10px] mt-1">Realiza al menos 2 evaluaciones para ver la tendencia</p>
                </div>
              )}
            </div>
          </div>

          {/* Past Evaluations List */}
          <div className="bg-surface-card rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5">
              <h3 className="font-headline text-xl font-bold uppercase italic tracking-tight flex items-center gap-3">
                <Award size={20} className="text-accent" /> Historial de Evaluaciones
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {sortedEvaluations.length > 0 ? (
                sortedEvaluations.slice().reverse().map((evalItem) => (
                  <div key={evalItem.id} className="p-6 hover:bg-white/5 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-surface-dark flex flex-col items-center justify-center border border-white/5">
                        <span className="text-[10px] font-black text-white/40 uppercase leading-none mb-1">
                          {new Date(evalItem.date).toLocaleDateString('es-ES', { month: 'short' })}
                        </span>
                        <span className="text-lg font-black leading-none">
                          {new Date(evalItem.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-lg leading-tight mb-1">Evaluación de Desempeño</p>
                        <p className="text-xs text-white/40 italic">
                          {evalItem.exercises.length} ejercicios realizados • {new Date(evalItem.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Score Final</p>
                        <p className="text-2xl font-headline font-black text-accent">{evalItem.finalGrade}</p>
                      </div>
                      <ChevronRight size={20} className="text-white/10 group-hover:text-accent transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-white/20">
                  <p className="text-xs font-bold uppercase tracking-widest">No hay evaluaciones registradas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
