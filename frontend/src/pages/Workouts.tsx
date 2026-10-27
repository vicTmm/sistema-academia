import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Workout, Student, ExerciseItem } from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  Activity,
  Plus,
  Trash2,
  User,
  Waves,
  Dumbbell,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';

export const Workouts: React.FC = () => {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal nova ficha
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [title, setTitle] = useState('');
  const [modality, setModality] = useState('Natação Adulto');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<ExerciseItem[]>([
    { series: '4x 50m', item: 'Aquecimento Crawl leve', pace: 'Solto' },
    { series: '6x 100m', item: 'Série Principal com palmar', pace: 'Forte' }
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [wks, stds] = await Promise.all([api.getWorkouts(), api.getStudents()]);
      setWorkouts(wks);
      setStudents(stds);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addExerciseRow = () => {
    setExercises([...exercises, { series: '3x 12', item: '', pace: 'Moderado' }]);
  };

  const removeExerciseRow = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof ExerciseItem, value: string) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleCreateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !title) return;

    try {
      await api.createWorkout({
        student_id: selectedStudentId,
        instructor_id: currentUser.id,
        title,
        modality,
        notes,
        exercises
      });
      setIsModalOpen(false);
      setTitle('');
      setNotes('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao criar ficha');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Fichas de Treino & Natação</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescrição pedagógica de natação, musculação, ciclismo e pilates
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-acqua-600 hover:bg-acqua-700 text-white font-bold text-xs shadow-sm shadow-acqua-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Prescrever Nova Ficha
        </button>
      </div>

      {/* Grid de Fichas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workouts.map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge variant="aqua" className="text-[10px]">
                  {w.modality}
                </Badge>
                <span className="text-[11px] text-slate-400 font-medium">Criado em {w.created_at}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{w.title}</h3>
              <div className="text-xs text-slate-500 mb-4 flex items-center gap-3">
                <span>
                  Aluno: <strong>{w.student_name}</strong>
                </span>
                <span>•</span>
                <span>
                  Prof: <strong>{w.instructor_name}</strong>
                </span>
              </div>

              {w.notes && (
                <div className="p-3 rounded-xl bg-slate-50 text-slate-600 text-xs italic mb-4 border border-slate-100">
                  "{w.notes}"
                </div>
              )}

              {/* Tabela de Séries */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Sequência do Treino
                </div>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/40">
                  {w.exercises.map((ex, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-acqua-700 bg-acqua-100/70 px-2 py-0.5 rounded text-[11px]">
                          {ex.series}
                        </span>
                        <span className="font-medium text-slate-800">{ex.item}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">{ex.pace}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Ficha */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Prescrever Ficha de Treino / Natação"
        subtitle={`Prescrito por ${currentUser.name} (${currentUser.specialty})`}
        maxWidth="xl"
      >
        <form onSubmit={handleCreateWorkout} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Selecione o Aluno</label>
              <select
                required
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              >
                <option value="">-- Escolha o aluno --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - CPF: {s.cpf}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Modalidade</label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              >
                <option value="Natação Adulto">Natação Adulto</option>
                <option value="Natação Infantil">Natação Infantil</option>
                <option value="Hidroginástica">Hidroginástica</option>
                <option value="Musculação">Musculação</option>
                <option value="Spinning">Spinning</option>
                <option value="Pilates">Pilates</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Título do Treino</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              placeholder="ex: Treino Natação Resistência - Foco Pernada & Rotação"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Recomendações e Instruções</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              placeholder="Intervalos de recuperação, cuidado com postura, aquecimento..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-slate-600 font-semibold">Exercícios / Séries</label>
              <button
                type="button"
                onClick={addExerciseRow}
                className="text-[11px] font-bold text-acqua-600 hover:text-acqua-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Exercício
              </button>
            </div>

            <div className="space-y-2">
              {exercises.map((ex, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="ex: 4x 50m"
                    value={ex.series}
                    onChange={(e) => updateExercise(idx, 'series', e.target.value)}
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-acqua-500"
                  />
                  <input
                    type="text"
                    placeholder="Descrição (ex: Crawl com palmar)"
                    value={ex.item}
                    onChange={(e) => updateExercise(idx, 'item', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-acqua-500"
                  />
                  <input
                    type="text"
                    placeholder="Ritmo / Carga"
                    value={ex.pace}
                    onChange={(e) => updateExercise(idx, 'pace', e.target.value)}
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-acqua-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeExerciseRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-acqua-600 hover:bg-acqua-700 text-white font-bold"
            >
              Salvar Ficha
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
