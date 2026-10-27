import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GymClass, Student } from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Waves,
  UserCheck,
  Plus,
  Dumbbell,
  Sparkles
} from 'lucide-react';

export const Schedule: React.FC = () => {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalityFilter, setModalityFilter] = useState('all');

  // Modal para matricular aluno na turma
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const [studentToEnroll, setStudentToEnroll] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [cls, stds] = await Promise.all([
        api.getClasses(modalityFilter !== 'all' ? modalityFilter : undefined),
        api.getStudents()
      ]);
      setClasses(cls);
      setStudents(stds);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [modalityFilter]);

  const handleEnroll = async () => {
    if (!selectedClass || !studentToEnroll) return;
    try {
      await api.enrollInClass(selectedClass.id, studentToEnroll);
      alert('Aluno matriculado na turma com sucesso!');
      setSelectedClass(null);
      setStudentToEnroll('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao matricular');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Grade de Turmas & Raias</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Horários, ocupação das piscinas e professores responsáveis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-acqua-500"
          >
            <option value="all">Todas as Áreas / Modalidades</option>
            <option value="Natação">Natação (Adulto / Infantil)</option>
            <option value="Hidroginástica">Hidroginástica Térmica</option>
            <option value="Spinning">Spinning</option>
            <option value="Pilates">Pilates</option>
            <option value="Musculação">Musculação & Funcional</option>
          </select>
        </div>
      </div>

      {/* Grid de Turmas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((c) => {
          const occupancy = Math.round((c.enrolled_count / c.max_capacity) * 100);
          const isFull = c.enrolled_count >= c.max_capacity;

          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="aqua" className="text-[10px]">
                    {c.modality}
                  </Badge>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isFull
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isFull ? 'Lotada' : `${c.max_capacity - c.enrolled_count} vagas restantes`}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-3">{c.title}</h3>

                <div className="space-y-2 text-xs text-slate-500 mb-5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {c.start_time} - {c.end_time} ({c.days_of_week})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700">{c.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Instrutor: <strong>{c.instructor_name}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {/* Barra de Ocupação */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 text-slate-600 font-medium">
                    <span>Ocupação da Turma</span>
                    <span className="font-bold text-acqua-600">
                      {c.enrolled_count}/{c.max_capacity} ({occupancy}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancy > 85 ? 'bg-amber-500' : 'bg-acqua-600'
                      }`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClass(c)}
                  className="w-full py-2 rounded-xl bg-slate-50 hover:bg-acqua-50 text-slate-700 hover:text-acqua-700 font-bold text-xs border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Matricular Aluno nesta Turma
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Matrícula na Turma */}
      {selectedClass && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedClass(null)}
          title={`Adicionar Aluno - ${selectedClass.title}`}
          subtitle={`${selectedClass.days_of_week} às ${selectedClass.start_time} | ${selectedClass.location}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Selecione o Aluno</label>
              <select
                value={studentToEnroll}
                onChange={(e) => setStudentToEnroll(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              >
                <option value="">-- Escolha um aluno ativo --</option>
                {students
                  .filter((s) => s.status === 'active')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - CPF: {s.cpf} ({s.plan})
                    </option>
                  ))}
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
              Vagas disponíveis: <strong>{selectedClass.max_capacity - selectedClass.enrolled_count}</strong>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEnroll}
                disabled={!studentToEnroll}
                className="px-5 py-2 rounded-xl bg-acqua-600 hover:bg-acqua-700 disabled:opacity-50 text-white font-bold"
              >
                Confirmar Inscrição
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
