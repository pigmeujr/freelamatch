# FreelaMatch

Base da Fase 1 do FreelaMatch, uma plataforma de vagas freelancer por cidade no Brasil construída com Next.js, Tailwind CSS e Supabase.

## Stack

- Next.js 14 com App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- Deploy pensado para Vercel + Supabase free tier

## Requisitos

- Node.js 20+ recomendado para desenvolvimento local
- Conta no Supabase

## Setup

1. Instale dependências:

```bash
npm install
```

2. Copie as variáveis de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Rode o projeto:

```bash
npm run dev
```

## Estrutura principal

- `app/`: rotas do App Router
- `components/`: componentes reutilizáveis
- `lib/`: helpers e utilitários
- `types/`: tipos compartilhados
- `supabase/migrations/`: schema SQL inicial

## Banco de dados

A migração inicial está em:

- `supabase/migrations/20260526123000_initial_schema.sql`

Ela cria:

- `profiles`
- `empresas`
- `freelancers`
- `vagas`
- `candidaturas`
- enums de papel, tipo de valor e status
- políticas de RLS
- índices para busca por cidade/estado

## Autenticação

Nesta fase, a base foi preparada para:

- login com email/senha via Supabase Auth
- cadastro separado para empresa e freelancer
- proteção de rotas privadas via middleware

Os formulários e helpers já estão estruturados para evolução nas próximas fases, quando as actions/server flows poderão ser conectadas ao banco.

## Deploy

- Frontend: Vercel
- Backend/Auth/DB: Supabase

## Próximos passos sugeridos

- conectar formulários com Server Actions
- persistir `profiles`, `empresas` e `freelancers` após signup
- listar vagas reais por cidade
- criar dashboards separados por papel