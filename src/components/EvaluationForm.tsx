import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Dumbbell, Lock, AlertCircle, Calculator, Plus, Trash2, CheckCircle2, ChevronRight, Settings2 } from 'lucide-react';
import { Athlete, ExerciseResult, Evaluation, Exercise } from '../types';

interface EvaluationFormProps {
  athletes: Athlete[];
  exercises: Exercise[];
  onSave: (evaluation: Evaluation) => void;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ athletes, exercises, onSave }) => {
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [currentReps, setCurrentReps] = useState<string>('');
  const [currentLoad, setCurrentLoad] = useState<string>('');
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);

  const selectedAthlete = useMemo(() => 
    athletes.find(a => a.id === selectedAthleteId), 
    [athletes, selectedAthleteId]
  );

  const selectedExercise = useMemo(() => 
    exercises.find(e => e.id === selectedExerciseId),
    [exercises, selectedExerciseId]
  );

  const calculateScore = (reps: number, load: number, athlete: Athlete, exercise: Exercise) => {
    // Formula: (Carga * Edad * Sexo) / Peso corporal
    // Carga = Reps * (requiresLoad ? load : 1)
    // Sexo Factor: Masculino = 1.0, Femenino = 1.2
    
    const cargaValue = exercise.requiresLoad ? load : 1;
    const totalCarga = reps * cargaValue;
    const sexoFactor = athlete.gender === 'Masculino' ? 1.0 : 1.2;
    
    // Raw formula from user
    const rawScore = (totalCarga * athlete.age * sexoFactor) / athlete.weight;
    
    // Normalization to 0-10 scale
    // We assume a "very good" raw score is around 50 for bodyweight or 200 for weighted
    // Let's use a dynamic normalization to keep it useful
    const normalizationFactor = exercise.requiresLoad ? 40 : 10;
    const normalizedScore = rawScore / normalizationFactor;
    
    return Math.min(10, Math.max(0, parseFloat(normalizedScore.toFixed(1))));
  };

  const handleAddExercise = () => {
    if (!selectedExercise || !currentReps || !selectedAthlete) return;

    const reps = parseInt(currentReps);
    const load = selectedExercise.requiresLoad ? parseFloat(currentLoad || '0') : 0;
    const score = calculateScore(reps, load, selectedAthlete, selectedExercise);

    const newResult: ExerciseResult = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseName: selectedExercise.name,
      reps,
      load,
      score,
    };

    setExerciseResults([...exerciseResults, newResult]);
    setSelectedExerciseId('');
    setCurrentReps('');
    setCurrentLoad('');
  };

  const removeExercise = (id: string) => {
    setExerciseResults(exerciseResults.filter(ex => ex.id !== id));
  };

  const finalGrade = useMemo(() => {
    if (exerciseResults.length === 0) return 0;
    const sum = exerciseResults.reduce((acc, curr) => acc + curr.score, 0);
    return parseFloat((sum / exerciseResults.length).toFixed(1));
  }, [exerciseResults]);

  const evaluationStatus = useMemo(() => {
    if (finalGrade >= 8) return 'Alto';
    if (finalGrade >= 5) return 'Medio';
    return 'Bajo';
  }, [finalGrade]);

  const handleSaveEvaluation = () => {
    if (!selectedAthlete || exerciseResults.length === 0) return;

    const newEvaluation: Evaluation = {
      id: Math.random().toString(36).substr(2, 9),
      athleteId: selectedAthlete.id,
      athleteName: selectedAthlete.name,
      date: new Date().toISOString(),
      exercises: exerciseResults,
      finalGrade,
      status: evaluationStatus,
    };

    onSave(newEvaluation);
    // Reset form
    setSelectedAthleteId('');
    setExerciseResults([]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Timer size={12} /> Evaluación Multi-Ejercicio
          </div>
          <h1 className="font-headline text-5xl font-black tracking-tighter uppercase italic leading-none">Nueva Evaluación</h1>
          <p className="text-white/40 mt-2 max-w-md">Combina múltiples pruebas cinéticas para generar un perfil de rendimiento integral.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-card p-4 rounded-xl">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Estado de Telemetría</p>
            <p className="text-accent font-bold">SISTEMA LISTO</p>
          </div>
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#2ae500]"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-card rounded-xl p-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
            
            <div className="space-y-8">
              {/* Athlete Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Atleta a Evaluar</label>
                <div className="relative">
                  <select 
                    value={selectedAthleteId}
                    onChange={(e) => setSelectedAthleteId(e.target.value)}
                    className="w-full bg-surface-dark border-none text-white p-4 rounded-lg appearance-none focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
                  >
                    <option value="">Seleccionar Atleta...</option>
                    {athletes.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.weight}kg)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add Exercise Section */}
              <div className={`space-y-6 p-6 rounded-xl border border-white/5 bg-white/5 transition-opacity ${!selectedAthleteId ? 'opacity-30 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Plus size={16} className="text-accent" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">Agregar Ejercicio</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Ejercicio</label>
                    <select 
                      value={selectedExerciseId}
                      onChange={(e) => {
                        setSelectedExerciseId(e.target.value);
                        setCurrentLoad('');
                      }}
                      className="w-full bg-surface-dark border-none text-white p-3 rounded-lg appearance-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                    >
                      <option value="">Seleccionar...</option>
                      {exercises.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.name}</option>
                      ))}
                    </select>
                    {exercises.length === 0 && (
                      <p className="text-[10px] text-red-400 mt-1 italic">No hay ejercicios configurados. Ve a "Ejercicios" para añadir nuevos.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Repeticiones</label>
                    <input 
                      type="number" 
                      value={currentReps}
                      onChange={(e) => setCurrentReps(e.target.value)}
                      placeholder="0"
                      className="w-full bg-surface-dark border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                    />
                  </div>
                  
                  {selectedExercise?.requiresLoad && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2 md:col-span-2"
                    >
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Carga Externa (kg)</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={currentLoad}
                          onChange={(e) => setCurrentLoad(e.target.value)}
                          placeholder="Peso en kg..."
                          className="flex-1 bg-surface-dark border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                        />
                        <div className="flex items-center px-3 bg-white/5 rounded-lg text-[10px] text-white/40 font-bold uppercase">
                          Relativo: {selectedAthlete && currentLoad ? (parseFloat(currentLoad) / selectedAthlete.weight).toFixed(2) : '0.00'}x
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="md:col-span-2 pt-2">
                    <button 
                      type="button"
                      onClick={handleAddExercise}
                      disabled={!selectedExercise || !currentReps || (selectedExercise.requiresLoad && !currentLoad)}
                      className="w-full bg-accent text-surface-dark py-3 rounded-lg font-bold hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> Añadir a la Sesión
                    </button>
                  </div>
                </div>
              </div>

              {/* Exercise List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Ejecución de la Sesión</h3>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {exerciseResults.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl text-white/20 text-sm italic">
                        No hay ejercicios registrados en esta sesión
                      </div>
                    ) : (
                      exerciseResults.map((ex) => (
                        <motion.div 
                          key={ex.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center justify-between bg-surface-dark p-4 rounded-lg group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                              <Dumbbell size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{ex.exerciseName}</p>
                              <p className="text-xs text-white/40">
                                {ex.reps} Reps {ex.load > 0 && `• ${ex.load}kg`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-[10px] uppercase font-bold text-white/40">Score</p>
                              <p className="font-headline font-black text-accent">{ex.score}</p>
                            </div>
                            <button 
                              onClick={() => removeExercise(ex.id)}
                              className="text-white/20 hover:text-red-400 transition-colors p-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Save */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-card p-8 rounded-xl border border-white/5 space-y-8 sticky top-24">
            <div className="flex items-center gap-3">
              <Calculator size={20} className="text-accent" />
              <h3 className="font-headline font-bold text-lg tracking-tight uppercase">Análisis de Resultados</h3>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center p-6 bg-surface-dark rounded-xl border border-white/5">
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Nota Final</p>
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
                  <span className="text-white/40">Ejercicios Realizados</span>
                  <span className="font-bold">{exerciseResults.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Atleta</span>
                  <span className="font-bold">{selectedAthlete?.name || '---'}</span>
                </div>
                <div className="h-[1px] bg-white/5"></div>
                <p className="text-[10px] text-white/30 italic leading-relaxed">
                  Cálculo: (Carga × Edad × Sexo) / Peso Corporal. 
                  {selectedAthlete?.gender === 'Femenino' ? ' Factor Sexo: 1.2 (Femenino).' : ' Factor Sexo: 1.0 (Masculino).'}
                </p>
              </div>

              <button 
                onClick={handleSaveEvaluation}
                disabled={!selectedAthlete || exerciseResults.length === 0}
                className="w-full bg-accent text-surface-dark py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(42,229,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <CheckCircle2 size={20} />
                Finalizar Evaluación
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
