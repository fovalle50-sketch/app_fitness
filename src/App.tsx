/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { EvaluationForm } from './components/EvaluationForm';
import { PerformanceTable } from './components/PerformanceTable';
import { AthleteList } from './components/AthleteList';
import { AthleteForm } from './components/AthleteForm';
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

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [evaluationPlans, setEvaluationPlans] = useState<EvaluationPlan[]>([]);
  const [isAddingAthlete, setIsAddingAthlete] = useState(false);

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
    const athletesUnsubscribe = onSnapshot(collection(db, 'athletes'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Athlete));
      setAthletes(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'athletes'));

    // Exercises Sync
    const exercisesUnsubscribe = onSnapshot(collection(db, 'exercises'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Exercise));
      setExercises(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'exercises'));

    // Evaluations Sync
    const evaluationsUnsubscribe = onSnapshot(collection(db, 'evaluations'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Evaluation));
      setEvaluations(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'evaluations'));

    // Evaluation Plans Sync
    const plansUnsubscribe = onSnapshot(collection(db, 'evaluationPlans'), (snapshot) => {
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
      const athleteData = { ...newAthlete, uid: user.uid };
      await setDoc(doc(db, 'athletes', newAthlete.id), athleteData);
      setIsAddingAthlete(false);
      setActiveScreen('alumnos');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'athletes');
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
    try {
      await setDoc(doc(db, 'exercises', newExercise.id), newExercise);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'exercises');
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
      const evalData = { ...evaluation, uid: user.uid };
      await setDoc(doc(db, 'evaluations', evaluation.id), evalData);
      setActiveScreen('reportes');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'evaluations');
    }
  };

  const handleSavePlan = async (plan: EvaluationPlan) => {
    if (!user) return;
    try {
      const planData = { ...plan, uid: user.uid };
      await setDoc(doc(db, 'evaluationPlans', plan.id), planData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'evaluationPlans');
    }
  };

  const handleUpdatePlan = async (updatedPlan: EvaluationPlan) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'evaluationPlans', updatedPlan.id), updatedPlan);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'evaluationPlans');
    }
  };

  const renderScreen = () => {
    if (activeScreen === 'alumnos') {
      if (isAddingAthlete) {
        return <AthleteForm onAdd={handleAddAthlete} onCancel={() => setIsAddingAthlete(false)} />;
      }
      return <AthleteList athletes={athletes} onAddNew={() => setIsAddingAthlete(true)} onDelete={handleDeleteAthlete} />;
    }

    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'ejercicios':
        return <ExerciseManagement exercises={exercises} onAdd={handleAddExercise} onDelete={handleDeleteExercise} />;
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
      default:
        return <Dashboard />;
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
      <Sidebar activeScreen={activeScreen} onScreenChange={(screen) => {
        setActiveScreen(screen);
        setIsAddingAthlete(false);
      }} />
      <TopBar activeScreen={activeScreen} />
      
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
          <Settings2 size={20} className="mb-1" />
          Ejercicios
        </button>
        <button 
          onClick={() => { setActiveScreen('evaluaciones'); setIsAddingAthlete(false); }}
          className={`flex flex-col items-center justify-center p-2 font-sans font-semibold text-[10px] uppercase transition-all ${
            activeScreen === 'evaluaciones' ? 'text-accent' : 'text-white/40'
          }`}
        >
          <Dumbbell size={20} className="mb-1" />
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
