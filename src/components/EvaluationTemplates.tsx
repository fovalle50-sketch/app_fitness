import React, { useState } from 'react';
import { Plus, Trash2, ClipboardList, Search, CheckCircle2, X, Edit2, Dumbbell } from 'lucide-react';
import { EvaluationTemplate, Exercise } from '../types';

interface EvaluationTemplatesProps {
  templates: EvaluationTemplate[];
  exercises: Exercise[];
  onAdd: (template: EvaluationTemplate) => void;
  onUpdate: (template: EvaluationTemplate) => void;
  onDelete: (id: string) => void;
}

export const EvaluationTemplates: React.FC<EvaluationTemplatesProps> = ({ templates, exercises, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EvaluationTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<EvaluationTemplate['exercises']>([]);
  
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (template: EvaluationTemplate) => {
    setEditingTemplate(template);
    setName(template.name);
    setDescription(template.description || '');
    setSelectedExercises(template.exercises);
    setIsAdding(true);
  };

  const handleCloseModal = () => {
    setIsAdding(false);
    setEditingTemplate(null);
    setName('');
    setDescription('');
    setSelectedExercises([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedExercises.length === 0) return;

    const templateData: EvaluationTemplate = {
      id: editingTemplate?.id || Math.random().toString(36).substr(2, 9),
      name,
      description,
      exercises: selectedExercises,
    };

    if (editingTemplate) {
      onUpdate(templateData);
    } else {
      onAdd(templateData);
    }

    handleCloseModal();
  };

  const toggleExercise = (ex: Exercise) => {
    const exists = selectedExercises.find(se => se.exerciseId === ex.id);
    if (exists) {
      setSelectedExercises(selectedExercises.filter(se => se.exerciseId !== ex.id));
    } else {
      setSelectedExercises([...selectedExercises, {
        exerciseId: ex.id,
        exerciseName: ex.name,
        targetReps: 10,
      }]);
    }
  };

  const updateExerciseTarget = (exerciseId: string, field: string, value: any) => {
    setSelectedExercises(selectedExercises.map(se => 
      se.exerciseId === exerciseId ? { ...se, [field]: value } : se
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <ClipboardList size={12} /> Plantillas de Evaluación
          </div>
          <h1 className="font-headline text-5xl font-black tracking-tighter uppercase italic leading-none">Templates de <span className="text-accent">Evaluación</span></h1>
          <p className="text-white/40 mt-2 max-w-md">Crea protocolos de evaluación predefinidos para estandarizar tus pruebas.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-accent text-surface-dark px-6 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(42,229,0,0.2)] hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} /> Nuevo Template
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input 
          type="text" 
          placeholder="Buscar template..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-surface-card border border-white/5 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-accent/50 transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div 
            key={template.id}
            className="bg-surface-card p-6 rounded-2xl border border-white/5 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button 
                onClick={() => handleEdit(template)}
                className="text-white/20 hover:text-accent p-2 transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => setTemplateToDelete(template.id)}
                className="text-white/20 hover:text-red-400 p-2 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg leading-tight">{template.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent/60">{template.exercises.length} Ejercicios</p>
                </div>
              </div>
              <p className="text-sm text-white/40 line-clamp-2 italic leading-relaxed">
                {template.description || 'Sin descripción disponible.'}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {template.exercises.slice(0, 3).map(ex => (
                  <span key={ex.exerciseId} className="text-[8px] bg-white/5 text-white/40 px-2 py-0.5 rounded uppercase font-bold">
                    {ex.exerciseName}
                  </span>
                ))}
                {template.exercises.length > 3 && (
                  <span className="text-[8px] bg-white/5 text-white/40 px-2 py-0.5 rounded uppercase font-bold">
                    +{template.exercises.length - 3}
                  </span>
                )}
              </div>
            </div>

            {templateToDelete === template.id && (
              <div className="absolute inset-0 bg-surface-dark/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center">
                <p className="text-xs font-bold mb-3 uppercase tracking-widest">¿Eliminar template?</p>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => setTemplateToDelete(null)}
                    className="flex-1 bg-white/5 py-2 rounded font-bold text-[10px] uppercase tracking-widest"
                  >
                    No
                  </button>
                  <button 
                    onClick={() => onDelete(template.id)}
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

      {/* Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            onClick={handleCloseModal}
            className="absolute inset-0 bg-surface-dark/80 backdrop-blur-md"
          />
          <div 
            className="relative w-full max-w-4xl bg-surface-card rounded-3xl border border-white/10 shadow-2xl p-8 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
            
            <div className="flex items-center justify-between mb-8 shrink-0">
              <h2 className="font-headline text-2xl font-black uppercase italic tracking-tight">
                {editingTemplate ? 'Editar Template' : 'Nuevo Template'}
              </h2>
              <button onClick={handleCloseModal} className="text-white/20 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Nombre del Template</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Evaluación de Fuerza Tren Superior"
                      className="w-full bg-surface-dark border-none text-white p-4 rounded-xl focus:ring-2 focus:ring-accent/50 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Descripción</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Objetivo de este protocolo..."
                      rows={3}
                      className="w-full bg-surface-dark border-none text-white p-4 rounded-xl focus:ring-2 focus:ring-accent/50 transition-all text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Seleccionar Ejercicios</label>
                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
                      {exercises.map(ex => {
                        const isSelected = selectedExercises.find(se => se.exerciseId === ex.id);
                        return (
                          <div 
                            key={ex.id}
                            onClick={() => toggleExercise(ex)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected ? 'bg-accent/10 border-accent/30' : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Dumbbell size={14} className={isSelected ? 'text-accent' : 'text-white/20'} />
                              <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-white/40'}`}>{ex.name}</span>
                            </div>
                            {isSelected && <CheckCircle2 size={16} className="text-accent" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Configuración de Objetivos</label>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {selectedExercises.length === 0 ? (
                      <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Selecciona ejercicios a la izquierda</p>
                      </div>
                    ) : (
                      selectedExercises.map((se) => {
                        const ex = exercises.find(e => e.id === se.exerciseId);
                        return (
                          <div key={se.exerciseId} className="bg-surface-dark p-4 rounded-xl border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-accent">{se.exerciseName}</span>
                              <button 
                                type="button"
                                onClick={() => setSelectedExercises(selectedExercises.filter(item => item.exerciseId !== se.exerciseId))}
                                className="text-white/20 hover:text-red-400"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[8px] font-bold uppercase tracking-widest text-white/20">Reps Objetivo</label>
                                <input 
                                  type="number"
                                  value={se.targetReps || ''}
                                  onChange={(e) => updateExerciseTarget(se.exerciseId, 'targetReps', parseInt(e.target.value))}
                                  className="w-full bg-white/5 border-none text-white p-2 rounded text-xs"
                                />
                              </div>
                              {ex?.requiresLoad && (
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold uppercase tracking-widest text-white/20">Carga (kg)</label>
                                  <input 
                                    type="number"
                                    value={se.targetLoad || ''}
                                    onChange={(e) => updateExerciseTarget(se.exerciseId, 'targetLoad', parseFloat(e.target.value))}
                                    className="w-full bg-white/5 border-none text-white p-2 rounded text-xs"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4 shrink-0">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-white/5 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={selectedExercises.length === 0}
                  className="flex-1 bg-accent text-surface-dark py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(42,229,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                >
                  <CheckCircle2 size={20} /> {editingTemplate ? 'Actualizar' : 'Guardar Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
