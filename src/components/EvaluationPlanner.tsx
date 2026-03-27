import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle2, X, Dumbbell, Timer, Scale } from 'lucide-react';
import { Athlete, Exercise, EvaluationPlan, PlannedExercise } from '../types';

interface EvaluationPlannerProps {
  athletes: Athlete[];
  exercises: Exercise[];
  onSave: (plan: EvaluationPlan) => void;
  onCancel: () => void;
}

export const EvaluationPlanner: React.FC<EvaluationPlannerProps> = ({ athletes, exercises, onSave, onCancel }) => {
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [targetReps, setTargetReps] = useState<string>('');
  const [targetTime, setTargetTime] = useState<string>('');
  const [targetLoad, setTargetLoad] = useState<string>('');
  const [plannedExercises, setPlannedExercises] = useState<PlannedExercise[]>([]);

  const selectedAthlete = useMemo(() => 
    athletes.find(a => a.id === selectedAthleteId), 
    [athletes, selectedAthleteId]
  );

  const selectedExercise = useMemo(() => 
    exercises.find(e => e.id === selectedExerciseId),
    [exercises, selectedExerciseId]
  );

  const handleAddExercise = () => {
    if (!selectedExercise || !selectedAthlete) return;

    const newPlanned: PlannedExercise = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      targetReps: targetReps ? parseInt(targetReps) : undefined,
      targetTime: targetTime || undefined,
      targetLoad: targetLoad ? parseFloat(targetLoad) : undefined,
      isCompleted: false,
    };

    setPlannedExercises([...plannedExercises, newPlanned]);
    setSelectedExerciseId('');
    setTargetReps('');
    setTargetTime('');
    setTargetLoad('');
  };

  const removeExercise = (id: string) => {
    setPlannedExercises(plannedExercises.filter(ex => ex.id !== id));
  };

  const handleSavePlan = () => {
    if (!selectedAthlete || plannedExercises.length === 0) return;

    const newPlan: EvaluationPlan = {
      id: Math.random().toString(36).substr(2, 9),
      athleteId: selectedAthlete.id,
      athleteName: selectedAthlete.name,
      date: new Date().toISOString(),
      exercises: plannedExercises,
      status: 'Planificada',
    };

    onSave(newPlan);
  };

  return (
    <div className="max-w-4xl mx-auto bg-surface-card rounded-xl overflow-hidden border border-white/5 shadow-2xl">
      <div className="bg-surface-container p-6 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 text-accent flex items-center justify-center rounded-lg">
            <Timer size={20} />
          </div>
          <h2 className="font-headline font-black text-xl uppercase tracking-tight">Planificar Evaluación</h2>
        </div>
        <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="p-8 space-y-8">
        {/* Athlete Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Atleta</label>
          <select 
            value={selectedAthleteId}
            onChange={(e) => setSelectedAthleteId(e.target.value)}
            className="w-full bg-surface-dark border-none text-white p-4 rounded-lg appearance-none focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
          >
            <option value="">Seleccionar Atleta...</option>
            {athletes.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Exercise Planning */}
        <div className={`space-y-6 p-6 rounded-xl border border-white/5 bg-white/5 transition-opacity ${!selectedAthleteId ? 'opacity-30 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell size={16} className="text-accent" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Añadir Ejercicio al Plan</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Ejercicio</label>
              <select 
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full bg-surface-dark border-none text-white p-3 rounded-lg appearance-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
              >
                <option value="">Seleccionar...</option>
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Reps Objetivo</label>
              <input 
                type="number" 
                value={targetReps}
                onChange={(e) => setTargetReps(e.target.value)}
                placeholder="Ej. 12"
                className="w-full bg-surface-dark border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-accent/50 transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tiempo Objetivo</label>
              <input 
                type="text" 
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                placeholder="Ej. 60s"
                className="w-full bg-surface-dark border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-accent/50 transition-all text-sm"
              />
            </div>
            
            {selectedExercise?.requiresLoad && (
              <div className="space-y-2 md:col-span-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Carga Objetivo (kg)</label>
                <input 
                  type="number" 
                  value={targetLoad}
                  onChange={(e) => setTargetLoad(e.target.value)}
                  placeholder="Peso en kg..."
                  className="w-full bg-surface-dark border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                />
              </div>
            )}

            <div className="md:col-span-3 pt-2">
              <button 
                type="button"
                onClick={handleAddExercise}
                disabled={!selectedExercise}
                className="w-full bg-accent/10 text-accent border border-accent/20 py-3 rounded-lg font-bold hover:bg-accent/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Añadir al Plan
              </button>
            </div>
          </div>
        </div>

        {/* Planned Exercises List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Ejercicios Planificados</h3>
          <div className="space-y-2">
            {plannedExercises.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl text-white/20 text-sm italic">
                No hay ejercicios en el plan todavía
              </div>
            ) : (
              plannedExercises.map((ex) => (
                <div 
                  key={ex.id}
                  className="flex items-center justify-between bg-surface-dark p-4 rounded-lg group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <Dumbbell size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{ex.exerciseName}</p>
                      <p className="text-xs text-white/40">
                        {ex.targetReps && `${ex.targetReps} Reps`}
                        {ex.targetTime && ` • ${ex.targetTime}`}
                        {ex.targetLoad && ` • ${ex.targetLoad}kg`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeExercise(ex.id)}
                    className="text-white/20 hover:text-red-400 transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-lg font-bold uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={handleSavePlan}
            disabled={!selectedAthlete || plannedExercises.length === 0}
            className="flex-1 bg-accent text-surface-dark py-4 rounded-lg font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(42,229,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
          >
            <CheckCircle2 size={20} />
            Guardar Plan
          </button>
        </div>
      </div>
    </div>
  );
};
