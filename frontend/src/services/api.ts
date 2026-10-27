import {
  UserProfile,
  Student,
  GymClass,
  FinancialTransaction,
  FinancialSummary,
  Workout,
  CheckInRecord,
  DashboardMetrics
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_TRANSACTIONS,
  INITIAL_WORKOUTS,
  INITIAL_CHECKINS
} from './mockData';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

// Armazenamento local para modo fallback caso o backend esteja offline
class LocalStore {
  students = [...INITIAL_STUDENTS];
  classes = [...INITIAL_CLASSES];
  transactions = [...INITIAL_TRANSACTIONS];
  workouts = [...INITIAL_WORKOUTS];
  checkins = [...INITIAL_CHECKINS];
}

const localStore = new LocalStore();

async function request<T>(endpoint: string, options: RequestInit = {}, userRole: string = 'admin'): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    'X-User-Role': userRole,
    ...(options.headers || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout para detectar se o backend local está rodando

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP Error ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    // Se for 403 Forbidden (ex: professor tentando acessar financeiro), repassa o erro propositalmente!
    if (err.message && err.message.includes('Acesso negado')) {
      throw err;
    }
    // Fallback inteligente para dados locais no frontend
    return fallbackHandler<T>(endpoint, options, userRole);
  }
}

function fallbackHandler<T>(endpoint: string, options: RequestInit, userRole: string): T {
  const method = options.method || 'GET';

  // 1. Perfis
  if (endpoint.startsWith('/auth/profiles')) {
    return INITIAL_PROFILES as unknown as T;
  }

  // 2. Dashboard
  if (endpoint.startsWith('/dashboard/metrics')) {
    const total_students = localStore.students.length;
    const active_students = localStore.students.filter(s => s.status === 'active').length;
    const overdue_students = localStore.students.filter(s => s.status === 'overdue').length;
    const total_capacity = localStore.classes.reduce((acc, c) => acc + c.max_capacity, 0);
    const total_enrolled = localStore.classes.reduce((acc, c) => acc + c.enrolled_count, 0);
    const occupancy_rate = Math.round((total_enrolled / total_capacity) * 100);

    const metrics: DashboardMetrics = {
      total_students,
      active_students,
      overdue_students,
      classes_count: localStore.classes.length,
      checkins_today: localStore.checkins.length,
      occupancy_rate,
      is_admin: userRole === 'admin',
      financial: userRole === 'admin' ? {
        monthly_income: localStore.transactions.filter(t => t.type === 'income' && t.status === 'paid').reduce((a, b) => a + b.amount, 0),
        pending_income: localStore.transactions.filter(t => t.type === 'income' && t.status !== 'paid').reduce((a, b) => a + b.amount, 0),
        monthly_expenses: localStore.transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0),
        net_balance: localStore.transactions.filter(t => t.type === 'income' && t.status === 'paid').reduce((a, b) => a + b.amount, 0) -
                     localStore.transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0)
      } : null
    };
    return metrics as unknown as T;
  }

  // 3. Alunos
  if (endpoint.startsWith('/students')) {
    if (method === 'POST') {
      const data = JSON.parse(options.body as string);
      const newS: Student = {
        ...data,
        id: `s${localStore.students.length + 1}`.padStart(4, '0'),
        enrolled_at: new Date().toISOString().split('T')[0]
      };
      localStore.students.unshift(newS);
      return newS as unknown as T;
    }
    return localStore.students as unknown as T;
  }

  // 4. Financeiro (Bloqueio estrito se não for admin)
  if (endpoint.startsWith('/financial')) {
    if (userRole !== 'admin') {
      throw new Error("Acesso negado: O módulo financeiro é restrito exclusivamente aos administradores.");
    }
    if (endpoint.includes('/summary')) {
      const incomes = localStore.transactions.filter(t => t.type === 'income');
      const expenses = localStore.transactions.filter(t => t.type === 'expense');
      const total_received = incomes.filter(t => t.status === 'paid').reduce((a, b) => a + b.amount, 0);
      const total_overdue = incomes.filter(t => t.status === 'overdue').reduce((a, b) => a + b.amount, 0);
      const total_pending = incomes.filter(t => t.status === 'pending').reduce((a, b) => a + b.amount, 0);
      const total_expenses = expenses.reduce((a, b) => a + b.amount, 0);
      const balance = total_received - total_expenses;

      const breakdownMap: Record<string, number> = {};
      expenses.forEach(e => {
        breakdownMap[e.category] = (breakdownMap[e.category] || 0) + e.amount;
      });

      const summary: FinancialSummary = {
        total_received,
        total_overdue,
        total_pending,
        total_expenses,
        balance,
        expense_breakdown: Object.entries(breakdownMap).map(([category, amount]) => ({ category, amount }))
      };
      return summary as unknown as T;
    }
    if (method === 'POST') {
      const data = JSON.parse(options.body as string);
      const newT: FinancialTransaction = {
        ...data,
        id: `tx${localStore.transactions.length + 1}`.padStart(5, '0'),
        paid_at: data.status === 'paid' ? new Date().toISOString() : null
      };
      localStore.transactions.unshift(newT);
      return newT as unknown as T;
    }
    return localStore.transactions as unknown as T;
  }

  // 5. Turmas
  if (endpoint.startsWith('/classes')) {
    return localStore.classes as unknown as T;
  }

  // 6. Treinos
  if (endpoint.startsWith('/workouts')) {
    if (method === 'POST') {
      const data = JSON.parse(options.body as string);
      const student = localStore.students.find(s => s.id === data.student_id);
      const prof = INITIAL_PROFILES.find(p => p.id === data.instructor_id);
      const newW: Workout = {
        ...data,
        id: `w${localStore.workouts.length + 1}`.padStart(4, '0'),
        student_name: student?.name || 'Aluno',
        instructor_name: prof?.name || 'Professor',
        created_at: new Date().toISOString().split('T')[0]
      };
      localStore.workouts.unshift(newW);
      return newW as unknown as T;
    }
    return localStore.workouts as unknown as T;
  }

  // 7. Checkins
  if (endpoint.startsWith('/checkins')) {
    if (method === 'POST') {
      const { cpf_or_id } = JSON.parse(options.body as string);
      const student = localStore.students.find(s => s.id === cpf_or_id || s.cpf === cpf_or_id || s.cpf.replace(/\D/g, '') === cpf_or_id.replace(/\D/g, ''));
      if (!student) {
        throw new Error("Aluno não encontrado para o CPF/ID informado.");
      }
      if (student.status === 'suspended') {
        throw new Error("Acesso bloqueado: Matrícula com status Trancada.");
      }
      const isOverdue = student.status === 'overdue';
      const record: CheckInRecord = {
        id: `chk${localStore.checkins.length + 1}`,
        student_id: student.id,
        student_name: student.name,
        checked_in_at: new Date().toISOString(),
        status: isOverdue ? 'warning' : 'authorized',
        modality: student.modalities.join(', ')
      };
      localStore.checkins.unshift(record);
      return {
        authorized: true,
        student,
        entry: record,
        message: isOverdue ? 'Entrada Autorizada (Aviso: Mensalidade em aberto)' : 'Acesso Liberado! Bem-vindo(a) à Acqua Planet!',
        has_warning: isOverdue
      } as unknown as T;
    }
    return localStore.checkins as unknown as T;
  }

  return [] as unknown as T;
}

