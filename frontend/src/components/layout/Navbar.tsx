import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { UserSwitcher } from './UserSwitcher';

interface NavbarProps {
  onToggleSidebar: () => void;
  pageTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, pageTitle }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{pageTitle}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Simulação de notificações do dia */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-vital-500" />
          <span>Sistema Conectado</span>
        </div>

        {/* Alternador de usuários (Carlos Admin, Marina Admin, Rodrigo, Camila, etc.) */}
        <UserSwitcher />
      </div>
    </header>
  );
};
