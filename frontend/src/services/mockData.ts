import { UserProfile, Student, GymClass, FinancialTransaction, Workout, CheckInRecord } from '../types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    name: "Carlos Silva",
    email: "carlos.admin@acquaplanet.com.br",
    role: "admin",
    specialty: "Administrador Geral & Financeiro",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    name: "Marina Souza",
    email: "marina.financeiro@acquaplanet.com.br",
    role: "admin",
    specialty: "Gestora Financeira & Contratos",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
  },
  {
    id: "b0000000-0000-0000-0000-000000000001",
    name: "Rodrigo Rocha",
    email: "rodrigo.natacao@acquaplanet.com.br",
    role: "teacher",
    specialty: "Natação Adulto & Master",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    id: "b0000000-0000-0000-0000-000000000002",
    name: "Camila Duarte",
    email: "camila.musculacao@acquaplanet.com.br",
    role: "teacher",
    specialty: "Musculação & Treinamento Funcional",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
  },
  {
    id: "b0000000-0000-0000-0000-000000000003",
    name: "Lucas Ribeiro",
    email: "lucas.spinning@acquaplanet.com.br",
    role: "teacher",
    specialty: "Ciclismo Indoor & Cardio",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  },
  {
    id: "b0000000-0000-0000-0000-000000000004",
    name: "Beatriz Lima",
    email: "beatriz.pilates@acquaplanet.com.br",
    role: "teacher",
    specialty: "Pilates e Reabilitação Postural",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    id: "b0000000-0000-0000-0000-000000000005",
    name: "Gabriel Costa",
    email: "gabriel.infantil@acquaplanet.com.br",
    role: "teacher",
    specialty: "Natação Infantil & Hidroginástica",
    avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150"
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "s001",
    name: "Ana Clara Peixoto",
    email: "anaclara@email.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-01",
    birth_date: "1995-04-12",
    plan: "Plano Acqua Total (Natação + Musculação)",
    modalities: ["Natação Adulto", "Musculação"],
    status: "active",
    monthly_fee: 269.90,
    due_day: 10,
    emergency_contact: "Marcos (Esposo) - (11) 97777-1111",
    medical_notes: "Atestado médico válido até 12/2026. Sem restrições.",
    enrolled_at: "2025-01-15"
  },
  {
    id: "s002",
    name: "Thiago Mendes",
    email: "thiago.m@email.com",
    phone: "(11) 99123-5566",
    cpf: "234.567.890-12",
    birth_date: "1988-09-22",
    plan: "Plano Natação Master",
    modalities: ["Natação Adulto"],
    status: "active",
    monthly_fee: 219.90,
    due_day: 5,
    emergency_contact: "Carla (Mãe) - (11) 98888-2222",
    medical_notes: "Recuperação de ombro. Cuidado em borboleta.",
    enrolled_at: "2024-11-01"
  },
  {
    id: "s003",
    name: "Juliana Ferreira",
    email: "juliana.f@email.com",
    phone: "(11) 98234-8899",
    cpf: "345.678.901-23",
    birth_date: "1975-12-05",
    plan: "Plano Hidro Vitalidade",
    modalities: ["Hidroginástica", "Pilates"],
    status: "overdue",
    monthly_fee: 199.90,
    due_day: 10,
    emergency_contact: "Roberto (Filho) - (11) 96666-3333",
    medical_notes: "Hipertensão leve controlada.",
    enrolled_at: "2024-08-10"
  },
  {
    id: "s004",
    name: "Enzo Gabriel (Menor)",
    email: "pais.enzo@email.com",
    phone: "(11) 99876-1234",
    cpf: "456.789.012-34",
    birth_date: "2018-06-15",
    plan: "Plano Peixinhos (Natação Infantil)",
    modalities: ["Natação Infantil"],
    status: "active",
    monthly_fee: 189.90,
    due_day: 15,
    emergency_contact: "Patrícia (Mãe) - (11) 99876-1234",
    medical_notes: "Touca amarela. Rinite leve.",
    enrolled_at: "2025-02-01"
  },
  {
    id: "s005",
    name: "Felipe Albuquerque",
    email: "felipe.alb@email.com",
    phone: "(11) 97321-4321",
    cpf: "567.890.123-45",
    birth_date: "1992-03-30",
    plan: "Plano Iron Cardio & Força",
    modalities: ["Musculação", "Spinning"],
    status: "active",
    monthly_fee: 199.90,
    due_day: 10,
    emergency_contact: "Bianca (Irmã) - (11) 95555-4444",
    medical_notes: "Apto para alta intensidade.",
    enrolled_at: "2024-06-20"
  },
  {
    id: "s006",
    name: "Helena Vasconcelos",
    email: "helena.v@email.com",
    phone: "(11) 98456-7890",
    cpf: "678.901.234-56",
    birth_date: "1983-11-18",
    plan: "Plano Acqua Livre Anual",
    modalities: ["Natação Adulto", "Pilates", "Musculação"],
    status: "active",
    monthly_fee: 299.90,
    due_day: 20,
    emergency_contact: "Eduardo (Esposo) - (11) 94444-5555",
    medical_notes: "Sem restrições.",
    enrolled_at: "2023-09-15"
  },
  {
    id: "s007",
    name: "Lucas Martins",
    email: "lucas.m@email.com",
    phone: "(11) 96543-2109",
    cpf: "789.012.345-67",
    birth_date: "2000-01-25",
    plan: "Plano Natação Semestral",
    modalities: ["Natação Adulto"],
    status: "suspended",
    monthly_fee: 209.90,
    due_day: 5,
    emergency_contact: "Sônia (Mãe) - (11) 93333-6666",
    medical_notes: "Trancado por viagem.",
    enrolled_at: "2024-03-12"
  },
  {
    id: "s008",
    name: "Dona Maria de Lourdes",
    email: "lourdes.maria@email.com",
    phone: "(11) 97111-2233",
    cpf: "890.123.456-78",
    birth_date: "1958-08-14",
    plan: "Plano Melhor Idade Ativa",
    modalities: ["Hidroginástica"],
    status: "active",
    monthly_fee: 169.90,
    due_day: 10,
    emergency_contact: "Cristina (Filha) - (11) 92222-7777",
    medical_notes: "Apto para hidroginástica.",
    enrolled_at: "2024-01-10"
  }
];

