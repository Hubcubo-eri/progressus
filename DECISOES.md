# Decisões

- **Banco adiado:** por orientação do responsável, a Fase 1 roda sem Supabase. Os dados ficam em `localStorage` (`src/lib/store.ts`), com a mesma forma das tabelas `fin_`. O login é local, de demonstração (qualquer e-mail e senha entram, perfil admin).
- **Migration pronta, não aplicada:** `supabase/migrations/0001_fase1_cadastros.sql` traz tabelas, `fin_tem_acesso` e RLS da Fase 1. Antes de aplicar, escolher um projeto existente (sem criar novo) e listar as tabelas para checar conflito com `fin_`.
- **Tailwind 3** (config simples) em vez da v4.
- **Plano de contas modelo** em `src/lib/planoModelo.ts`, copiado ao criar empresa ou pelo botão em Categorias.
- **Valores em centavos** (inteiros), formatados em R$ só na interface.
