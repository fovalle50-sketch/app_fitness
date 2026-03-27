import React, { useState } from 'react';
import { Search, Filter, Download, ChevronDown, ChevronUp, Activity, Calendar, User, Award, Info } from 'lucide-react';
import { Evaluation } from '../types';

interface PerformanceTableProps {
  evaluations: Evaluation[];
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ evaluations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvaluations = evaluations.filter(ev => 
    ev.athleteName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-12 h-0.5 bg-accent"></span>
            <span className="text-accent font-headline font-bold uppercase tracking-widest text-xs">Analytics Core</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tighter text-white">Reportes de <span className="text-accent">Rendimiento</span></h2>
          <p className="text-white/40 max-w-lg text-sm leading-relaxed">Historial consolidado de evaluaciones multi-ejercicio y análisis cinético avanzado.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-4 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-widest border border-white/5">
            <Download size={14} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por atleta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-card border border-white/5 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-accent/50 transition-all font-medium"
          />
        </div>
        <button className="flex items-center gap-2 bg-surface-card border border-white/5 text-white/60 px-6 py-4 rounded-xl hover:bg-white/5 transition-all">
          <Filter size={18} />
          <span className="text-sm font-bold uppercase tracking-widest">Filtros</span>
        </button>
      </div>

      {/* Evaluations Table */}
      <div className="bg-surface-card rounded-xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-white/5 text-[10px] uppercase font-black tracking-[0.2em] text-white/40">
                <th className="px-6 py-5">Atleta</th>
                <th className="px-6 py-5">Fecha</th>
                <th className="px-6 py-5">Ejercicios</th>
                <th className="px-6 py-5">Nota Final</th>
                <th className="px-6 py-5">Estado</th>
                <th className="px-6 py-5 text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-white/20">
                      <Activity size={48} strokeWidth={1} />
                      <p className="text-sm italic">No se han registrado evaluaciones aún.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvaluations.map((ev) => (
                  <React.Fragment key={ev.id}>
                    <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => toggleExpand(ev.id)}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <User size={14} />
                          </div>
                          <span className="font-bold text-sm">{ev.athleteName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-white/60">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-white/20" />
                          {new Date(ev.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-white/5 px-2 py-1 rounded text-[10px] font-bold text-white/60">
                          {ev.exercises.length} PRUEBAS
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-headline font-black text-xl text-white italic">{ev.finalGrade}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          ev.status === 'Alto' ? 'bg-accent/20 text-accent' : 
                          ev.status === 'Medio' ? 'bg-primary-blue/20 text-primary-blue' : 
                          'bg-red-400/20 text-red-400'
                        }`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-white/20 group-hover:text-accent transition-colors">
                          {expandedId === ev.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === ev.id && (
                      <tr>
                        <td colSpan={6} className="px-0 py-0 bg-surface-dark/50">
                          <div className="overflow-hidden">
                            <div className="p-8 space-y-6">
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                                <Award size={14} /> Desglose de Rendimiento
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {ev.exercises.map((ex) => (
                                  <div key={ex.id} className="bg-surface-card p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                    <div>
                                      <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{ex.exerciseName}</p>
                                      <p className="text-sm font-bold">
                                        {ex.reps} Reps {ex.load > 0 && `• ${ex.load}kg`}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Score</p>
                                      <p className="font-headline font-black text-accent">{ex.score}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="bg-primary-blue/5 border border-primary-blue/20 p-6 rounded-2xl flex gap-4">
        <Info className="text-primary-blue shrink-0" size={24} />
        <div className="space-y-2">
          <h4 className="text-primary-blue font-bold uppercase tracking-widest text-xs">Nota Metodológica</h4>
          <p className="text-sm text-white/60 leading-relaxed">
            Las evaluaciones multi-ejercicio utilizan un sistema de ponderación dinámica. La nota final (0-10) representa la eficiencia neuromuscular promedio del atleta a través de diferentes planos de movimiento y sistemas energéticos. Un score superior a 8.0 indica una capacidad de transferencia de potencia de nivel élite.
          </p>
        </div>
      </div>
    </div>
  );
};
