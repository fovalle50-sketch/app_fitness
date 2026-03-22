export type Screen = 'dashboard' | 'alumnos' | 'evaluaciones' | 'reportes';

export interface Athlete {
  id: string;
  name: string;
  age: number;
  gender: 'Masculino' | 'Femenino';
  weight: number;
  activityLevel: number;
  status: 'Pro Elite' | 'Alto Rendimiento' | 'Fatiga Detectada';
  imageUrl: string;
}

export interface ExerciseResult {
  id: string;
  exerciseName: string;
  reps: number;
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
