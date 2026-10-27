import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CheckInRecord, Student } from '../types';
import { Badge } from '../components/ui/Badge';
import {
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';

export const CheckIn: React.FC = () => {
  const [cpfOrId, setCpfOrId] = useState('');
  const [lastResult, setLastResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkins, setCheckins] = useState<CheckInRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const loadData = async () => {
    try {
      const [chks, stds] = await Promise.all([api.getCheckins(), api.getStudents()]);
      setCheckins(chks);
      setStudents(stds);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckin = async (idToUse?: string) => {
    const term = idToUse || cpfOrId;
    if (!term) return;

    setErrorMessage(null);
    setLastResult(null);

    try {
      const res = await api.doCheckin(term);
      setLastResult(res);
      setCpfOrId('');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao validar entrada');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Topo */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Terminal de Catraca & Recepção</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Validação biométrica / CPF de alunos na entrada da academia e piscinas
        </p>
      </div>

      {/* Caixa Principal da Catraca */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-acqua-50 text-acqua-600 flex items-center justify-center mx-auto border border-acqua-100">
            <ScanLine className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">Aproximar Código ou Digitar CPF</h3>
            <p className="text-xs text-slate-400 mt-1">
              O sistema verifica a regularidade da matrícula e o atestado médico
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite o CPF ou ID do aluno (ex: 123.456.789-01)..."
              value={cpfOrId}
              onChange={(e) => setCpfOrId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckin()}
              className="flex-1 px-4 py-3 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-acqua-500/20 focus:border-acqua-500 font-medium text-slate-900"
            />
            <button
              onClick={() => handleCheckin()}
              className="px-6 py-3 rounded-2xl bg-acqua-600 hover:bg-acqua-700 text-white font-bold text-xs shadow-md shadow-acqua-600/20 transition-all shrink-0"
            >
              Liberar Catraca
            </button>
          </div>

          {/* Atalhos rápidos para testar no MVP */}
          <div className="pt-2 text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-acqua-600" />
              Clique rápido para testar os cenários no MVP:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCheckin('123.456.789-01')}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 transition-colors"
              >
                ✅ Ana Clara (Ativa)
              </button>
              <button
                onClick={() => handleCheckin('345.678.901-23')}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-slate-700 hover:text-amber-700 transition-colors"
              >
                ⚠️ Juliana (Inadimplente)
              </button>
              <button
                onClick={() => handleCheckin('789.012.345-67')}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-700 transition-colors"
              >
                🚫 Lucas (Trancada)
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Visual do Acesso */}
        {lastResult && (
          <div
            className={`mt-6 p-5 rounded-2xl border flex items-start gap-4 animate-fade-in ${
              lastResult.has_warning
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}
          >
            {lastResult.has_warning ? (
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="text-sm font-bold">{lastResult.message}</div>
              <div className="text-xs mt-1 text-slate-600">
                Aluno(a): <strong>{lastResult.student.name}</strong> • Modalidades:{' '}
                {lastResult.student.modalities.join(', ')}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Plano: {lastResult.student.plan} • Horário:{' '}
                {new Date().toLocaleTimeString('pt-BR')}
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 p-5 rounded-2xl border border-rose-200 bg-rose-50/80 text-rose-900 flex items-start gap-4 animate-fade-in">
            <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold">Acesso Não Autorizado</div>
              <div className="text-xs text-rose-700 mt-1">{errorMessage}</div>
            </div>
          </div>
        )}
      </div>

      {/* Histórico Recente da Catraca */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Últimos Acessos Registrados</h3>
        <p className="text-xs text-slate-400 mb-4">Registro cronológico de entradas na catraca</p>

        <div className="divide-y divide-slate-100">
          {checkins.map((chk) => (
            <div key={chk.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  {chk.student_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{chk.student_name}</div>
                  <div className="text-[11px] text-slate-400">{chk.modality}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant={chk.status === 'authorized' ? 'success' : 'warning'} className="text-[10px]">
                  {chk.status === 'authorized' ? 'Catraca Liberada' : 'Aviso Financeiro'}
                </Badge>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(chk.checked_in_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
