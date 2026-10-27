# 🌊 Sistema Academia Acqua Planet

Sistema moderno de gestão integrada para a academia e complexo aquático **Acqua Planet**. Desenvolvido com **FastAPI (Python)** integrado ao **Supabase**, e **React.js** com design moderno nas cores azul, verde e branco (estilo shadcn/ui com ícones Lucide), preparado para deploy direto na **Vercel**.

---

## 🚀 Arquitetura & Tecnologias

- **Backend**: Python 3.10+ com FastAPI, Pydantic v2, Uvicorn, Supabase SDK e fallback com dados mockados.
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons.
- **Banco de Dados**: Supabase (PostgreSQL) com script de migração e dados iniciais prontos (`backend/supabase_schema.sql`).
- **Deploy**: Frontend pronto para Vercel (`vercel.json`), backend compatível com qualquer host (Render, Railway, Fly.io, etc.).

---

## 👥 Perfis de Usuários (MVP Mockado)

O sistema conta com um **Alternador de Perfis (User Switcher)** no topo da barra de navegação para alternar e testar facilmente:

### 1. Administradores (Acesso Total + Módulo Financeiro)
1. **Carlos Silva** (`carlos.admin@acquaplanet.com.br`) – Administrador Geral & Financeiro
2. **Marina Souza** (`marina.financeiro@acquaplanet.com.br`) – Gestora Financeira & Contratos

### 2. Professores / Instrutores
1. **Rodrigo Rocha** (`rodrigo.natacao@acquaplanet.com.br`) – Natação Adulto & Master
2. **Camila Duarte** (`camila.musculacao@acquaplanet.com.br`) – Musculação & Funcional
3. **Lucas Ribeiro** (`lucas.spinning@acquaplanet.com.br`) – Ciclismo Indoor & Cardio
4. **Beatriz Lima** (`beatriz.pilates@acquaplanet.com.br`) – Pilates e Postura
5. **Gabriel Costa** (`gabriel.infantil@acquaplanet.com.br`) – Natação Infantil & Hidroginástica

---

## 📋 Módulos Implementados

1. **Dashboard Geral**: Visão panorâmica dos alunos ativos, lotação das raias e piscinas, check-ins do dia e resumo financeiro (exclusivo para Admins).
2. **Gestão de Alunos & Matrículas**: Cadastro, filtros por modalidade (Natação, Hidro, Musculação, Spinning, Pilates) e status (Ativo, Inadimplente, Trancado), com histórico e ficha médica.
3. **Módulo Financeiro (Restrito aos 2 Admins)**: Fluxo de caixa com faturamento, despesas operacionais (tratamento de cloro das piscinas, bombas, luz, folha), inadimplência e extrato de transações. *Professores recebem tela de bloqueio com aviso explicativo e opção de troca de perfil*.
4. **Grade de Turmas & Piscinas**: Horários, capacidade máxima e ocupação das raias e salas, com matrícula direta de alunos.
5. **Fichas de Treino & Natação**: Prescrição pedagógica de séries (metros, palmares, pausas, cargas) pelos professores.
6. **Terminal de Catraca / Check-in**: Validação em tempo real na recepção com feedback visual para entrada liberada, alerta de mensalidade vencida ou matrícula trancada.

---

## 🛠️ Como Executar o Projeto Localmente

### 1. Backend (Python / FastAPI)

Abra um terminal na pasta raiz do projeto:

```bash
cd backend
py -3 -m pip install -r requirements.txt
py -3 -m uvicorn app.main:app --reload --port 8000
```

> A documentação Swagger interativa ficará disponível em: **http://localhost:8000/docs**

### 2. Frontend (React / Vite)

Abra outro terminal:

```bash
cd frontend
npm install
npm run dev
```

> A interface estará rodando em: **http://localhost:5173**

---

## ☁️ Como Conectar ao Supabase (Opcional)

Para persistir os dados no Supabase em vez de usar os dados mockados locais:

1. Acesse o painel do seu projeto no [Supabase](https://supabase.com).
2. Vá no **SQL Editor** e execute o script contido em:
   [`backend/supabase_schema.sql`](file:///c:/Projetos/sistema-academia/backend/supabase_schema.sql)
3. Crie um arquivo `.env` dentro da pasta `backend/` baseado em `backend/.env.example`:
   ```env
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-anon-ou-service-role
   ```
4. Reinicie o backend. Ele conectará automaticamente ao Supabase!

---

## 🌐 Deploy na Vercel

O frontend já possui o arquivo `frontend/vercel.json` configurado:

1. Conecte o repositório no dashboard da [Vercel](https://vercel.com).
2. Em **Root Directory**, selecione a pasta `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. (Opcional) Adicione a variável de ambiente `VITE_API_URL` apontando para a URL pública do seu backend Python.