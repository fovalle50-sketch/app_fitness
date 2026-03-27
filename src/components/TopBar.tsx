import React from 'react';
import { Bell, Settings, Search } from 'lucide-react';
import { Screen } from '../types';

interface TopBarProps {
  activeScreen: Screen;
}

export const TopBar: React.FC<TopBarProps> = ({ activeScreen }) => {
  const screenLabels: Record<Screen, string> = {
    dashboard: 'Dashboard',
    alumnos: 'Gestión de Alumnos',
    ejercicios: 'Gestión de Ejercicios',
    evaluaciones: 'Evaluaciones',
    reportes: 'Reportes Analíticos',
  };

  return (
    <header className="fixed top-0 z-30 lg:left-64 right-0 bg-surface-dark px-6 py-4 flex justify-between items-center border-b border-white/5">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-black text-white tracking-tighter uppercase font-headline">Kinetic Precision</h1>
        <span className="text-white/40 font-normal text-sm hidden md:block">/ {screenLabels[activeScreen]}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center bg-surface-container rounded-full px-4 py-2 text-white/60">
          <Search size={16} className="mr-2" />
          <input
            type="text"
            placeholder="Buscar atleta..."
            className="bg-transparent border-none focus:ring-0 text-sm p-0 w-48 text-white placeholder:text-white/30"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-primary-blue hover:bg-white/5 rounded-full transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-primary-blue hover:bg-white/5 rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-accent/30">
            <img
              src="https://picsum.photos/seed/coach/100/100"
              alt="Coach Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
