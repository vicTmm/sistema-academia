import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardMetrics, Student, GymClass, CheckInRecord } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Waves,
  ScanLine,
  CalendarDays,
  PlusCircle,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [recentCheckins, setRecentCheckins] = useState<CheckInRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [m, c, chk] = await Promise.all([
          api.getDashboard(currentUser.role),
          api.getClasses(),
          api.getCheckins()
        ]);
        setMetrics(m);
        setClasses(c.slice(0, 4));
        setRecentCheckins(chk.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner de Boas-vindas com temática da Acqua Planet */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-acqua-700 via-acqua-600 to-vital-600 text-white p-6 sm:p-8 shadow-lg shadow-acqua-700/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
            <Waves className="w-3.5 h-3.5 text-vital-300" />
            <span>Sistema Integrado Acqua Planet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Olá, {currentUser.name}! 👋
          </h1>
          <p className="mt-2 text-sm text-acqua-100 leading-relaxed">
            {isAdmin
              ? 'Você tem acesso administrativo completo. Acompanhe abaixo as métricas operacionais, ocupação das raias e fluxo de caixa da academia.'
              : `Você está logado como ${currentUser.specialty}. Gerencie seus alunos, grade de aulas e presenças.`}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('checkin')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-acqua-700 font-bold text-xs shadow-sm hover:bg-acqua-50 transition-all"
            >
              <ScanLine className="w-4 h-4" />
              Terminal de Entrada (Catraca)
            </button>
            <button
              onClick={() => onNavigate('classes')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs backdrop-blur-md transition-all"
            >
              <CalendarDays className="w-4 h-4" />
              Grade de Piscinas & Horários
            </button>
            {isAdmin && (
              <button
                onClick={() => onNavigate('financial')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-vital-500 hover:bg-vital-400 text-white font-bold text-xs transition-all shadow-sm"
              >
                <DollarSign className="w-4 h-4" />
                Painel Financeiro
              </button>
            )}
          </div>
        </div>

        {/* Efeito decorativo aquático */}
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
          <Waves className="w-96 h-96" />
        </div>
      </div>

      {/* Grid de KPIs principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Alunos Ativos"
          value={metrics ? metrics.active_students : '--'}
          subtitle={`Total de ${metrics?.total_students || 0} matriculados`}
          icon={Users}
          colorScheme="blue"
        />

        <StatCard
          title="Ocupação das Raias & Salas"
          value={metrics ? `${metrics.occupancy_rate}%` : '--'}
          subtitle="Capacidade das turmas"
          icon={Waves}
          colorScheme="teal"
        />

        <StatCard
          title="Entradas Registradas Hoje"
          value={metrics ? metrics.checkins_today : '--'}
          subtitle="Check-ins na catraca"
          icon={ScanLine}
          colorScheme="green"
        />

        {isAdmin ? (
          <StatCard
            title="Receitas no Mês (Admin)"
            value={metrics?.financial ? `R$ ${metrics.financial.monthly_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
            subtitle={`Saldo: R$ ${metrics?.financial?.net_balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            trend="Financeiro Ativo"
            trendPositive={true}
            colorScheme="green"
          />
        ) : (
          <StatCard
            title="Minhas Turmas Ativas"
            value={classes.length}
            subtitle="Horários na grade semanal"
            icon={CalendarDays}
            colorScheme="amber"
          />
        )}
      </div>

      {/* Seção Central: Aulas do Dia & Últimos Check-ins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Aulas e Ocupação de Piscinas */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Grade do Dia nas Piscinas & Salas</h3>
                <p className="text-xs text-slate-400 mt-0.5">Aulas programadas e instrutor responsável</p>
              </div>
              <button
                onClick={() => onNavigate('classes')}
                className="text-xs font-semibold text-acqua-600 hover:text-acqua-700 flex items-center gap-1"
              >
                Ver grade completa <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {classes.map((c) => {
                const occupancyPercent = Math.round((c.enrolled_count / c.max_capacity) * 100);
                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{c.title}</span>
                      <Badge variant="aqua" className="text-[10px] shrink-0">
                        {c.modality}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.start_time} - {c.end_time} ({c.days_of_week})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{c.location}</span>
                      </div>
                    </div>

                    {/* Barra de lotação */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1 font-medium text-slate-600">
                        <span>Vagas: {c.enrolled_count}/{c.max_capacity}</span>
                        <span className="font-semibold text-acqua-600">{occupancyPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-acqua-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Temperatura média das piscinas: <strong>29.2°C</strong></span>
            <span className="text-vital-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tratamento UV e Filtros OK
            </span>
          </div>
        </div>

        {/* Fluxo ao vivo de Check-ins na Catraca */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Entradas Recentes</h3>
                <p className="text-xs text-slate-400 mt-0.5">Catraca da recepção em tempo real</p>
              </div>
              <button
                onClick={() => onNavigate('checkin')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                title="Abrir Catraca"
              >
                <ScanLine className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentCheckins.map((chk) => (
                <div
                  key={chk.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-acqua-100 text-acqua-700 flex items-center justify-center font-bold text-xs">
                      {chk.student_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{chk.student_name}</h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[130px]">{chk.modality}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={chk.status === 'authorized' ? 'success' : 'warning'} className="text-[10px]">
                      {chk.status === 'authorized' ? 'Liberado' : 'Aviso Pend.'}
                    </Badge>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(chk.checked_in_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('checkin')}
            className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:border-acqua-500 hover:text-acqua-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <ScanLine className="w-4 h-4" />
            Registrar Check-in Manual
          </button>
        </div>
      </div>
    </div>
  );
};
