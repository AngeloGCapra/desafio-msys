# desafio-msys

Teste técnico da **Microsys**: aplicação de **CRUD de usuários** (cadastro, listagem,
edição e exclusão), com back-end em **Java / Spring Boot** e front-end **SPA em React**.

> ⚠️ Projeto em construção — este README descreve a estrutura e como rodar; partes
> da implementação ainda estão sendo desenvolvidas.

## Visão geral

- **Back-end:** API REST em Java 21 + Spring Boot 3.5, Spring Data JPA, PostgreSQL,
  senha com **BCrypt** e rotas protegidas por **JWT** (fluxo Registro → Login → token).
- **Front-end:** React 19 + TypeScript + Vite, Tailwind CSS e React Hook Form.
- **Banco:** PostgreSQL 16, tabela `usuarios`.

## Estrutura do repositório

```
desafio-msys/
├── backend/            # API Java + Spring Boot
├── frontend/           # SPA React + TypeScript
├── docker-compose.yml  # sobe Postgres + back + front
└── .env.example        # variáveis de ambiente (copie para .env)
```

## Como rodar

Há **dois caminhos**. Escolha um.

### Opção A — Docker (recomendado)

Pré-requisito: **Docker Desktop** (Windows/Mac) ou Docker Engine + plugin Compose.

```bash
cp .env.example .env        # no Windows (PowerShell): Copy-Item .env.example .env
docker compose up --build
```

Sobe Postgres, back-end e front-end já conectados. Acesse:

- Front-end: <http://localhost:5173>
- API (Swagger): <http://localhost:8080/swagger-ui.html>

Para parar: `docker compose down` (use `-v` para apagar também o volume do banco).

### Opção B — Manual (sem Docker)

Pré-requisitos: **JDK 21**, **Node 20+**, e um **PostgreSQL 16** rodando localmente
com um banco `desafio_msys`.

**Back-end:**
```bash
cd backend
# configure as variáveis (ou um application-local.yml) apontando para seu Postgres
./mvnw spring-boot:run
```

**Front-end (em outro terminal):**
```bash
cd frontend
npm install
npm run dev
```

Ajuste `VITE_API_URL` (front) e as credenciais do banco (back) conforme seu ambiente —
ver `.env.example`.

## Variáveis de ambiente

Todas as variáveis estão documentadas em [`.env.example`](.env.example). Copie para
`.env` e ajuste. O `.env` real **não é versionado**.