export const INITIAL_CLASSES: GymClass[] = [
  {
    id: "c001",
    title: "Natação Adulto - Condicionamento & Estilos",
    modality: "Natação Adulto",
    instructor_id: "b0000000-0000-0000-0000-000000000001",
    instructor_name: "Rodrigo Rocha",
    location: "Piscina Principal (Semiolímpica) - Raias 1 e 2",
    days_of_week: "Segunda e Quarta",
    start_time: "07:00",
    end_time: "08:00",
    max_capacity: 12,
    enrolled_count: 9,
    students_enrolled: ["s001", "s002", "s006"]
  },
  {
    id: "c002",
    title: "Hidroginástica Terapêutica & Vitalidade",
    modality: "Hidroginástica",
    instructor_id: "b0000000-0000-0000-0000-000000000005",
    instructor_name: "Gabriel Costa",
    location: "Piscina Térmica Aquecida",
    days_of_week: "Terça e Quinta",
    start_time: "08:30",
    end_time: "09:20",
    max_capacity: 20,
    enrolled_count: 16,
    students_enrolled: ["s003", "s008"]
  },
  {
    id: "c003",
    title: "Natação Infantil - Toucas Branca e Amarela",
    modality: "Natação Infantil",
    instructor_id: "b0000000-0000-0000-0000-000000000005",
    instructor_name: "Gabriel Costa",
    location: "Piscina de Aprendizagem Aquecida",
    days_of_week: "Segunda e Quarta",
    start_time: "14:30",
    end_time: "15:15",
    max_capacity: 10,
    enrolled_count: 8,
    students_enrolled: ["s004"]
  },
  {
    id: "c004",
    title: "Ciclismo Indoor Spinning Acqua Beat",
    modality: "Spinning",
    instructor_id: "b0000000-0000-0000-0000-000000000003",
    instructor_name: "Lucas Ribeiro",
    location: "Studio de Spinning Climatizado",
    days_of_week: "Segunda, Quarta e Sexta",
    start_time: "18:30",
    end_time: "19:20",
    max_capacity: 22,
    enrolled_count: 19,
    students_enrolled: ["s005"]
  },
  {
    id: "c005",
    title: "Pilates Solo & Mobilidade Articular",
    modality: "Pilates",
    instructor_id: "b0000000-0000-0000-0000-000000000004",
    instructor_name: "Beatriz Lima",
    location: "Sala Zen & Postura",
    days_of_week: "Terça e Quinta",
    start_time: "09:30",
    end_time: "10:20",
    max_capacity: 14,
    enrolled_count: 11,
    students_enrolled: ["s003", "s006"]
  },
  {
    id: "c006",
    title: "Circuito Funcional & Hipertrofia",
    modality: "Musculação",
    instructor_id: "b0000000-0000-0000-0000-000000000002",
    instructor_name: "Camila Duarte",
    location: "Espaço Musculação e Pesos Livres",
    days_of_week: "Segunda a Sexta",
    start_time: "19:00",
    end_time: "20:00",
    max_capacity: 25,
    enrolled_count: 21,
    students_enrolled: ["s001", "s005", "s006"]
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "tx001",
    description: "Mensalidade - Ana Clara Peixoto",
    type: "income",
    category: "Mensalidade",
    amount: 269.90,
    status: "paid",
    due_date: "2026-10-10",
    paid_at: "2026-10-08T14:20:00",
    student_id: "s001"
  },
  {
    id: "tx002",
    description: "Mensalidade - Thiago Mendes",
    type: "income",
    category: "Mensalidade",
    amount: 219.90,
    status: "paid",
    due_date: "2026-10-05",
    paid_at: "2026-10-05T09:12:00",
    student_id: "s002"
  },
  {
    id: "tx003",
    description: "Mensalidade - Juliana Ferreira",
    type: "income",
    category: "Mensalidade",
    amount: 199.90,
    status: "overdue",
    due_date: "2026-10-10",
    paid_at: null,
    student_id: "s003"
  },
  {
    id: "tx004",
    description: "Mensalidade - Enzo Gabriel",
    type: "income",
    category: "Mensalidade",
    amount: 189.90,
    status: "paid",
    due_date: "2026-10-15",
    paid_at: "2026-10-14T18:00:00",
    student_id: "s004"
  },
  {
    id: "tx005",
    description: "Mensalidade - Felipe Albuquerque",
    type: "income",
    category: "Mensalidade",
    amount: 199.90,
    status: "paid",
    due_date: "2026-10-10",
    paid_at: "2026-10-09T11:45:00",
    student_id: "s005"
  },
  {
    id: "tx006",
    description: "Mensalidade - Helena Vasconcelos",
    type: "income",
    category: "Mensalidade",
    amount: 299.90,
    status: "pending",
    due_date: "2026-10-20",
    paid_at: null,
    student_id: "s006"
  },
  {
    id: "tx007",
    description: "Venda de Kit Natação Acqua Planet (Óculos + Touca)",
    type: "income",
    category: "Venda de Produtos",
    amount: 145.00,
    status: "paid",
    due_date: "2026-10-18",
    paid_at: "2026-10-18T16:30:00"
  },
  {
    id: "tx008",
    description: "Tratamento Químico e Cloração das Piscinas",
    type: "expense",
    category: "Manutenção das Piscinas",
    amount: 1450.00,
    status: "paid",
    due_date: "2026-10-05",
    paid_at: "2026-10-05T10:00:00"
  },
  {
    id: "tx009",
    description: "Manutenção Preventiva das Bombas e Filtros de Areia",
    type: "expense",
    category: "Manutenção das Piscinas",
    amount: 890.00,
    status: "paid",
    due_date: "2026-10-12",
    paid_at: "2026-10-12T15:20:00"
  },
  {
    id: "tx010",
    description: "Conta de Energia Elétrica (Aquecedores Térmicos e Bombas)",
    type: "expense",
    category: "Contas de Consumo",
    amount: 3240.00,
    status: "paid",
    due_date: "2026-10-15",
    paid_at: "2026-10-15T09:30:00"
  },
  {
    id: "tx011",
    description: "Folha de Pagamento - Equipe de Professores e Salva-vidas",
    type: "expense",
    category: "Folha de Pagamento",
    amount: 12800.00,
    status: "paid",
    due_date: "2026-10-05",
    paid_at: "2026-10-05T08:00:00"
  },
  {
    id: "tx012",
    description: "Reposição de Equipamentos (Pranchas, Palmares e Pull Buoys)",
    type: "expense",
    category: "Equipamentos",
    amount: 620.00,
    status: "paid",
    due_date: "2026-10-22",
    paid_at: "2026-10-22T14:10:00"
  }
];

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: "w001",
    student_id: "s001",
    student_name: "Ana Clara Peixoto",
    instructor_id: "b0000000-0000-0000-0000-000000000001",
    instructor_name: "Rodrigo Rocha",
    title: "Evolução Natação 200m Crawl & Costas",
    modality: "Natação Adulto",
    notes: "Foco na rotação do quadril e braçada limpa. Intervalos de 30s.",
    exercises: [
      { series: "4x 50m", item: "Aquecimento Crawl leve", pace: "Solto" },
      { series: "6x 100m", item: "Série Principal Crawl com palmar", pace: "Moderado" },
      { series: "4x 50m", item: "Perna com prancha", pace: "Forte" },
      { series: "200m", item: "Soltura Costas", pace: "Regenerativo" }
    ],
    created_at: "2026-10-10"
  },
  {
    id: "w002",
    student_id: "s005",
    student_name: "Felipe Albuquerque",
    instructor_id: "b0000000-0000-0000-0000-000000000002",
    instructor_name: "Camila Duarte",
    title: "Treino A - Peitoral, Ombros e Tríceps",
    modality: "Musculação",
    notes: "Carga progressiva. Descanso de 60 segundos entre séries.",
    exercises: [
      { series: "4x 10-12", item: "Supino Reto com Barra", pace: "80% 1RM" },
      { series: "3x 12", item: "Desenvolvimento com Halteres", pace: "Moderado" },
      { series: "3x 15", item: "Elevação Lateral", pace: "Isometria 2s" },
      { series: "4x 12", item: "Tríceps Corda no Pulley", pace: "Até a falha" }
    ],
    created_at: "2026-10-12"
  }
];

export const INITIAL_CHECKINS: CheckInRecord[] = [
  {
    id: "chk001",
    student_id: "s001",
    student_name: "Ana Clara Peixoto",
    checked_in_at: "2026-10-27T06:55:00",
    status: "authorized",
    modality: "Natação Adulto"
  },
  {
    id: "chk002",
    student_id: "s005",
    student_name: "Felipe Albuquerque",
    checked_in_at: "2026-10-27T07:15:00",
    status: "authorized",
    modality: "Musculação"
  },
  {
    id: "chk003",
    student_id: "s002",
    student_name: "Thiago Mendes",
    checked_in_at: "2026-10-27T08:02:00",
    status: "authorized",
    modality: "Natação Adulto"
  }
];
