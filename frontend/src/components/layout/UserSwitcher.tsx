import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, ShieldCheck, Dumbbell, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const UserSwitcher: React.FC = () => {
  const { currentUser, profiles, switchUserById } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 hover:border-acqua-300 hover:shadow-sm transition-all text-left"
        title="Alternar perfil de teste"
      >
        <img
          src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={currentUser.name}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-acqua-500/20"
        />
        <div className="hidden sm:block text-left">
          <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1.5">
            {currentUser.name}
            {currentUser.role === 'admin' ? (
              <Badge variant="aqua" className="text-[10px] py-0 px-1.5">Admin</Badge>
            ) : (
              <Badge variant="success" className="text-[10px] py-0 px-1.5">Prof</Badge>
            )}
          </div>
          <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{currentUser.specialty}</div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fade-in">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
            <span>Alternar Usuário (MVP)</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">7 Perfis</span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 py-1">
            <div className="px-2 pt-1 pb-1 text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-acqua-600" />
              Administradores (Com Financeiro)
            </div>
            {profiles.filter(p => p.role === 'admin').map(p => {
              const active = p.id === currentUser.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    switchUserById(p.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    active ? 'bg-acqua-50/80 text-acqua-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={p.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-semibold">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.specialty}</div>
                    </div>
                  </div>
                  {active && <Check className="w-4 h-4 text-acqua-600" />}
                </button>
              );
            })}

            <div className="px-2 pt-2.5 pb-1 text-[11px] font-bold text-slate-400 flex items-center gap-1 border-t border-slate-100 mt-2">
              <Dumbbell className="w-3.5 h-3.5 text-vital-600" />
              Professores & Instrutores
            </div>
            {profiles.filter(p => p.role === 'teacher').map(p => {
              const active = p.id === currentUser.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    switchUserById(p.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    active ? 'bg-vital-50/80 text-vital-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={p.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-semibold">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.specialty}</div>
                    </div>
                  </div>
                  {active && <Check className="w-4 h-4 text-vital-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
