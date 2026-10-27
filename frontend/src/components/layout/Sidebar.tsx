import React from 'react';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CalendarDays,
  Activity,
  ScanLine,
  Lock,
  Waves
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  setIsOpen
}) => {
  const { isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Alunos & Matrículas', icon: Users },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: DollarSign,
      restricted: true,
      badge: 'Admin'
    },
    { id: 'classes', label: 'Turmas & Piscinas', icon: CalendarDays },
    { id: 'workouts', label: 'Treinos & Natação', icon: Activity },
    { id: 'checkin', label: 'Terminal Catraca', icon: ScanLine },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Acqua Planet Branding */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-acqua-600 via-acqua-500 to-vital-400 flex items-center justify-center text-white shadow-md shadow-acqua-500/20">
            <Waves className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-1">
              Acqua<span className="text-acqua-600">Planet</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              Academia & Natação
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Principal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            const isRestrictedForUser = item.restricted && !isAdmin;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  active
                    ? 'bg-acqua-50 text-acqua-700 shadow-sm shadow-acqua-500/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-acqua-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.restricted && (
                  <div className="flex items-center gap-1">
                    {isRestrictedForUser ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-acqua-100 text-acqua-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status card na base da sidebar */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-acqua-50/50 border border-acqua-100/60">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-700">Piscina Principal Ativa</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Água tratada e aquecida a 29.5°C. Cloração e bombas em funcionamento normal.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