export const api = {
  getProfiles: () => request<UserProfile[]>('/auth/profiles'),
  getDashboard: (role: string) => request<DashboardMetrics>('/dashboard/metrics', {}, role),
  getStudents: (params?: { search?: string; status?: string; modality?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<Student[]>(`/students?${q}`);
  },
  createStudent: (data: Omit<Student, 'id' | 'enrolled_at'>) =>
    request<Student>('/students', { method: 'POST', body: JSON.stringify(data) }),
  getFinancialSummary: (role: string) => request<FinancialSummary>('/financial/summary', {}, role),
  getFinancialTransactions: (role: string, type?: string) =>
    request<FinancialTransaction[]>(`/financial/transactions${type ? `?type=${type}` : ''}`, {}, role),
  createTransaction: (data: Omit<FinancialTransaction, 'id' | 'paid_at'>, role: string) =>
    request<FinancialTransaction>('/financial/transactions', { method: 'POST', body: JSON.stringify(data) }, role),
  getClasses: (modality?: string) => request<GymClass[]>(`/classes${modality ? `?modality=${modality}` : ''}`),
  enrollInClass: (classId: string, studentId: string) =>
    request<{ message: string }>(`/classes/${classId}/enroll?student_id=${studentId}`, { method: 'POST' }),
  getWorkouts: (studentId?: string) => request<Workout[]>(`/workouts${studentId ? `?student_id=${studentId}` : ''}`),
  createWorkout: (data: any) => request<Workout>('/workouts', { method: 'POST', body: JSON.stringify(data) }),
  getCheckins: () => request<CheckInRecord[]>('/checkins'),
  doCheckin: (cpfOrId: string) => request<any>('/checkins', { method: 'POST', body: JSON.stringify({ cpf_or_id: cpfOrId }) })
};
