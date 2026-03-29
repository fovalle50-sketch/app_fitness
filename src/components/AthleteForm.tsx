import React, { useState } from 'react';
import { UserPlus, Camera, X, Check } from 'lucide-react';
import { Athlete } from '../types';

interface AthleteFormProps {
  athlete?: Athlete;
  onAdd: (athlete: Athlete) => void;
  onCancel: () => void;
}

export const AthleteForm: React.FC<AthleteFormProps> = ({ athlete, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: athlete?.name || '',
    birthDate: athlete?.birthDate || '',
    gender: (athlete?.gender || 'Masculino') as 'Masculino' | 'Femenino',
    weight: athlete?.weight?.toString() || '',
    level: athlete?.level || 1,
    status: (athlete?.status || 'Alto Rendimiento') as 'Pro Elite' | 'Alto Rendimiento' | 'Fatiga Detectada',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate || !formData.weight) return;

    const athleteData: Athlete = {
      id: athlete?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      birthDate: formData.birthDate,
      gender: formData.gender,
      weight: parseFloat(formData.weight),
      activityLevel: athlete?.activityLevel || 0,
      level: formData.level as 1 | 2 | 3 | 4 | 5,
      status: formData.status,
      imageUrl: athlete?.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(formData.name)}/200/200`,
    };

    onAdd(athleteData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-surface-card rounded-xl overflow-hidden border border-white/5 shadow-2xl">
      <div className="bg-surface-container p-6 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 text-accent flex items-center justify-center rounded-lg">
            <UserPlus size={20} />
          </div>
          <h2 className="font-headline font-black text-xl uppercase tracking-tight">Nuevo Alumno</h2>
        </div>
        <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-surface-dark border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 group-hover:border-accent/50 group-hover:text-accent/50 transition-all cursor-pointer overflow-hidden">
              <Camera size={32} className="mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Subir Foto</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-full">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Nombre Completo</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-surface-dark border-none text-white p-4 rounded-lg focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Fecha de Nacimiento</label>
            <input 
              type="date" 
              required
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full bg-surface-dark border-none text-white p-4 rounded-lg focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Sexo</label>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full bg-surface-dark border-none text-white p-4 rounded-lg appearance-none focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Peso (kg)</label>
            <input 
              type="number" 
              step="0.1"
              required
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full bg-surface-dark border-none text-white p-4 rounded-lg focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
              placeholder="75.0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Nivel del Alumno</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFormData({ ...formData, level: lvl as any })}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    formData.level === lvl 
                      ? 'bg-accent text-surface-dark shadow-[0_0_15px_rgba(42,229,0,0.3)]' 
                      : 'bg-surface-dark text-white/40 hover:bg-white/5'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Estado Inicial</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full bg-surface-dark border-none text-white p-4 rounded-lg appearance-none focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
            >
              <option value="Pro Elite">Pro Elite</option>
              <option value="Alto Rendimiento">Alto Rendimiento</option>
              <option value="Fatiga Detectada">Fatiga Detectada</option>
            </select>
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-lg font-bold uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-1 bg-accent text-surface-dark py-4 rounded-lg font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(42,229,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Check size={20} />
            Confirmar Registro
          </button>
        </div>
      </form>
    </div>
  );
};
