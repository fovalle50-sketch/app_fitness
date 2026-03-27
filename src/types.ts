export type Screen = 'dashboard' | 'alumnos' | 'ejercicios' | 'evaluaciones' | 'reportes';

export interface Athlete {
  id: string;
  name: string;
  birthDate: string; // ISO format YYYY-MM-DD
  gender: 'Masculino' | 'Femenino';
  weight: number;
  activityLevel: number;
  status: 'Pro Elite' | 'Alto Rendimiento' | 'Fatiga Detectada';
  imageUrl: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'Tracción' | 'Empuje' | 'Pierna' | 'Core' | 'Cardio';
  requiresLoad: boolean;
}

export interface PlannedExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  targetReps?: number;
  targetTime?: string;
  targetLoad?: number;
  actualReps?: number;
  actualLoad?: number;
  score?: number;
  isCompleted: boolean;
}

export interface EvaluationPlan {
  id: string;
  athleteId: string;
  athleteName: string;
  date: string;
  exercises: PlannedExercise[];
  status: 'Planificada' | 'En Progreso' | 'Completada';
}

export interface ExerciseResult {
  id: string;
  exerciseName: string;
  reps: number;
  load: number; // 0 if not applicable
  score: number;
}

export interface Evaluation {
  id: string;
  athleteId: string;
  athleteName: string;
  date: string;
  exercises: ExerciseResult[];
  finalGrade: number;
  status: 'Alto' | 'Medio' | 'Bajo';
}

export interface PerformanceRecord {
  id: string;
  athleteId: string;
  athleteName: string;
  exercise: string;
  reps: number;
  score: number;
  status: 'Alto' | 'Medio' | 'Bajo';
  observation: string;
}

export interface WeeklyStats {
  points: number;
  vo2max: number;
  hrv: number;
  repVol: string;
  recovery: number;
}
