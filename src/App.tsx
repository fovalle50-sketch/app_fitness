/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { EvaluationForm } from './components/EvaluationForm';
import { PerformanceTable } from './components/PerformanceTable';
import { AthleteList } from './components/AthleteList';
import { AthleteForm } from './components/AthleteForm';
import { Screen, Athlete, Evaluation } from './types';
import { Plus, LayoutGrid, Users, Dumbbell, BarChart3 } from 'lucide-react';

const INITIAL_ATHLETES: Athlete[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    age: 26,
    gender: 'Masculino',
    weight: 78.4,
    activityLevel: 92,
    status: 'Pro Elite',
    imageUrl: 'https://picsum.photos/seed/athlete1/200/200',
  },
  {
    id: '2',
    name: 'Elena Vargas',
    age: 24,
    gender: 'Femenino',
    weight: 62.1,
    activityLevel: 78,
    status: 'Alto Rendimiento',
    imageUrl: 'https://picsum.photos/seed/athlete2/200/200',
  },
  {
    id: '3',
    name: 'Javier Mendez',
    age: 31,
    gender: 'Masculino',
    weight: 89.2,
    activityLevel: 34,
    status: 'Fatiga Detectada',
    imageUrl: 'https://picsum.photos/seed/athlete3/200/200',
  },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [athletes, setAthletes] = useState<Athlete[]>(INITIAL_ATHLETES);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isAddingAthlete, setIsAddingAthlete] = useState(false);

  const handleAddAthlete = (newAthlete: Athlete) => {
    setAthletes([...athletes, newAthlete]);
    setIsAddingAthlete(false);
    setActiveScreen('alumnos');
  };

  const handleSaveEvaluation = (evaluation: Evaluation) => {
    setEvaluations([evaluation, ...evaluations]);
    setActiveScreen('reportes');
  };

  const renderScreen = () => {
    if (activeScreen === 'alumnos') {
      if (isAddingAthlete) {
        return <AthleteForm onAdd={handleAddAthlete} onCancel={() => setIsAddingAthlete(false)} />;
      }
      return <AthleteList athletes={athletes} onAddNew={() => setIsAddingAthlete(true)} />;
    }

    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'evaluaciones':
        return <EvaluationForm athletes={athletes} onSave={handleSaveEvaluation} />;
      case 'reportes':
        return <PerformanceTable evaluations={evaluations} />;
      default:
        return <Dashboard />;
    }
  };

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
