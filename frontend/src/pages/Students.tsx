import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Student, StudentStatus } from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  HeartPulse,
  AlertTriangle,
  UserCheck,
  UserX,
  CreditCard,
  Calendar,
  MoreVertical
} from 'lucide-react';

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalityFilter, setModalityFilter] = useState('all');

  // Modal de Novo Aluno
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birth_date: '',
    plan: 'Plano Acqua Total (Natação + Musculação)',
    modalities: ['Natação Adulto'],
    monthly_fee: 269.90,
    due_day: 10,
    emergency_contact: '',
    medical_notes: 'Atestado médico anexado.',
    status: 'active' as StudentStatus
  });

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await api.getStudents({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        modality: modalityFilter !== 'all' ? modalityFilter : undefined
      });
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [search, statusFilter, modalityFilter]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createStudent(formData);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        birth_date: '',
        plan: 'Plano Acqua Total (Natação + Musculação)',
        modalities: ['Natação Adulto'],
        monthly_fee: 269.90,
        due_day: 10,
        emergency_contact: '',
        medical_notes: 'Atestado médico anexado.',
        status: 'active'
      });
      loadStudents();
    } catch (err: any) {
      alert(err.message || 'Erro ao cadastrar aluno');
    }
  };

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'overdue':
        return <Badge variant="warning">Inadimplente</Badge>;
      case 'suspended':
        return <Badge variant="danger">Trancado</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Topo com Ações e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Gestão de Alunos & Matrículas</h2>
          <p className="text-xs text-slate-500 mt-0.5">Cadastros, status financeiro e ficha médica dos alunos</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-acqua-600 hover:bg-acqua-700 text-white font-bold text-xs shadow-sm shadow-acqua-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Matricular Novo Aluno
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-acqua-500/20 focus:border-acqua-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-acqua-500"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="overdue">Inadimplentes</option>
            <option value="suspended">Trancados</option>
          </select>

          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-acqua-500"
          >
            <option value="all">Todas as Modalidades</option>
            <option value="Natação Adulto">Natação Adulto</option>
            <option value="Natação Infantil">Natação Infantil</option>
            <option value="Hidroginástica">Hidroginástica</option>
            <option value="Musculação">Musculação</option>
            <option value="Pilates">Pilates</option>
            <option value="Spinning">Spinning</option>
          </select>
        </div>
      </div>

      {/* Tabela de Alunos */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Aluno</th>
                <th className="py-3.5 px-6">CPF & Contato</th>
                <th className="py-3.5 px-6">Plano & Modalidades</th>
                <th className="py-3.5 px-6">Mensalidade</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Ficha Médica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-acqua-100/80 text-acqua-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {student.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" /> {student.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-800">{student.cpf}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {student.phone}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900">{student.plan}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.modalities.map((m) => (
                        <span key={m} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">
                      R$ {student.monthly_fee.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Vence dia {student.due_day}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    {getStatusBadge(student.status)}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-acqua-600 font-semibold text-[11px] transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}

              {students.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-xs">
                    Nenhum aluno encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes do Aluno */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title={`Ficha de Matrícula - ${selectedStudent.name}`}
          subtitle={`Cadastrado desde ${selectedStudent.enrolled_at || 'Início do ano'}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-slate-400 block mb-0.5">CPF</span>
                <span className="font-bold text-slate-800">{selectedStudent.cpf}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Telefone</span>
                <span className="font-bold text-slate-800">{selectedStudent.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Plano Contratado</span>
                <span className="font-bold text-slate-800">{selectedStudent.plan}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Mensalidade</span>
                <span className="font-bold text-emerald-600">R$ {selectedStudent.monthly_fee.toFixed(2)} / mês</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-acqua-50/60 border border-acqua-100">
              <div className="flex items-center gap-1.5 font-bold text-acqua-900 mb-1">
                <HeartPulse className="w-4 h-4 text-acqua-600" />
                Ficha Médica & Restrições Aquáticas
              </div>
              <p className="text-slate-600 leading-relaxed">
                {selectedStudent.medical_notes || 'Nenhuma restrição médica cadastrada.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Contato de Emergência</span>
              <span className="font-semibold text-slate-800">{selectedStudent.emergency_contact || 'Não informado'}</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Matricular Novo Aluno */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Matricular Novo Aluno - Acqua Planet"
        subtitle="Preencha os dados cadastrais, plano e modalidades"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
                placeholder="ex: Lucas Andrade"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">CPF *</label>
              <input
                type="text"
                required
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">E-mail *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
                placeholder="aluno@email.com"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Plano</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              >
                <option value="Plano Acqua Total (Natação + Musculação)">Plano Acqua Total</option>
                <option value="Plano Natação Master">Plano Natação Master</option>
                <option value="Plano Peixinhos (Natação Infantil)">Plano Natação Infantil</option>
                <option value="Plano Hidro Vitalidade">Plano Hidro Vitalidade</option>
                <option value="Plano Iron Cardio & Força">Plano Iron Cardio & Força</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Valor Mensal (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.monthly_fee}
                onChange={(e) => setFormData({ ...formData, monthly_fee: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Dia de Vencimento</label>
              <select
                value={formData.due_day}
                onChange={(e) => setFormData({ ...formData, due_day: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              >
                <option value={5}>Dia 05</option>
                <option value={10}>Dia 10</option>
                <option value={15}>Dia 15</option>
                <option value={20}>Dia 20</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Contato de Emergência</label>
            <input
              type="text"
              value={formData.emergency_contact}
              onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              placeholder="Nome do parente e telefone"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Observações Médicas / Restrições</label>
            <textarea
              rows={2}
              value={formData.medical_notes}
              onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              placeholder="Atestados, histórico cirúrgico, cuidados na piscina..."
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-acqua-600 hover:bg-acqua-700 text-white font-bold shadow-sm shadow-acqua-600/20"
            >
              Concluir Matrícula
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
