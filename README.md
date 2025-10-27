## Webhook Inspector - Desafio Fullstack + AI

> Pequeno guia rápido para instalar, executar e entender as tecnologias do projeto.

## Visão geral

Projeto monorepo com duas aplicações:
- `api/` — backend em TypeScript usando Fastify e Drizzle ORM (Postgres).
- `web/` — frontend em React + Vite.

## Tecnologias principais

- Node.js + TypeScript
- pnpm (workspaces)
- Fastify (API)
- Drizzle ORM / drizzle-kit (migrations & modelos)
- Postgres (via `pg`)
- React + Vite (frontend)
- Zod (validação)
- tsx (execução em dev para a API)
- Biome (format)

## Requisitos

- Node.js (versão compatível com dependências do projeto)
- pnpm (o projeto usa pnpm como package manager)
- Postgres (se for rodar a base localmente)

## Instalação

No diretório raiz do repositório, instale as dependências das workspaces:

```bash
pnpm install
```

Observação: este é um monorepo — os pacotes `api` e `web` estão configurados como workspaces.

## Executando em desenvolvimento

1) Rodar a API (modo dev):

```bash
cd api
pnpm dev
```

O comando usa `tsx watch` e carrega variáveis de ambiente de `.env` (se houver).

2) Rodar o frontend (Vite):

```bash
cd web
pnpm dev
```

Abra o endereço que o Vite informar (normalmente http://localhost:5173).

## Build / produção

Frontend:

```bash
cd web
pnpm build
pnpm preview
```

API: não há script de build explícito no `api/package.json` além do `start` (que espera `dist/server.js`). Em produção, compile/transpile conforme sua pipeline e execute `pnpm start` dentro de `api`.

## Banco de dados / Migrações

Os scripts de banco de dados estão no `api/package.json` via `drizzle-kit`:

```bash
cd api
pnpm db:generate   # gerar artefatos do ORM, se necessário
pnpm db:migrate    # aplicar migrações
pnpm db:studio     # rodar drizzle studio
```

Certifique-se de ter as variáveis de ambiente de conexão (ex.: DATABASE_URL) configuradas antes de rodar migrações.

## Estrutura do projeto (resumida)

- `api/` — código do backend (src/, db/, routes/, etc.)
- `web/` — SPA React + Vite
- `package.json` (raiz) — configura workspaces

## Dicas rápidas

- Use `pnpm` no root para gerenciar dependências do monorepo.
- Para rodar apenas um workspace a partir do root, você também pode usar `pnpm --filter <workspace> run <script>` (ex.: `pnpm --filter web run dev`).
- Formatação/linters: `pnpm --filter api run format` usa Biome para formatar o `api`.
