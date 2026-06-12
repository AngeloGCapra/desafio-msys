# Desafio Microsys

Implementação do teste técnico da **Microsys**: aplicação de **CRUD de usuários** (cadastro, listagem, edição e exclusão), com back-end em **Java / Spring Boot** e front-end **SPA em React**.

## Arquitetura

**Full-Stack Monorepo com Arquitetura em Camadas.** Back-end e front-end vivem em pastas
independentes e conversam por uma API REST. O back-end organiza o fluxo em camadas
(controller → service → repository → entidade JPA), com a segurança isolada em filtros/JWT e
os erros centralizados num `GlobalExceptionHandler`. O front-end espelha essa separação de
responsabilidades: `services` (HTTP), `hooks` (estado), `pages` (telas) e `components` (UI).

- **Back-end:** API REST em Java 21 + Spring Boot 3.5, Spring Data JPA, PostgreSQL, senha com **BCrypt** e rotas protegidas por **JWT** (fluxo Registro → Login → token). Erros padronizados por um `GlobalExceptionHandler` e API documentada via **Swagger**.
- **Front-end:** React 19 + TypeScript + Vite, Tailwind CSS e React Hook Form. Instância Axios central com interceptors (injeta o token; trata 401), rotas protegidas e validação declarativa de formulários.
- **Banco:** PostgreSQL 16, tabela `usuarios` (`id` INT4, `email` único).
- **Design:** injeção de dependência **por construtor** (favorece testabilidade e inversão de dependência), **responsabilidade única por camada**, **DTOs isolando a entidade** nas bordas (a senha nunca é exposta) e repository como **interface Spring Data JPA**.
- **Infra:** **Docker Compose** com build multi-stage e histórico de commits granulares (Conventional Commits); segredos apenas via variáveis de ambiente.

## Funcionalidades

- Cadastro de usuário com validação (nome, e-mail e senha) e login automático.
- Login com e-mail e senha, emitindo **JWT**; rotas de usuários protegidas pelo token.
- Listagem, edição (página dedicada, senha opcional) e exclusão (com confirmação).
- API documentada via **Swagger**; senha sempre em hash, nunca retornada.

## Estrutura do repositório

```
desafio-msys/
├── backend/            # API Java + Spring Boot
├── frontend/           # SPA React + TypeScript
├── docker-compose.yml  # sobe Postgres + back + front
└── .env.example        # variáveis de ambiente (copie para .env)
```

## Como rodar

Há **duas opções**:

## Opção A — Docker (recomendado)

Pré-requisitos: **Docker Desktop** ou Docker Engine + plugin Compose.

```bash
cp .env.example .env       # no Windows (PowerShell): Copy-Item .env.example .env
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

## Testes

```bash
cd backend && ./mvnw test     # back-end (JUnit + Mockito)
cd frontend && npm test       # front-end (Vitest + Testing Library)
```

## Variáveis de ambiente

Todas as variáveis estão documentadas em [`.env.example`](.env.example). Copie para
`.env` e ajuste. O `.env` real **não é versionado**.
