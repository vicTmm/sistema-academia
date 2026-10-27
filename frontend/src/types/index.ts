export type UserRole = 'admin' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialty?: string;
  avatar_url?: string;
}

export type StudentStatus = 'active' | 'overdue' | 'suspended';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birth_date?: string;
  plan: string;
  modalities: string[];
  status: StudentStatus;
  monthly_fee: number;
  due_day: number;
  emergency_contact?: string;
  medical_notes?: string;
  enrolled_at?: string;
}

export interface GymClass {
  id: string;
  title: string;
  modality: string;
  instructor_id: string;
  instructor_name: string;
  location: string;
  days_of_week: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  enrolled_count: number;
  students_enrolled: string[];
  students_details?: Student[];
}

export interface FinancialTransaction {
  id: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date: string;
  paid_at?: string | null;
  student_id?: string | null;
}

export interface FinancialSummary {
  total_received: number;
  total_overdue: number;
  total_pending: number;
  total_expenses: number;
  balance: number;
  expense_breakdown: { category: string; amount: number }[];
}

export interface ExerciseItem {
  series: string;
  item: string;
  pace: string;
}

export interface Workout {
  id: string;
  student_id: string;
  student_name: string;
  instructor_id: string;
  instructor_name: string;
  title: string;
  modality: string;
  notes?: string;
  exercises: ExerciseItem[];
  created_at: string;
}

export interface CheckInRecord {
  id: string;
  student_id: string;
  student_name: string;
  checked_in_at: string;
  status: 'authorized' | 'warning';
  modality: string;
}

export interface DashboardMetrics {
  total_students: number;
  active_students: number;
  overdue_students: number;
  classes_count: number;
  checkins_today: number;
  occupancy_rate: number;
  is_admin: boolean;
  financial?: {
    monthly_income: number;
    pending_income: number;
    monthly_expenses: number;
    net_balance: number;
  } | null;
}
