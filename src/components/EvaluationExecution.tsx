import React, { useState, useMemo } from 'react';
import { CheckCircle2, X, Dumbbell, Timer, Calculator, Trash2, Check, AlertCircle } from 'lucide-react';
import { Athlete, Exercise, EvaluationPlan, PlannedExercise, Evaluation, ExerciseResult } from '../types';
import { calculateAge } from '../utils/athleteUtils';

interface EvaluationExecutionProps {
  plan: EvaluationPlan;
  athletes: Athlete[];
  exercises: Exercise[];
  onSave: (evaluation: Evaluation, updatedPlan: EvaluationPlan) => void;
  onCancel: () => void;
}

export const EvaluationExecution: React.FC<EvaluationExecutionProps> = ({ plan, athletes, exercises, onSave, onCancel }) => {
  const [currentExercises, setCurrentExercises] = useState<PlannedExercise[]>(plan.exercises);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [actualReps, setActualReps] = useState<string>('');
  const [actualLoad, setActualLoad] = useState<string>('');

  const athlete = useMemo(() => 
    athletes.find(a => a.id === plan.athleteId), 
    [athletes, plan.athleteId]
  );

  const calculateScore = (reps: number, load: number, athlete: Athlete, exercise: Exercise) => {
    const age = calculateAge(athlete.birthDate);
    const cargaValue = exercise.requiresLoad ? load : 1;
    
    // Base intensity calculation
    const intensity = reps * cargaValue;
    
    // Gender factor: Females get a 15% boost for the same relative load
    const genderFactor = athlete.gender === 'Femenino' ? 1.15 : 1.0;
    
    // Age factor: Older athletes get more credit (baseline 25 years)
    const ageFactor = Math.max(1, age / 25);
    
    // Strength-to-weight ratio
    const relativeStrength = intensity / athlete.weight;
    
    // Normalization: 
    // For bodyweight (requiresLoad=false), 15-20 reps should be a decent score (~7-8)
    // For weighted (requiresLoad=true), reps * load / weight = 5 should be a decent score
    const normalizationFactor = exercise.requiresLoad ? 0.8 : 0.15;
    
    const score = (relativeStrength * genderFactor * ageFactor) / normalizationFactor;
    
    return Math.min(10, Math.max(0, parseFloat(score.toFixed(1))));
  };

  const handleStartExercise = (ex: PlannedExercise) => {
    setEditingExerciseId(ex.id);
    setActualReps(ex.targetReps?.toString() || '');
    setActualLoad(ex.targetLoad?.toString() || '');
  };

  const handleCompleteExercise = () => {
    if (!editingExerciseId || !athlete) return;

    const reps = parseInt(actualReps || '0');
    const load = parseFloat(actualLoad || '0');
    
    const plannedEx = currentExercises.find(ex => ex.id === editingExerciseId);
    if (!plannedEx) return;

    const exercise = exercises.find(e => e.id === plannedEx.exerciseId);
    if (!exercise) return;

    const score = calculateScore(reps, load, athlete, exercise);

    const updatedExercises = currentExercises.map(ex => 
      ex.id === editingExerciseId 
        ? { ...ex, actualReps: reps, actualLoad: load, score, isCompleted: true }
        : ex
    );

    setCurrentExercises(updatedExercises);
    setEditingExerciseId(null);
    setActualReps('');
    setActualLoad('');
  };

  const finalGrade = useMemo(() => {
    const completed = currentExercises.filter(ex => ex.isCompleted);
    if (completed.length === 0) return 0;
    const sum = completed.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return parseFloat((sum / completed.length).toFixed(1));
  }, [currentExercises]);

  const evaluationStatus = useMemo(() => {
    if (finalGrade >= 8) return 'Alto';
    if (finalGrade >= 5) return 'Medio';
    return 'Bajo';
  }, [finalGrade]);

  const handleFinishEvaluation = () => {
    if (!athlete) return;

    const completedExercises = currentExercises.filter(ex => ex.isCompleted);
    if (completedExercises.length === 0) return;

    const exerciseResults: ExerciseResult[] = completedExercises.map(ex => ({
      id: ex.id,
      exerciseName: ex.exerciseName,
      reps: ex.actualReps || 0,
      load: ex.actualLoad || 0,
      score: ex.score || 0,
    }));

    const newEvaluation: Evaluation = {
      id: Math.random().toString(36).substr(2, 9),
      athleteId: athlete.id,
      athleteName: athlete.name,
      date: new Date().toISOString(),
      exercises: exerciseResults,
      finalGrade,
      status: evaluationStatus,
    };

    const updatedPlan: EvaluationPlan = {
      ...plan,
      exercises: currentExercises,
      status: 'Completada',
    };

    onSave(newEvaluation, updatedPlan);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Timer size={12} /> Ejecución de Evaluación
          </div>
          <h1 className="font-headline text-5xl font-black tracking-tighter uppercase italic leading-none">{athlete?.name}</h1>
          <p className="text-white/40 mt-2 max-w-md">Registra los resultados reales para los ejercicios planificados.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-card p-4 rounded-xl">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Plan</p>
            <p className="text-accent font-bold">EN PROGRESO</p>
          </div>
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#2ae500]"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-card rounded-xl p-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
            
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Ejercicios Planificados</h3>
              
              <div className="space-y-4">
                {currentExercises.map((ex) => {
                  const exercise = exercises.find(e => e.id === ex.exerciseId);
                  const isEditing = editingExerciseId === ex.id;
                  
                  return (
                    <div 
                      key={ex.id}
                      className={`p-6 rounded-xl border transition-all ${
                        ex.isCompleted 
                          ? 'bg-accent/5 border-accent/20' 
                          : isEditing 
                            ? 'bg-white/5 border-accent/50 ring-1 ring-accent/50' 
                            : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ex.isCompleted ? 'bg-accent text-surface-dark' : 'bg-white/10 text-white/40'}`}>
                            {ex.isCompleted ? <Check size={20} /> : <Dumbbell size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-lg">{ex.exerciseName}</p>
                            <p className="text-xs text-white/40 italic">
                              Objetivo: {ex.targetReps && `${ex.targetReps} Reps`}
                              {ex.targetTime && ` • ${ex.targetTime}`}
                              {ex.targetLoad && ` • ${ex.targetLoad}kg`}
                            </p>
                          </div>
                        </div>
                        {!ex.isCompleted && !isEditing && (
                          <button 
                            onClick={() => handleStartExercise(ex)}
                            className="bg-accent/10 text-accent px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-accent/20 transition-all"
                          >
                            Registrar
                          </button>
                        )}
                        {ex.isCompleted && (
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-white/40">Score</p>
                            <p className="font-headline font-black text-accent text-xl">{ex.score}</p>
                          </div>
                        )}
                      </div>

                      {isEditing && (
                        <div className="pt-4 border-t border-white/5 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Repeticiones Reales</label>
                              <input 
                                type="number" 
                                value={actualReps}
                                onChange={(e) => setActualReps(e.target.value)}
                                className="w-full bg-surface-dark border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                                placeholder="0"
                                autoFocus
                              />
                            </div>
                            {exercise?.requiresLoad && (
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Carga Real (kg)</label>
                                <input 
                                  type="number" 
                                  value={actualLoad}
                                  onChange={(e) => setActualLoad(e.target.value)}
                                  className="w-full bg-surface-dark border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                                  placeholder="0"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setEditingExerciseId(null)}
                              className="flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all"
                            >
                              Cancelar
                            </button>
                            <button 
                              onClick={handleCompleteExercise}
                              className="flex-1 bg-accent text-surface-dark py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                            >
                              Confirmar
                            </button>
                          </div>
                        </div>
                      )}

                      {ex.isCompleted && (
                        <div className="pt-4 border-t border-white/5 flex gap-4 text-xs text-white/60">
                          <span>Realizado: <strong>{ex.actualReps} Reps</strong></span>
                          {ex.actualLoad && <span>Carga: <strong>{ex.actualLoad}kg</strong></span>}
                          <button 
                            onClick={() => handleStartExercise(ex)}
                            className="ml-auto text-accent hover:underline"
                          >
                            Editar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-card p-8 rounded-xl border border-white/5 space-y-8 sticky top-24">
            <div className="flex items-center gap-3">
              <Calculator size={20} className="text-accent" />
              <h3 className="font-headline font-bold text-lg tracking-tight uppercase">Resumen de Ejecución</h3>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center p-6 bg-surface-dark rounded-xl border border-white/5">
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Score Actual</p>
                  <p className="text-6xl font-headline font-black tracking-tighter text-white">{finalGrade}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Estado</p>
                  <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    evaluationStatus === 'Alto' ? 'bg-accent/20 text-accent' : 
                    evaluationStatus === 'Medio' ? 'bg-primary-blue/20 text-primary-blue' : 
                    'bg-red-400/20 text-red-400'
                  }`}>
                    {evaluationStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Progreso</span>
                  <span className="font-bold">{currentExercises.filter(ex => ex.isCompleted).length} / {currentExercises.length}</span>
                </div>
                <div className="h-1 bg-surface-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${(currentExercises.filter(ex => ex.isCompleted).length / currentExercises.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={handleFinishEvaluation}
                  disabled={currentExercises.filter(ex => ex.isCompleted).length === 0}
                  className="w-full bg-accent text-surface-dark py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(42,229,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                >
                  <CheckCircle2 size={20} />
                  Finalizar y Guardar
                </button>
                {currentExercises.filter(ex => ex.isCompleted).length === 0 && (
                  <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest text-center">
                    Registra al menos un ejercicio para finalizar
                  </p>
                )}
                <button 
                  onClick={onCancel}
                  className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all"
                >
                  Pausar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
