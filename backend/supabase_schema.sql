-- ========================================================
-- Schema do Banco de Dados - Sistema Academia Acqua Planet
-- Compatível com PostgreSQL / Supabase
-- ========================================================

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE PERFIS / USUÁRIOS DO SISTEMA
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher')),
    specialty VARCHAR(150),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE ALUNOS
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    cpf VARCHAR(20) UNIQUE NOT NULL,
    birth_date DATE,
    plan VARCHAR(100) NOT NULL, -- 'Mensal Aquático', 'Semestral Total', 'Anual Master', etc.
    modalities TEXT[] NOT NULL, -- ['Natação Adulto', 'Hidroginástica']
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'overdue', 'suspended')),
    monthly_fee NUMERIC(10, 2) NOT NULL,
    due_day INT DEFAULT 10,
    emergency_contact VARCHAR(255),
    medical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE TURMAS E AULAS (PISCINAS E SALAS)
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    modality VARCHAR(100) NOT NULL,
    instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    location VARCHAR(150) NOT NULL, -- ex: 'Piscina Principal - Raia 1 e 2', 'Sala de Spinning'
    days_of_week VARCHAR(50) NOT NULL, -- ex: 'Segunda e Quarta', 'Terça e Quinta'
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT NOT NULL DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MATRÍCULA DE ALUNOS NAS TURMAS
CREATE TABLE IF NOT EXISTS class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- 5. TABELA FINANCEIRA (Restrita a Administradores)
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(100) NOT NULL, -- 'Mensalidade', 'Manutenção Piscina', 'Equipamentos', 'Folha Professores', etc.
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('paid', 'pending', 'overdue')),
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE FICHAS DE TREINO E EVOLUÇÃO
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL, -- ex: 'Treino Natação Resistência A', 'Ficha Hipertrofia B'
    modality VARCHAR(100) NOT NULL,
    exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA DE CHECK-IN / ENTRADA NA ACADEMIA
CREATE TABLE IF NOT EXISTS check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- SEED DATA - DADOS INICIAIS MOCKADOS
-- ========================================================

-- Inserir os 2 Administradores
INSERT INTO profiles (id, name, email, role, specialty, avatar_url) VALUES
('a0000000-0000-0000-0000-000000000001', 'Carlos Silva', 'carlos.admin@acquaplanet.com.br', 'admin', 'Administrador Geral & Financeiro', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('a0000000-0000-0000-0000-000000000002', 'Marina Souza', 'marina.financeiro@acquaplanet.com.br', 'admin', 'Gestora Financeira & Contratos', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150')
ON CONFLICT (email) DO NOTHING;

-- Inserir os 5 Professores
INSERT INTO profiles (id, name, email, role, specialty, avatar_url) VALUES
('b0000000-0000-0000-0000-000000000001', 'Rodrigo Rocha', 'rodrigo.natacao@acquaplanet.com.br', 'teacher', 'Natação Adulto & Master', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('b0000000-0000-0000-0000-000000000002', 'Camila Duarte', 'camila.musculacao@acquaplanet.com.br', 'teacher', 'Musculação & Treinamento Funcional', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
('b0000000-0000-0000-0000-000000000003', 'Lucas Ribeiro', 'lucas.spinning@acquaplanet.com.br', 'teacher', 'Ciclismo Indoor & Cardio', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('b0000000-0000-0000-0000-000000000004', 'Beatriz Lima', 'beatriz.pilates@acquaplanet.com.br', 'teacher', 'Pilates e Reabilitação Postural', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
('b0000000-0000-0000-0000-000000000005', 'Gabriel Costa', 'gabriel.infantil@acquaplanet.com.br', 'teacher', 'Natação Infantil & Hidroginástica', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150')
ON CONFLICT (email) DO NOTHING;
