import React from 'react';
import { LayoutGrid, Users, Dumbbell, BarChart3, HelpCircle, LogOut, Plus, Settings2, ClipboardList } from 'lucide-react';
import { Screen } from '../types';

interface SidebarProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onScreenChange, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'alumnos', label: 'Alumnos', icon: Users },
    { id: 'ejercicios', label: 'Ejercicios', icon: Settings2 },
    { id: 'evaluaciones', label: 'Evaluaciones', icon: Dumbbell },
    { id: 'templates', label: 'Templates', icon: ClipboardList },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  ] as const;

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-card shadow-[40px_0_60px_-15px_rgba(0,0,0,0.3)] z-40 border-r border-white/5">
      <div className="px-6 py-8">
        <div className="font-headline font-black text-accent uppercase tracking-widest text-lg mb-1">Performance Lab</div>
        <div className="font-sans font-medium text-sm text-white/50">Elite Telemetry</div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id)}
            className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 font-sans font-medium text-sm rounded-lg ${
              activeScreen === item.id
                ? 'bg-surface-container text-accent border-l-4 border-accent'
                : 'text-white/50 hover:bg-surface-container hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-6 py-6 border-t border-white/5">
        <button 
          onClick={() => onScreenChange('evaluaciones')}
          className="w-full bg-primary-blue text-surface-dark py-3 rounded-md font-bold text-sm tracking-wide transition-all hover:shadow-[0_0_12px_rgba(185,199,228,0.3)] active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Nueva Evaluación
        </button>
      </div>

      <div className="p-4 space-y-2 mb-4">
        <button className="w-full text-white/50 hover:bg-surface-container hover:text-white px-4 py-3 flex items-center gap-3 transition-all duration-200 font-sans font-medium text-sm rounded-lg">
          <HelpCircle size={18} />
          Soporte
        </button>
        <button 
          onClick={onLogout}
          className="w-full text-white/50 hover:bg-surface-container hover:text-white px-4 py-3 flex items-center gap-3 transition-all duration-200 font-sans font-medium text-sm rounded-lg"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
