import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FinancialTransaction, FinancialSummary } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  Plus,
  Lock,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Calendar,
  Filter,
  Receipt
} from 'lucide-react';

export const Financial: React.FC = () => {
  const { currentUser, isAdmin, switchUserById, profiles } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal nova transação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    type: 'income' as 'income' | 'expense',
    category: 'Mensalidade',
    amount: 199.90,
    status: 'paid' as 'paid' | 'pending' | 'overdue',
    due_date: new Date().toISOString().split('T')[0]
  });

  const loadFinancial = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [sum, txs] = await Promise.all([
        api.getFinancialSummary(currentUser.role),
        api.getFinancialTransactions(currentUser.role, typeFilter !== 'all' ? typeFilter : undefined)
      ]);
      setSummary(sum);
      setTransactions(txs);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancial();
  }, [currentUser, typeFilter]);

  // Se o usuário não for um dos 2 administradores:
  if (!isAdmin) {
    const adminProfiles = profiles.filter((p) => p.role === 'admin');
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Acesso Restrito ao Módulo Financeiro
        </h3>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
          Você está visualizando o sistema como <strong>{currentUser.name}</strong> ({currentUser.specialty}).
          As informações de receitas, despesas e fluxo de caixa da Acqua Planet são restritas aos 2 Administradores.
        </p>

        <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200/70 text-left">
          <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-acqua-600" />
            Alternar para um dos 2 Administradores para testar o financeiro:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {adminProfiles.map((adm) => (
              <button
                key={adm.id}
                onClick={() => switchUserById(adm.id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-acqua-500 hover:shadow-md transition-all text-left"
              >
                <img src={adm.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{adm.name}</div>
                  <div className="text-[10px] text-slate-400">{adm.specialty}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTransaction(formData, currentUser.role);
      setIsModalOpen(false);
      setFormData({
        description: '',
        type: 'income',
        category: 'Mensalidade',
        amount: 199.90,
        status: 'paid',
        due_date: new Date().toISOString().split('T')[0]
      });
      loadFinancial();
    } catch (err: any) {
      alert(err.message || 'Erro ao lançar transação');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-acqua-100 text-acqua-800 text-[11px] font-bold mb-1">
            <Receipt className="w-3.5 h-3.5" />
            Acesso Restrito aos Administradores
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Gestão Financeira & Fluxo de Caixa</h2>
          <p className="text-xs text-slate-500 mt-0.5">Mensalidades, custos de manutenção das piscinas e balanço</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-vital-600 hover:bg-vital-700 text-white font-bold text-xs shadow-sm shadow-vital-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Novo Lançamento
        </button>
      </div>

      {/* Grid de KPIs Financeiros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Recebido (Mês)"
          value={summary ? `R$ ${summary.total_received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
          subtitle="Mensalidades & Produtos"
          icon={ArrowUpRight}
          colorScheme="green"
        />

        <StatCard
          title="Despesas Operacionais"
          value={summary ? `R$ ${summary.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
          subtitle="Piscinas, Energia & Folha"
          icon={ArrowDownRight}
          colorScheme="amber"
        />

        <StatCard
          title="Saldo Líquido"
          value={summary ? `R$ ${summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
          subtitle={summary && summary.balance >= 0 ? 'Superávit no período' : 'Déficit no período'}
          icon={DollarSign}
          trend={summary && summary.balance >= 0 ? '+ Lucrativo' : '- Atenção'}
          trendPositive={summary ? summary.balance >= 0 : true}
          colorScheme="blue"
        />

        <StatCard
          title="Inadimplência em Aberto"
          value={summary ? `R$ ${summary.total_overdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
          subtitle="Mensalidades vencidas"
          icon={AlertOctagon}
          colorScheme="teal"
        />
      </div>

      {/* Resumo de Custos de Academia Aquática & Filtro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Despesas da Academia Aquática */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Composição das Despesas</h3>
          <p className="text-xs text-slate-400 mb-4">Manutenção de piscinas, aquecedores e folha</p>

          <div className="space-y-3">
            {summary?.expense_breakdown.map((item) => {
              const percent = Math.round((item.amount / (summary.total_expenses || 1)) * 100);
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.category}</span>
                    <span className="text-slate-500 font-bold">
                      R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-acqua-600 h-full rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabela de Lançamentos Recentes */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Extrato de Lançamentos</h3>
                <p className="text-xs text-slate-400">Entradas e saídas registradas no sistema</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:border-acqua-500"
                >
                  <option value="all">Todas as Transações</option>
                  <option value="income">Apenas Receitas (+)</option>
                  <option value="expense">Apenas Despesas (-)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] pb-2">
                    <th className="pb-2">Descrição</th>
                    <th className="pb-2">Categoria</th>
                    <th className="pb-2">Vencimento</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {tx.type === 'income' ? '+' : '-'}
                          </span>
                          <span className="truncate max-w-[200px]">{tx.description}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-500">{tx.category}</td>
                      <td className="py-3 text-slate-500">{tx.due_date}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            tx.status === 'paid' ? 'success' : tx.status === 'overdue' ? 'danger' : 'warning'
                          }
                          className="text-[10px]"
                        >
                          {tx.status === 'paid' ? 'Liquidado' : tx.status === 'overdue' ? 'Vencido' : 'Pendente'}
                        </Badge>
                      </td>
                      <td
                        className={`py-3 text-right font-bold ${
                          tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Novo Lançamento */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Lançamento Financeiro"
        subtitle="Registre uma receita (mensalidade, produtos) ou despesa operacional"
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Tipo de Lançamento</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category: 'Mensalidade' })}
                className={`py-2 rounded-xl font-bold border transition-all ${
                  formData.type === 'income'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                + Receita (Entrada)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category: 'Manutenção das Piscinas' })}
                className={`py-2 rounded-xl font-bold border transition-all ${
                  formData.type === 'expense'
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                - Despesa (Saída)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Descrição</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              placeholder={formData.type === 'income' ? 'ex: Mensalidade Aluno' : 'ex: Cloro granulado para piscina'}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              >
                {formData.type === 'income' ? (
                  <>
                    <option value="Mensalidade">Mensalidade</option>
                    <option value="Matrícula">Taxa de Matrícula</option>
                    <option value="Venda de Produtos">Venda de Toucas/Óculos</option>
                    <option value="Avaliação Física">Avaliação Física</option>
                  </>
                ) : (
                  <>
                    <option value="Manutenção das Piscinas">Manutenção das Piscinas (Tratamento)</option>
                    <option value="Equipamentos">Equipamentos e Acessórios</option>
                    <option value="Contas de Consumo">Contas (Energia/Água)</option>
                    <option value="Folha de Pagamento">Folha de Professores</option>
                    <option value="Marketing">Marketing & Divulgação</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              >
                <option value="paid">Pago / Liquidado</option>
                <option value="pending">Pendente</option>
                <option value="overdue">Atrasado</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Data de Vencimento</label>
              <input
                type="date"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-acqua-500"
              />
            </div>
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
              className="px-5 py-2 rounded-xl bg-vital-600 hover:bg-vital-700 text-white font-bold"
            >
              Salvar Lançamento
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
