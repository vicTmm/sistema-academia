import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Financial } from './pages/Financial';
import { Schedule } from './pages/Schedule';
import { Workouts } from './pages/Workouts';
import { CheckIn } from './pages/CheckIn';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Visão Geral do Sistema';
      case 'students':
        return 'Alunos & Matrículas';
      case 'financial':
        return 'Controle Financeiro & Fluxo de Caixa';
      case 'classes':
        return 'Grade de Turmas & Piscinas';
      case 'workouts':
        return 'Fichas de Treino & Natação';
      case 'checkin':
        return 'Terminal de Catraca & Recepção';
      default:
        return 'Acqua Planet';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar de Navegação */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          pageTitle={getPageTitle()}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />}
          {currentTab === 'students' && <Students />}
          {currentTab === 'financial' && <Financial />}
          {currentTab === 'classes' && <Schedule />}
          {currentTab === 'workouts' && <Workouts />}
          {currentTab === 'checkin' && <CheckIn />}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
