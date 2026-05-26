create extension if not exists "pgcrypto";

create type public.user_role as enum ('empresa', 'freelancer');
create type public.tipo_valor_vaga as enum ('dia', 'hora', 'projeto');
create type public.status_candidatura as enum ('pendente', 'aceita', 'recusada');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role public.user_role not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.empresas (
  id uuid primary key references public.profiles (id) on delete cascade,
  nome text not null,
  cnpj text not null unique,
  cep text,
  endereco text,
  bairro text,
  numero text,
  whatsapp text,
  logo_url text,
  descricao text,
  plano_ativo boolean not null default false
);

create table public.freelancers (
  id uuid primary key references public.profiles (id) on delete cascade,
  nome_completo text not null,
  cpf text not null unique,
  cidade text not null,
  estado text not null,
  telefone text,
  habilidades text[],
  bio text
);

create table public.vagas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  titulo text not null,
  descricao text not null,
  valor numeric(10, 2),
  tipo_valor public.tipo_valor_vaga,
  horario text,
  cidade text not null,
  estado text not null,
  bairro text,
  requisitos text,
  ativa boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.candidaturas (
  id uuid primary key default gen_random_uuid(),
  vaga_id uuid not null references public.vagas (id) on delete cascade,
  freelancer_id uuid not null references public.freelancers (id) on delete cascade,
  mensagem text,
  status public.status_candidatura not null default 'pendente',
  created_at timestamptz not null default timezone('utc', now()),
  constraint candidaturas_vaga_id_freelancer_id_key unique (vaga_id, freelancer_id)
);

create index vagas_cidade_estado_ativa_idx on public.vagas (cidade, estado, ativa);
create index vagas_empresa_id_idx on public.vagas (empresa_id);
create index freelancers_cidade_estado_idx on public.freelancers (cidade, estado);
create index candidaturas_vaga_id_idx on public.candidaturas (vaga_id);
create index candidaturas_freelancer_id_idx on public.candidaturas (freelancer_id);

alter table public.profiles enable row level security;
alter table public.empresas enable row level security;
alter table public.freelancers enable row level security;
alter table public.vagas enable row level security;
alter table public.candidaturas enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "empresas_select_public"
on public.empresas
for select
to authenticated, anon
using (true);

create policy "empresas_insert_own"
on public.empresas
for insert
to authenticated
with check (auth.uid() = id);

create policy "empresas_update_own"
on public.empresas
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "freelancers_select_own"
on public.freelancers
for select
to authenticated
using (auth.uid() = id);

create policy "freelancers_insert_own"
on public.freelancers
for insert
to authenticated
with check (auth.uid() = id);

create policy "freelancers_update_own"
on public.freelancers
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "vagas_select_active_public"
on public.vagas
for select
to authenticated, anon
using (ativa = true);

create policy "vagas_insert_empresa"
on public.vagas
for insert
to authenticated
with check (auth.uid() = empresa_id);

create policy "vagas_update_empresa"
on public.vagas
for update
to authenticated
using (auth.uid() = empresa_id)
with check (auth.uid() = empresa_id);

create policy "candidaturas_insert_freelancer"
on public.candidaturas
for insert
to authenticated
with check (auth.uid() = freelancer_id);

create policy "candidaturas_select_freelancer_own"
on public.candidaturas
for select
to authenticated
using (auth.uid() = freelancer_id);

create policy "candidaturas_select_empresa_vagas"
on public.candidaturas
for select
to authenticated
using (
  exists (
    select 1
    from public.vagas
    where public.vagas.id = vaga_id
      and public.vagas.empresa_id = auth.uid()
  )
);

create policy "candidaturas_update_empresa_status"
on public.candidaturas
for update
to authenticated
using (
  exists (
    select 1
    from public.vagas
    where public.vagas.id = vaga_id
      and public.vagas.empresa_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.vagas
    where public.vagas.id = vaga_id
      and public.vagas.empresa_id = auth.uid()
  )
);