import React, { useState } from 'react';
import { Timer, Plus, Play, CheckCircle2, Calendar, User, ChevronRight, LayoutGrid, ClipboardList } from 'lucide-react';
import { Athlete, Evaluation, Exercise, EvaluationPlan, EvaluationTemplate } from '../types';
import { EvaluationPlanner } from './EvaluationPlanner';
import { EvaluationExecution } from './EvaluationExecution';

interface EvaluationFormProps {
  athletes: Athlete[];
  exercises: Exercise[];
  plans: EvaluationPlan[];
  templates: EvaluationTemplate[];
  onSavePlan: (plan: EvaluationPlan) => void;
  onUpdatePlan: (plan: EvaluationPlan) => void;
  onSaveEvaluation: (evaluation: Evaluation) => void;
}

type ViewState = 'list' | 'planner' | 'execution';

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ 
  athletes, 
  exercises, 
  plans, 
  templates,
  onSavePlan, 
  onUpdatePlan, 
  onSaveEvaluation 
}) => {
  const [view, setView] = useState<ViewState>('list');
  const [activePlan, setActivePlan] = useState<EvaluationPlan | null>(null);

  const handleStartPlanning = () => {
    setView('planner');
  };

  const handleSavePlan = (plan: EvaluationPlan) => {
    onSavePlan(plan);
    setView('list');
  };

  const handleStartExecution = (plan: EvaluationPlan) => {
    setActivePlan(plan);
    setView('execution');
  };

  const handleFinishEvaluation = (evaluation: Evaluation, updatedPlan: EvaluationPlan) => {
    onSaveEvaluation(evaluation);
    onUpdatePlan(updatedPlan);
    setView('list');
    setActivePlan(null);
  };

  const activePlans = plans.filter(p => p.status !== 'Completada');

  if (view === 'planner') {
    return (
      <EvaluationPlanner 
        athletes={athletes} 
        exercises={exercises} 
        templates={templates}
        onSave={handleSavePlan} 
        onCancel={() => setView('list')} 
      />
    );
  }

  if (view === 'execution' && activePlan) {
    return (
      <EvaluationExecution 
        plan={activePlan}
        athletes={athletes}
        exercises={exercises}
        onSave={handleFinishEvaluation}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-5xl font-black tracking-tighter uppercase italic leading-none text-white">Evaluaciones</h1>
          <p className="text-white/40 mt-2 max-w-md">Planifica programas de entrenamiento y registra resultados en tiempo real.</p>
        </div>
        <button 
          onClick={handleStartPlanning}
          className="bg-accent text-surface-dark px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(42,229,0,0.3)] hover:scale-105 transition-all"
        >
          <Plus size={20} />
          Planificar Nueva
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activePlans.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-surface-card rounded-2xl border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
              <ClipboardList size={32} />
            </div>
            <h3 className="text-xl font-headline font-bold uppercase tracking-tight text-white/40">No hay planes activos</h3>
            <p className="text-white/20 text-sm mt-2">Comienza planificando una nueva evaluación para un alumno.</p>
            <button 
              onClick={handleStartPlanning}
              className="mt-6 text-accent font-bold uppercase tracking-widest text-xs hover:underline"
            >
              Crear primer plan
            </button>
          </div>
        ) : (
          activePlans.map(plan => (
            <div 
              key={plan.id}
              className="bg-surface-card p-6 rounded-2xl border border-white/5 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-accent/50"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-accent">
                  <User size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  plan.status === 'Planificada' ? 'bg-primary-blue/20 text-primary-blue' : 'bg-accent/20 text-accent'
                }`}>
                  {plan.status}
                </span>
              </div>

              <h3 className="text-xl font-headline font-bold uppercase tracking-tight mb-1">{plan.athleteName}</h3>
              <div className="flex items-center gap-2 text-white/40 text-xs mb-6">
                <Calendar size={12} />
                {new Date(plan.date).toLocaleDateString()}
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Ejercicios Planificados</p>
                <div className="flex flex-wrap gap-2">
                  {plan.exercises.map(ex => (
                    <span key={ex.id} className="bg-surface-dark px-2 py-1 rounded text-[10px] text-white/60 border border-white/5">
                      {ex.exerciseName}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleStartExecution(plan)}
                className="w-full bg-white/5 group-hover:bg-accent group-hover:text-surface-dark py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <Play size={16} fill="currentColor" />
                {plan.status === 'Planificada' ? 'Iniciar' : 'Continuar'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
