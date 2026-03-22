import React from 'react';
import { motion } from 'motion/react';
import { UserPlus, Search, Filter } from 'lucide-react';
import { Athlete } from '../types';
import { AthleteCard } from './AthleteCard';

interface AthleteListProps {
  athletes: Athlete[];
  onAddNew: () => void;
}

export const AthleteList: React.FC<AthleteListProps> = ({ athletes, onAddNew }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black font-headline tracking-tighter mb-2 text-white">Gestión de Alumnos</h2>
          <p className="text-white/40 max-w-md">Administra el roster completo de atletas y monitorea su evolución individual.</p>
        </div>
        <div className="flex gap-4">
          <div className="hidden sm:flex items-center bg-surface-card rounded-lg px-4 py-2 text-white/60 border border-white/5">
            <Search size={16} className="mr-2" />
            <input
              type="text"
              placeholder="Filtrar por nombre..."
              className="bg-transparent border-none focus:ring-0 text-sm p-0 w-48 text-white placeholder:text-white/30"
            />
          </div>
          <button 
            onClick={onAddNew}
            className="bg-accent text-surface-dark px-6 py-3 rounded-lg font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(42,229,0,0.3)] hover:scale-105 transition-all"
          >
            <UserPlus size={18} />
            Nuevo Alumno
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {athletes.map(athlete => (
          <AthleteCard key={athlete.id} athlete={athlete} />
        ))}
        
        {/* Empty State / Add New Placeholder */}
        <button 
          onClick={onAddNew}
          className="group bg-surface-card/30 p-6 rounded-none border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-accent/30 hover:bg-accent/5 transition-all min-h-[300px]"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-accent/10 group-hover:text-accent transition-all">
            <UserPlus size={32} />
          </div>
          <div className="text-center">
            <p className="font-headline font-bold text-lg uppercase tracking-tight text-white/20 group-hover:text-white transition-all">Agregar Atleta</p>
            <p className="text-xs text-white/10 group-hover:text-white/30 transition-all">Incorpora un nuevo perfil al roster</p>
          </div>
        </button>
      </div>
    </motion.div>
  );
};
