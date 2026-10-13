-- Fase 1: cadastros, perfis e RLS. NAO APLICADA: aguardando definicao do projeto Supabase.
-- Antes de aplicar: listar tabelas existentes e confirmar que nao ha conflito com o prefixo fin_.

create table fin_empresas (
  id uuid primary key default gen_random_uuid(),
  razao_social text not null,
  nome_fantasia text,
  cnpj text,
  regime text not null default 'simples' check (regime in ('simples','presumido','real','mei')),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);

create table fin_usuario_empresa (
  user_id uuid not null references auth.users(id) on delete cascade,
  empresa_id uuid not null references fin_empresas(id) on delete cascade,
  perfil text not null check (perfil in ('admin','operador','aprovador','cliente')),
  primary key (user_id, empresa_id)
);

create table fin_contas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references fin_empresas(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('banco','caixa','cartao','adquirente')),
  banco text,
  saldo_inicial_centavos bigint not null default 0,
  data_saldo_inicial date,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);

create table fin_categorias (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references fin_empresas(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('receita','despesa')),
  pai_id uuid references fin_categorias(id),
  codigo text,
  grupo_dre text not null check (grupo_dre in ('receita_bruta','deducoes','custos','despesas_operacionais','despesas_financeiras','outras')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);

create table fin_centros_custo (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references fin_empresas(id) on delete cascade,
  nome text not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);

create table fin_pessoas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references fin_empresas(id) on delete cascade,
  nome text not null,
  documento text,
  tipo text not null check (tipo in ('cliente','fornecedor','ambos')),
  email text,
  telefone text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);

create index on fin_contas (empresa_id);
create index on fin_categorias (empresa_id);
create index on fin_centros_custo (empresa_id);
create index on fin_pessoas (empresa_id);

-- Acesso por empresa e perfil
create or replace function fin_tem_acesso(p_empresa uuid, p_perfis text[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from fin_usuario_empresa
    where user_id = auth.uid() and empresa_id = p_empresa and perfil = any(p_perfis)
  );
$$;

alter table fin_empresas enable row level security;
alter table fin_usuario_empresa enable row level security;
alter table fin_contas enable row level security;
alter table fin_categorias enable row level security;
alter table fin_centros_custo enable row level security;
alter table fin_pessoas enable row level security;

create policy empresas_select on fin_empresas for select
  using (fin_tem_acesso(id, array['admin','operador','aprovador','cliente']));
create policy empresas_write on fin_empresas for all
  using (fin_tem_acesso(id, array['admin'])) with check (fin_tem_acesso(id, array['admin']));

create policy ue_select on fin_usuario_empresa for select using (user_id = auth.uid() or fin_tem_acesso(empresa_id, array['admin']));
create policy ue_write on fin_usuario_empresa for all
  using (fin_tem_acesso(empresa_id, array['admin'])) with check (fin_tem_acesso(empresa_id, array['admin']));

-- Cadastros por empresa: leitura para todos os perfis, escrita para admin e operador
do $$
declare t text;
begin
  foreach t in array array['fin_contas','fin_categorias','fin_centros_custo','fin_pessoas'] loop
    execute format('create policy %I on %I for select using (fin_tem_acesso(empresa_id, array[''admin'',''operador'',''aprovador'',''cliente'']))', t || '_select', t);
    execute format('create policy %I on %I for all using (fin_tem_acesso(empresa_id, array[''admin'',''operador''])) with check (fin_tem_acesso(empresa_id, array[''admin'',''operador'']))', t || '_write', t);
  end loop;
end $$;
