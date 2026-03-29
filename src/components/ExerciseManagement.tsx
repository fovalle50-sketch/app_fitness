import React, { useState } from 'react';
import { Plus, Trash2, Dumbbell, Search, AlertCircle, CheckCircle2, X, Edit2 } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseManagementProps {
  exercises: Exercise[];
  onAdd: (exercise: Exercise) => void;
  onUpdate: (exercise: Exercise) => void;
  onDelete: (id: string) => void;
}

export const ExerciseManagement: React.FC<ExerciseManagementProps> = ({ exercises, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<Exercise['category']>('Empuje');
  const [newRequiresLoad, setNewRequiresLoad] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);

  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (editingExercise) {
      onUpdate({
        ...editingExercise,
        name: newName,
        description: newDescription,
        category: newCategory,
        requiresLoad: newRequiresLoad,
      });
    } else {
      const newExercise: Exercise = {
        id: Math.random().toString(36).substr(2, 9),
        name: newName,
        description: newDescription,
        category: newCategory,
        requiresLoad: newRequiresLoad,
      };
      onAdd(newExercise);
    }

    setNewName('');
    setNewDescription('');
    setNewCategory('Empuje');
    setNewRequiresLoad(false);
    setIsAdding(false);
    setEditingExercise(null);
  };

  const handleEdit = (ex: Exercise) => {
    setEditingExercise(ex);
    setNewName(ex.name);
    setNewDescription(ex.description || '');
    setNewCategory(ex.category);
    setNewRequiresLoad(ex.requiresLoad);
    setIsAdding(true);
  };

  const handleCloseModal = () => {
    setIsAdding(false);
    setEditingExercise(null);
    setNewName('');
    setNewDescription('');
    setNewCategory('Empuje');
    setNewRequiresLoad(false);
  };

  const confirmDelete = (id: string) => {
    onDelete(id);
    setExerciseToDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Dumbbell size={12} /> Gestión de Biblioteca
          </div>
          <h1 className="font-headline text-5xl font-black tracking-tighter uppercase italic leading-none">Mantenedor de <span className="text-accent">Ejercicios</span></h1>
          <p className="text-white/40 mt-2 max-w-md">Define y gestiona el catálogo de pruebas cinéticas disponibles para las evaluaciones.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-accent text-surface-dark px-6 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(42,229,0,0.2)] hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} /> Nuevo Ejercicio
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input 
          type="text" 
          placeholder="Buscar ejercicio o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-surface-card border border-white/5 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-accent/50 transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((ex) => (
          <div 
            key={ex.id}
            className="bg-surface-card p-6 rounded-2xl border border-white/5 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button 
                onClick={() => handleEdit(ex)}
                className="text-white/20 hover:text-accent p-2 transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => setExerciseToDelete(ex.id)}
                className="text-white/20 hover:text-red-400 p-2 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">{ex.category}</span>
                    {ex.requiresLoad && (
                      <span className="text-[8px] font-black uppercase tracking-widest bg-white/10 text-white/60 px-1.5 py-0.5 rounded">Carga Requerida</span>
                    )}
                  </div>
                  <h3 className="font-headline font-bold text-lg leading-tight">{ex.name}</h3>
                </div>
              </div>
              <p className="text-sm text-white/40 line-clamp-2 italic leading-relaxed">
                {ex.description || 'Sin descripción técnica disponible.'}
              </p>
            </div>

            {exerciseToDelete === ex.id && (
              <div className="absolute inset-0 bg-surface-dark/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center">
                <p className="text-xs font-bold mb-3 uppercase tracking-widest">¿Eliminar ejercicio?</p>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => setExerciseToDelete(null)}
                    className="flex-1 bg-white/5 py-2 rounded font-bold text-[10px] uppercase tracking-widest"
                  >
                    No
                  </button>
                  <button 
                    onClick={() => confirmDelete(ex.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded font-bold text-[10px] uppercase tracking-widest"
                  >
                    Sí
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            onClick={handleCloseModal}
            className="absolute inset-0 bg-surface-dark/80 backdrop-blur-md"
          />
          <div 
            className="relative w-full max-w-lg bg-surface-card rounded-3xl border border-white/10 shadow-2xl p-8 overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-2xl font-black uppercase italic tracking-tight">
                {editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
              </h2>
              <button onClick={handleCloseModal} className="text-white/20 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Nombre del Ejercicio</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Dominadas Pronas"
                  className="w-full bg-surface-dark border-none text-white p-4 rounded-xl focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Categoría</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Exercise['category'])}
                  className="w-full bg-surface-dark border-none text-white p-4 rounded-xl appearance-none focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
                >
                  <option value="Tracción">Tracción</option>
                  <option value="Empuje">Empuje</option>
                  <option value="Pierna">Pierna</option>
                  <option value="Core">Core</option>
                  <option value="Cardio">Cardio</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Descripción Técnica (Opcional)</label>
                <textarea 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalles sobre la ejecución..."
                  rows={3}
                  className="w-full bg-surface-dark border-none text-white p-4 rounded-xl focus:ring-2 focus:ring-accent/50 transition-all text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-surface-dark rounded-xl border border-white/5 cursor-pointer" onClick={() => setNewRequiresLoad(!newRequiresLoad)}>
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${newRequiresLoad ? 'bg-accent border-accent' : 'border-white/20'}`}>
                  {newRequiresLoad && <CheckCircle2 size={16} className="text-surface-dark" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Requiere Carga Externa</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Ej: Pesas, Mancuernas, Poleas</p>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-white/5 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-accent text-surface-dark py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(42,229,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <CheckCircle2 size={20} /> {editingExercise ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
