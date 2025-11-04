# 🏗️ Arquitetura do Felipao-Fitness

Uma documentação técnica completa sobre a arquitetura, design patterns e decisões arquiteturais do projeto Felipao-Fitness.

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Camadas da Aplicação](#camadas-da-aplicação)
3. [Fluxo de Dados](#fluxo-de-dados)
4. [Componentes Principais](#componentes-principais)
5. [Banco de Dados](#banco-de-dados)
6. [Segurança](#segurança)
7. [Performance](#performance)
8. [Padrões de Design](#padrões-de-design)

---

## 🎯 Visão Geral da Arquitetura

O **Felipao-Fitness** utiliza uma arquitetura **moderna, escalável e type-safe** baseada em:

- **Frontend:** React 19 com TypeScript
- **Backend:** Express.js com tRPC
- **Banco de Dados:** MySQL com Drizzle ORM
- **IA:** Integração com OpenAI API
- **Autenticação:** OAuth via Manus

```
┌─────────────────────────────────────────────────────────────┐
│                     Cliente (Browser)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React 19 + TypeScript + Tailwind CSS + shadcn/ui   │   │
│  │  - Pages (Home, Profile, WorkoutGenerator)          │   │
│  │  - Components (Reusable UI)                         │   │
│  │  - Hooks (Custom React Hooks)                       │   │
│  │  - Contexts (State Management)                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (tRPC)
┌─────────────────────────────────────────────────────────────┐
│                   Servidor (Node.js)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express.js + tRPC 11                               │   │
│  │  - Auth Router (OAuth, Login, Logout)               │   │
│  │  - Profile Router (Get, Update)                     │   │
│  │  - Exercises Router (List)                          │   │
│  │  - Workouts Router (List, Generate with AI)         │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Camada de Negócio                                   │   │
│  │  - Query Helpers (db.ts)                            │   │
│  │  - LLM Integration (invokeLLM)                       │   │
│  │  - Validation (Zod)                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (SQL)
┌─────────────────────────────────────────────────────────────┐
│                   Banco de Dados                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MySQL + Drizzle ORM                                │   │
│  │  - users                                            │   │
│  │  - user_profiles                                    │   │
│  │  - exercises                                        │   │
│  │  - workouts                                         │   │
│  │  - workout_sessions                                 │   │
│  │  - progress_tracking                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Camadas da Aplicação

### 1. Camada de Apresentação (Frontend)

**Responsabilidades:**
- Renderizar interface do usuário
- Capturar entrada do usuário
- Exibir dados de forma intuitiva
- Gerenciar estado local

**Tecnologias:**
- React 19 - Framework UI
- TypeScript - Type safety
- Tailwind CSS 4 - Styling
- shadcn/ui - Componentes base
- Lucide React - Ícones
- wouter - Roteamento

**Estrutura:**
```
client/
├── src/
│   ├── pages/              # Páginas principais
│   │   ├── Home.tsx        # Landing page
│   │   ├── Profile.tsx     # Perfil do usuário
│   │   └── WorkoutGenerator.tsx
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # shadcn/ui components
│   │   ├── DashboardLayout.tsx
│   │   └── AIChatBox.tsx
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilitários
│   │   └── trpc.ts        # tRPC client
│   ├── App.tsx            # Componente raiz
│   └── main.tsx           # Entry point
└── public/                # Assets estáticos
```

### 2. Camada de API (Backend)

**Responsabilidades:**
- Processar requisições do cliente
- Validar dados de entrada
- Executar lógica de negócio
- Integrar com IA e banco de dados
- Gerenciar autenticação

**Tecnologias:**
- Express.js 4 - Framework web
- tRPC 11 - Type-safe RPC
- Zod - Validação de schema
- OpenAI API - Geração de treinos

**Routers tRPC:**

```typescript
// Auth Router
auth.me.useQuery()              // Obter usuário atual
auth.logout.useMutation()       // Fazer logout

// Profile Router
profile.get.useQuery()          // Obter perfil
profile.update.useMutation()    // Atualizar perfil

// Exercises Router
exercises.list.useQuery()       // Listar exercícios

// Workouts Router
workouts.list.useQuery()        // Listar treinos
workouts.generate.useMutation() // Gerar com IA
```

**Estrutura:**
```
server/
├── routers.ts             # Definição de procedimentos tRPC
├── db.ts                  # Query helpers
├── _core/
│   ├── index.ts          # Setup do servidor
│   ├── trpc.ts           # Configuração tRPC
│   ├── context.ts        # Contexto de requisição
│   ├── llm.ts            # Integração com OpenAI
│   ├── cookies.ts        # Gerenciamento de sessão
│   └── env.ts            # Variáveis de ambiente
└── storage.ts            # S3 helpers
```

### 3. Camada de Dados (Banco de Dados)

**Responsabilidades:**
- Armazenar dados persistentes
- Garantir integridade referencial
- Otimizar queries

**Tecnologias:**
- MySQL - Banco relacional
- Drizzle ORM - Query builder type-safe

**Tabelas:**

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários autenticados |
| `user_profiles` | Perfil personalizado de cada usuário |
| `exercises` | Biblioteca de exercícios |
| `workouts` | Treinos gerados |
| `workout_sessions` | Sessões de treino realizadas |
| `progress_tracking` | Rastreamento de progresso |

---

## 🔀 Fluxo de Dados

### Fluxo 1: Autenticação do Usuário

```
1. Usuário clica em "Entrar"
   ↓
2. Redireciona para Manus OAuth Portal
   ↓
3. Usuário se autentica
   ↓
4. Callback para /api/oauth/callback
   ↓
5. Servidor cria/atualiza usuário no BD
   ↓
6. Sessão JWT criada (cookie seguro)
   ↓
7. Redireciona para dashboard
```

### Fluxo 2: Atualizar Perfil

```
1. Usuário preenche formulário de perfil
   ↓
2. Frontend valida dados com Zod
   ↓
3. Envia via tRPC: profile.update.useMutation()
   ↓
4. Backend valida novamente (Zod)
   ↓
5. Atualiza user_profiles no BD
   ↓
6. Retorna perfil atualizado
   ↓
7. Frontend atualiza estado (React Query)
```

### Fluxo 3: Gerar Treino com IA

```
1. Usuário seleciona parâmetros (biotipo, dias, etc)
   ↓
2. Clica em "Gerar Treino"
   ↓
3. Frontend envia: workouts.generate.useMutation()
   ↓
4. Backend valida entrada (Zod)
   ↓
5. Constrói prompt para OpenAI
   ↓
6. Chama invokeLLM() com JSON schema
   ↓
7. OpenAI retorna treino estruturado
   ↓
8. Backend valida resposta JSON
   ↓
9. Armazena no BD (workouts table)
   ↓
10. Retorna treino para frontend
    ↓
11. Frontend exibe treino com animações
```

---

## 🧩 Componentes Principais

### Frontend Components

#### Home.tsx
- **Propósito:** Landing page principal
- **Funcionalidades:**
  - Apresentação do app
  - Call-to-action para login
  - Demonstração de features
  - Footer com links

#### Profile.tsx
- **Propósito:** Gerenciar perfil do usuário
- **Funcionalidades:**
  - Formulário de dados pessoais
  - Seleção de biotipo
  - Definição de objetivos
  - Registro de lesões

#### WorkoutGenerator.tsx
- **Propósito:** Gerar treinos com IA
- **Funcionalidades:**
  - Formulário de parâmetros
  - Integração com IA
  - Exibição de treino gerado
  - Opção de salvar

### Backend Procedures

#### profile.get
```typescript
// Retorna perfil do usuário autenticado
Input: void
Output: UserProfile | null
```

#### profile.update
```typescript
// Atualiza perfil do usuário
Input: {
  age?: number
  weight?: number
  height?: number
  biotype?: "ectomorfo" | "mesomorfo" | "endomorfo"
  experience?: "iniciante" | "intermediario" | "avancado"
  objective?: "hipertrofia" | "emagrecimento" | "resistencia" | "funcional"
  daysPerWeek?: number
  preferredExerciseType?: string
  injuries?: string
}
Output: UserProfile
```

#### workouts.generate
```typescript
// Gera treino com IA
Input: {
  biotype: "ectomorfo" | "mesomorfo" | "endomorfo"
  daysPerWeek: number (1-7)
  exerciseType: "funcional" | "maquinario" | "peso_livre" | "cardio" | "hiit"
  objective: "hipertrofia" | "emagrecimento" | "resistencia" | "funcional"
  experience: "iniciante" | "intermediario" | "avancado"
}
Output: {
  name: string
  description: string
  workoutType: string
  days: Array<{
    dayNumber: number
    name: string
    exercises: Array<{
      name: string
      sets: number
      reps: string
      rest: string
      notes: string
    }>
  }>
}
```

---

## 🗄️ Banco de Dados

### Schema Detalhado

#### users
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### user_profiles
```sql
CREATE TABLE user_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT UNIQUE NOT NULL,
  age INT,
  weight INT,
  height INT,
  biotype ENUM('ectomorfo', 'mesomorfo', 'endomorfo'),
  experience ENUM('iniciante', 'intermediario', 'avancado'),
  objective ENUM('hipertrofia', 'emagrecimento', 'resistencia', 'funcional'),
  daysPerWeek INT,
  preferredExerciseType VARCHAR(50),
  injuries JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

#### exercises
```sql
CREATE TABLE exercises (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  muscleGroup VARCHAR(100),
  exerciseType VARCHAR(50),
  difficulty ENUM('facil', 'medio', 'dificil'),
  instructions TEXT,
  icon VARCHAR(255),
  videoUrl VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### workouts
```sql
CREATE TABLE workouts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  workoutType VARCHAR(50),
  durationMinutes INT,
  difficulty VARCHAR(50),
  generatedByAI BOOLEAN DEFAULT TRUE,
  content JSON NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

#### workout_sessions
```sql
CREATE TABLE workout_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  workoutId INT,
  date DATE NOT NULL,
  durationMinutes INT,
  exercisesCompleted INT,
  totalExercises INT,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workoutId) REFERENCES workouts(id) ON DELETE SET NULL
);
```

#### progress_tracking
```sql
CREATE TABLE progress_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  date DATE NOT NULL,
  weight INT,
  bodyFat DECIMAL(5,2),
  measurements JSON,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Relacionamentos

```
users (1) ──── (N) user_profiles
users (1) ──── (N) workouts
users (1) ──── (N) workout_sessions
users (1) ──── (N) progress_tracking
workouts (1) ──── (N) workout_sessions
```

---

## 🔐 Segurança

### Autenticação

**Método:** OAuth 2.0 via Manus
- Usuário redireciona para portal Manus
- Manus retorna `openId` único
- Servidor cria/atualiza usuário
- JWT session criada em cookie seguro

**Implementação:**
```typescript
// server/_core/context.ts
export async function createContext(opts: CreateContextOptions) {
  const user = await getUserFromCookie(opts.req);
  return { user, req: opts.req, res: opts.res };
}

// server/routers.ts
const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx });
});
```

### Validação de Entrada

**Zod Schemas** validam todos os inputs:
```typescript
const updateProfileSchema = z.object({
  age: z.number().optional(),
  weight: z.number().optional(),
  biotype: z.enum(['ectomorfo', 'mesomorfo', 'endomorfo']).optional(),
  // ... mais campos
});
```

### Proteção de Dados

- **HTTPS:** Todas as comunicações criptografadas
- **Cookies Seguros:** `HttpOnly`, `Secure`, `SameSite`
- **CORS:** Configurado para origem específica
- **Rate Limiting:** Recomendado em produção
- **SQL Injection:** Prevenido via Drizzle ORM

---

## ⚡ Performance

### Otimizações Frontend

1. **Code Splitting:** Lazy loading de páginas com wouter
2. **Image Optimization:** Compressão de assets
3. **Caching:** React Query cache automático
4. **Memoization:** useMemo para computações pesadas

### Otimizações Backend

1. **Query Optimization:** Índices no BD
2. **Connection Pooling:** Reutilização de conexões
3. **Caching:** Redis (opcional)
4. **Pagination:** Para grandes datasets

### Métricas

- **FCP (First Contentful Paint):** < 1.5s
- **LCP (Largest Contentful Paint):** < 2.5s
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTI (Time to Interactive):** < 3.5s

---

## 🎨 Padrões de Design

### 1. Component Pattern

**Componentes reutilizáveis** com props bem definidas:
```typescript
interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, description, children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg border", className)}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
```

### 2. Hook Pattern

**Custom hooks** para lógica reutilizável:
```typescript
function useAuth() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const logout = trpc.auth.logout.useMutation();
  
  return { user, isLoading, logout };
}
```

### 3. Router Pattern

**Routers tRPC** organizados por domínio:
```typescript
export const appRouter = router({
  auth: router({ me, logout }),
  profile: router({ get, update }),
  workouts: router({ list, generate }),
});
```

### 4. Middleware Pattern

**Middlewares tRPC** para cross-cutting concerns:
```typescript
const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx });
});
```

---

## 📈 Escalabilidade

### Horizontal Scaling

- **Stateless Backend:** Sem sessões em memória
- **Database Replication:** MySQL replication
- **Load Balancing:** Nginx/HAProxy
- **CDN:** Para assets estáticos

### Vertical Scaling

- **Database Optimization:** Índices, query optimization
- **Caching Layer:** Redis para dados frequentes
- **Async Processing:** Bull queues para jobs pesados

### Monitoramento

- **Logging:** Winston/Pino
- **Error Tracking:** Sentry
- **Performance Monitoring:** New Relic/DataDog
- **Uptime Monitoring:** UptimeRobot

---

## 🚀 Deployment

### Ambiente de Desenvolvimento

```bash
pnpm install
pnpm db:push
pnpm dev
```

### Ambiente de Produção

```bash
pnpm build
NODE_ENV=production node dist/index.js
```

### Variáveis de Ambiente

```env
NODE_ENV=production
DATABASE_URL=mysql://...
JWT_SECRET=seu_secret_seguro
VITE_APP_ID=seu_app_id
```

---

## 📚 Referências

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Desenvolvido com ❤️ usando as melhores práticas de engenharia de software**
