# Cubo. Financeiro

Sistema financeiro para BPO Financeiro (multiempresa). Veja o manual de construção para o escopo completo.

## Como rodar

```
npm install
npm run dev
```

Abra o endereço indicado. Na Fase 1 os dados ficam no navegador (localStorage) e o login é local.

## Variáveis

Copie `.env.example` para `.env.local`. As variáveis do Supabase só serão usadas quando o banco for definido.

## Build e deploy

`npm run build` gera `dist/`. Na Vercel: framework Vite, comando `npm run build`, saída `dist`.

## Estado

- Fase 1 (base): feita no modo local. Falta ligar ao Supabase (migration em `supabase/migrations`).
