/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { EvaluationForm } from './components/EvaluationForm';
import { PerformanceTable } from './components/PerformanceTable';
import { AthleteList } from './components/AthleteList';
import { AthleteForm } from './components/AthleteForm';
import { AthleteDetail } from './components/AthleteDetail';
import { ExerciseManagement } from './components/ExerciseManagement';
import { Login } from './components/Login';
import { Screen, Athlete, Evaluation, Exercise, EvaluationPlan } from './types';
import { Plus, LayoutGrid, Users, Dumbbell, BarChart3, Settings2, LogIn } from 'lucide-react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signOut, 
  User,
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  OperationType,
  handleFirestoreError
} from './firebase';

// Función de limpieza profunda para asegurar que no viajen 'undefined' a Firestore
const deepClean = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => deepClean(v));
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = deepClean(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }
  return obj === undefined ? null : obj;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [evaluationPlans, setEvaluationPlans] = useState<EvaluationPlan[]>([]);
  const [isAddingAthlete, setIsAddingAthlete] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Data Sync Listeners
  useEffect(() => {
    if (!user) {
      setAthletes([]);
      setExercises([]);
      setEvaluations([]);
      setEvaluationPlans([]);
      return;
    }

    // Athletes Sync
    const athletesUnsubscribe = onSnapshot(query(collection(db, 'athletes'), where('uid', '==', user.uid)), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Athlete));
      setAthletes(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'athletes'));

    // Exercises Sync - Exercises are shared or also per user? 
    // Usually exercises are shared, but user might want their own. 
    // Let's keep them shared for now but allow user to add their own if we want.
    // Actually, let's make them per user to avoid mixing up data.
    const exercisesUnsubscribe = onSnapshot(query(collection(db, 'exercises'), where('uid', '==', user.uid)), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Exercise));
      setExercises(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'exercises'));

    // Evaluations Sync
    const evaluationsUnsubscribe = onSnapshot(query(collection(db, 'evaluations'), where('uid', '==', user.uid)), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Evaluation));
      setEvaluations(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'evaluations'));

    // Evaluation Plans Sync
    const plansUnsubscribe = onSnapshot(query(collection(db, 'evaluationPlans'), where('uid', '==', user.uid)), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as EvaluationPlan));
      setEvaluationPlans(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'evaluationPlans'));

    return () => {
      athletesUnsubscribe();
      exercisesUnsubscribe();
      evaluationsUnsubscribe();
      plansUnsubscribe();
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddAthlete = async (newAthlete: Athlete) => {
    if (!user) return;
    try {
      const athleteData = deepClean({ ...newAthlete, uid: user.uid });
      await setDoc(doc(db, 'athletes', newAthlete.id), athleteData);
      setIsAddingAthlete(false);
      setActiveScreen('alumnos');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'athletes');
    }
  };

  const handleUpdateAthlete = async (updatedAthlete: Athlete) => {
    if (!user) return;
    try {
      const athleteData = deepClean({ ...updatedAthlete, uid: user.uid });
      await setDoc(doc(db, 'athletes', updatedAthlete.id), athleteData);
      setIsAddingAthlete(false);
      setEditingAthlete(null);
      setActiveScreen('alumnos');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'athletes');
    }
  };

  const handleDeleteAthlete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'athletes', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'athletes');
    }
  };

  const handleAddExercise = async (newExercise: Exercise) => {
    if (!user) return;
    try {
      const exerciseData = deepClean({ ...newExercise, uid: user.uid });
      await setDoc(doc(db, 'exercises', newExercise.id), exerciseData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'exercises');
    }
  };

  const handleUpdateExercise = async (updatedExercise: Exercise) => {
    try {
      const exerciseData = deepClean(updatedExercise);
      await setDoc(doc(db, 'exercises', updatedExercise.id), exerciseData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'exercises');
    }
  };

  const handleDeleteExercise = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'exercises', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'exercises');
    }
  };

  const handleSaveEvaluation = async (evaluation: Evaluation) => {
    if (!user) return;
    try {
      const evalData = deepClean({ ...evaluation, uid: user.uid });
      await setDoc(doc(db, 'evaluations', evaluation.id), evalData);
      setActiveScreen('reportes');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'evaluations');
    }
  };

  const handleSavePlan = async (plan: EvaluationPlan) => {
    if (!user) return;
    try {
      const planData = deepClean({ ...plan, uid: user.uid });
      await setDoc(doc(db, 'evaluationPlans', plan.id), planData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'evaluationPlans');
    }
  };

  const handleUpdatePlan = async (updatedPlan: EvaluationPlan) => {
    if (!user) return;
    try {
      const planData = deepClean({ ...updatedPlan, uid: user.uid });
      await setDoc(doc(db, 'evaluationPlans', updatedPlan.id), planData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'evaluationPlans');
    }
  };

  const renderScreen = () => {
    if (activeScreen === 'alumnos') {
      if (isAddingAthlete || editingAthlete) {
        return (
          <AthleteForm 
            athlete={editingAthlete || undefined}
            onAdd={editingAthlete ? handleUpdateAthlete : handleAddAthlete} 
            onCancel={() => {
              setIsAddingAthlete(false);
              setEditingAthlete(null);
            }} 
          />
        );
      }
      if (selectedAthleteId) {
        const athlete = athletes.find(a => a.id === selectedAthleteId);
        if (athlete) {
          return (
            <AthleteDetail 
              athlete={athlete} 
              evaluations={evaluations.filter(e => e.athleteId === athlete.id)}
              onBack={() => setSelectedAthleteId(null)}
              onEdit={() => {
                setEditingAthlete(athlete);
                setSelectedAthleteId(null);
              }}
            />
          );
        }
      }
      return (
        <AthleteList 
          athletes={athletes} 
          evaluations={evaluations}
          onAddNew={() => setIsAddingAthlete(true)} 
          onDelete={handleDeleteAthlete} 
          onEdit={(athlete) => setEditingAthlete(athlete)}
          onSelect={(athlete) => setSelectedAthleteId(athlete.id)}
        />
      );
    }

    switch (activeScreen) {
      case 'dashboard':
        return (
          <Dashboard 
            athletes={athletes} 
            evaluations={evaluations} 
            onDeleteAthlete={handleDeleteAthlete} 
            onEditAthlete={(athlete) => {
              setEditingAthlete(athlete);
              setActiveScreen('alumnos');
            }}
            onSelectAthlete={(athlete) => {
              setSelectedAthleteId(athlete.id);
              setActiveScreen('alumnos');
            }}
          />
        );
      case 'ejercicios':
        return (
          <ExerciseManagement 
            exercises={exercises} 
            onAdd={handleAddExercise} 
            onUpdate={handleUpdateExercise}
            onDelete={handleDeleteExercise} 
          />
        );
      case 'evaluaciones':
        return (
          <EvaluationForm 
            athletes={athletes} 
            exercises={exercises} 
            plans={evaluationPlans}
            onSavePlan={handleSavePlan}
            onUpdatePlan={handleUpdatePlan}
            onSaveEvaluation={handleSaveEvaluation} 
          />
        );
      case 'reportes':
        return <PerformanceTable evaluations={evaluations} />;
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto py-12">
            <h2 className="text-4xl font-black font-headline tracking-tighter mb-8 uppercase">Configuración del Sistema</h2>
            <div className="bg-surface-card p-8 border border-white/5 space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-accent uppercase tracking-widest">Perfil del Entrenador</h3>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-surface-container overflow-hidden border-2 border-accent">
                    <img src="https://picsum.photos/seed/coach/200/200" alt="Coach" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{user?.displayName || 'Coach Principal'}</p>
                    <p className="text-white/40">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/5">
                <h3 className="text-lg font-bold mb-4 text-accent uppercase tracking-widest">Preferencias de Análisis IA</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-bold">Análisis Automático</p>
                      <p className="text-sm text-white/40">Generar análisis IA inmediatamente después de cada evaluación.</p>
                    </div>
                    <div className="w-12 h-6 bg-accent rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-surface-dark rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-bold">Notificaciones de Fatiga</p>
                      <p className="text-sm text-white/40">Alertar cuando el sistema detecte niveles críticos de fatiga.</p>
                    </div>
                    <div className="w-12 h-6 bg-accent rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-surface-dark rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2"
                >
                  <LogIn size={18} className="rotate-180" />
                  Cerrar Sesión Actual
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard 
            athletes={athletes} 
            evaluations={evaluations} 
            onDeleteAthlete={handleDeleteAthlete} 
            onEditAthlete={(athlete) => {
              setEditingAthlete(athlete);
              setActiveScreen('alumnos');
            }}
            onSelectAthlete={(athlete) => {
              setSelectedAthleteId(athlete.id);
              setActiveScreen('alumnos');
            }}
          />
        );
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-surface-dark text-white font-sans selection:bg-accent/30 selection:text-accent">
      <Sidebar 
        activeScreen={activeScreen} 
        onScreenChange={(screen) => {
          setActiveScreen(screen);
          setIsAddingAthlete(false);
        }} 
        onLogout={handleLogout}
      />
      <TopBar 
        activeScreen={activeScreen} 
        onSettingsClick={() => setActiveScreen('settings')}
      />
      
      <main className="lg:ml-64 pt-24 pb-32 px-6 md:px-12 min-h-screen">
        {renderScreen()}
      </main>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-surface-dark/80 backdrop-blur-xl z-50 rounded-t-2xl border-t border-white/5">
        <button 
          onClick={() => { setActiveScreen('dashboard'); setIsAddingAthlete(false); }}
          className={`flex flex-col items-center justify-center p-2 font-sans font-semibold text-[10px] uppercase transition-all ${
            activeScreen === 'dashboard' ? 'text-accent' : 'text-white/40'
          }`}
        >
          <LayoutGrid size={20} className="mb-1" />
          Dashboard
        </button>
        <button 
          onClick={() => { setActiveScreen('alumnos'); setIsAddingAthlete(false); }}
          className={`flex flex-col items-center justify-center p-2 font-sans font-semibold text-[10px] uppercase transition-all ${
            activeScreen === 'alumnos' ? 'text-accent' : 'text-white/40'
          }`}
        >
          <Users size={20} className="mb-1" />
          Alumnos
        </button>
        <button 
          onClick={() => { setActiveScreen('ejercicios'); setIsAddingAthlete(false); }}
          className={`flex flex-col items-center justify-center p-2 font-sans font-semibold text-[10px] uppercase transition-all ${
            activeScreen === 'ejercicios' ? 'text-accent' : 'text-white/40'
          }`}
        >
          <Dumbbell size={20} className="mb-1" />
          Ejercicios
        </button>
        <button 
          onClick={() => { setActiveScreen('evaluaciones'); setIsAddingAthlete(false); }}
          className={`flex flex-col items-center justify-center p-2 font-sans font-semibold text-[10px] uppercase transition-all ${
            activeScreen === 'evaluaciones' ? 'text-accent' : 'text-white/40'
          }`}
        >
          <Settings2 size={20} className="mb-1" />
          Evaluación
        </button>
        <button 
          onClick={() => { setActiveScreen('reportes'); setIsAddingAthlete(false); }}
          className={`flex flex-col items-center justify-center p-2 font-sans font-semibold text-[10px] uppercase transition-all ${
            activeScreen === 'reportes' ? 'text-accent' : 'text-white/40'
          }`}
        >
          <BarChart3 size={20} className="mb-1" />
          Reportes
        </button>
      </nav>

      {/* Logout button for desktop (optional but good) */}
      <button 
        onClick={handleLogout}
        className="hidden lg:flex fixed bottom-12 left-6 bg-white/5 hover:bg-red-500/10 text-white/20 hover:text-red-400 p-3 rounded-xl transition-all z-50 border border-white/5"
        title="Cerrar Sesión"
      >
        <LogIn size={20} className="rotate-180" />
      </button>

      {/* Floating Action Button */}
      <button 
        onClick={() => {
          if (activeScreen === 'alumnos') {
            setIsAddingAthlete(true);
          } else {
            setActiveScreen('evaluaciones');
            setIsAddingAthlete(false);
          }
        }}
        className="fixed bottom-24 right-6 lg:bottom-12 lg:right-12 bg-accent text-surface-dark w-14 h-14 rounded-full shadow-[0_0_20px_rgba(42,229,0,0.4)] flex items-center justify-center z-40 transition-transform active:scale-90 hover:scale-110"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
