# 👨‍💻 Guia de Desenvolvimento - Felipao-Fitness

Um guia completo para desenvolvedores que desejam contribuir ou estender o Felipao-Fitness.

---

## 📋 Índice

1. [Setup do Ambiente](#setup-do-ambiente)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
4. [Adicionando Novas Funcionalidades](#adicionando-novas-funcionalidades)
5. [Testes](#testes)
6. [Debugging](#debugging)
7. [Melhores Práticas](#melhores-práticas)
8. [Troubleshooting](#troubleshooting)

---

## 🛠️ Setup do Ambiente

### Pré-requisitos

- **Node.js:** 22.0.0 ou superior
- **pnpm:** 9.0.0 ou superior
- **Git:** 2.30.0 ou superior
- **MySQL:** 8.0.0 ou superior (ou TiDB)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/MarcioGil/Felipao-Fitness.git
cd Felipao-Fitness
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure o banco de dados**
```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env

# Edite com suas credenciais MySQL
DATABASE_URL=mysql://user:password@localhost:3306/felipao_fitness
JWT_SECRET=seu_secret_aleatorio_aqui
```

4. **Execute as migrações**
```bash
pnpm db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
felipao-fitness/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                  # Páginas principais
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Profile.tsx         # Perfil do usuário
│   │   │   ├── WorkoutGenerator.tsx # Gerador de treinos
│   │   │   └── NotFound.tsx        # Página 404
│   │   ├── components/             # Componentes reutilizáveis
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── AIChatBox.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── hooks/                 # Custom React hooks
│   │   │   └── useAuth.ts         # Hook de autenticação
│   │   ├── contexts/              # React contexts
│   │   │   └── ThemeContext.tsx   # Contexto de tema
│   │   ├── lib/                   # Utilitários
│   │   │   ├── trpc.ts            # Cliente tRPC
│   │   │   └── utils.ts           # Funções auxiliares
│   │   ├── App.tsx                # Componente raiz
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Estilos globais
│   ├── public/                     # Assets estáticos
│   └── index.html                 # HTML principal
│
├── server/                          # Backend Express
│   ├── routers.ts                 # Procedimentos tRPC
│   ├── db.ts                      # Query helpers
│   └── _core/                     # Configuração interna
│       ├── index.ts               # Setup do servidor
│       ├── trpc.ts                # Configuração tRPC
│       ├── context.ts             # Contexto de requisição
│       ├── llm.ts                 # Integração OpenAI
│       ├── cookies.ts             # Gerenciamento de sessão
│       ├── env.ts                 # Variáveis de ambiente
│       └── notification.ts        # Sistema de notificações
│
├── drizzle/                         # Schema e migrations
│   ├── schema.ts                  # Definição das tabelas
│   └── migrations/                # Histórico de migrações
│
├── shared/                          # Código compartilhado
│   └── const.ts                   # Constantes globais
│
├── docs/                            # Documentação
│   ├── ARCHITECTURE.md            # Arquitetura do projeto
│   └── DEVELOPMENT.md             # Este arquivo
│
├── package.json                    # Dependências
├── tsconfig.json                   # Configuração TypeScript
├── vite.config.ts                 # Configuração Vite
├── drizzle.config.ts              # Configuração Drizzle
├── README.md                       # Documentação principal
└── userGuide.md                   # Guia do usuário
```

---

## 🔄 Workflow de Desenvolvimento

### 1. Criar uma Nova Branch

```bash
git checkout -b feature/nova-funcionalidade
```

**Convenção de nomes:**
- `feature/` - Nova funcionalidade
- `bugfix/` - Correção de bug
- `docs/` - Documentação
- `refactor/` - Refatoração de código

### 2. Fazer Alterações

Edite os arquivos necessários seguindo os padrões do projeto.

### 3. Testar Localmente

```bash
# Inicie o servidor de desenvolvimento
pnpm dev

# Verifique se há erros TypeScript
pnpm type-check

# Execute testes (se houver)
pnpm test
```

### 4. Commit das Alterações

```bash
git add .
git commit -m "feat: descrição clara da mudança"
```

**Convenção de commits:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

### 5. Push e Pull Request

```bash
git push origin feature/nova-funcionalidade
```

Abra um Pull Request no GitHub com descrição clara.

---

## ➕ Adicionando Novas Funcionalidades

### Exemplo: Adicionar Nova Página

#### 1. Criar o Componente da Página

```typescript
// client/src/pages/Dashboard.tsx
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: workouts } = trpc.workouts.list.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4">
      <div className="container max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workouts?.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{workout.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### 2. Adicionar Rota no App.tsx

```typescript
// client/src/App.tsx
import Dashboard from "./pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/workout-generator"} component={WorkoutGenerator} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}
```

#### 3. Adicionar Navegação

Atualize o header ou menu para incluir link para a nova página.

### Exemplo: Adicionar Novo Procedimento tRPC

#### 1. Criar Query Helper no db.ts

```typescript
// server/db.ts
export async function getWorkoutById(userId: number, workoutId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.id, workoutId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}
```

#### 2. Criar Procedimento tRPC

```typescript
// server/routers.ts
workouts: router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return getUserWorkouts(ctx.user.id);
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return getWorkoutById(ctx.user.id, input.id);
    }),
  generate: protectedProcedure
    .input(z.object({
      biotype: z.enum(["ectomorfo", "mesomorfo", "endomorfo"]),
      daysPerWeek: z.number().min(1).max(7),
      exerciseType: z.enum(["funcional", "maquinario", "peso_livre", "cardio", "hiit"]),
      objective: z.enum(["hipertrofia", "emagrecimento", "resistencia", "funcional"]),
      experience: z.enum(["iniciante", "intermediario", "avancado"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Lógica de geração com IA
    }),
}),
```

#### 3. Usar no Frontend

```typescript
// client/src/pages/WorkoutDetail.tsx
const { data: workout } = trpc.workouts.getById.useQuery({ id: 1 });
```

---

## 🧪 Testes

### Estrutura de Testes

```
__tests__/
├── unit/
│   ├── db.test.ts
│   └── utils.test.ts
├── integration/
│   ├── auth.test.ts
│   └── workouts.test.ts
└── e2e/
    └── user-flow.test.ts
```

### Executar Testes

```bash
# Todos os testes
pnpm test

# Testes em watch mode
pnpm test:watch

# Com cobertura
pnpm test:coverage
```

### Exemplo de Teste

```typescript
// __tests__/unit/db.test.ts
import { describe, it, expect } from 'vitest';
import { getUserProfile } from '../../server/db';

describe('getUserProfile', () => {
  it('should return user profile', async () => {
    const profile = await getUserProfile(1);
    expect(profile).toBeDefined();
    expect(profile?.userId).toBe(1);
  });

  it('should return null for non-existent user', async () => {
    const profile = await getUserProfile(999);
    expect(profile).toBeNull();
  });
});
```

---

## 🐛 Debugging

### VSCode Debug Configuration

Crie `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/server/_core/index.ts",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

### Console Logging

```typescript
// Logging útil
console.log('Valor:', value);
console.error('Erro:', error);
console.table(data);
console.time('operation');
// ... código
console.timeEnd('operation');
```

### React DevTools

Instale a extensão React DevTools no navegador para inspecionar componentes.

### tRPC DevTools

Acesse `http://localhost:3000/api/trpc` para ver as chamadas tRPC.

---

## ✅ Melhores Práticas

### 1. TypeScript

**Sempre use tipos explícitos:**
```typescript
// ❌ Ruim
const user = getUserProfile(1);

// ✅ Bom
const user: UserProfile | null = await getUserProfile(1);
```

### 2. Componentes React

**Mantenha componentes pequenos e focados:**
```typescript
// ❌ Ruim - Componente muito grande
function HomePage() {
  // 500 linhas de código
}

// ✅ Bom - Componentes pequenos e reutilizáveis
function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}
```

### 3. Validação

**Sempre valide entrada com Zod:**
```typescript
const schema = z.object({
  age: z.number().min(18).max(120),
  email: z.string().email(),
});

const result = schema.parse(input);
```

### 4. Tratamento de Erros

**Use try-catch apropriadamente:**
```typescript
try {
  const result = await generateWorkout(params);
  return result;
} catch (error) {
  console.error('Erro ao gerar treino:', error);
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Falha ao gerar treino',
  });
}
```

### 5. Performance

**Use useMemo para computações pesadas:**
```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 6. Acessibilidade

**Sempre inclua labels e ARIA attributes:**
```typescript
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-label="Email do usuário" />
```

---

## 🔧 Troubleshooting

### Erro: "Database connection failed"

```bash
# Verifique a variável DATABASE_URL
echo $DATABASE_URL

# Teste a conexão MySQL
mysql -u user -p -h localhost

# Reinicie o servidor
pnpm db:push
```

### Erro: "Module not found"

```bash
# Limpe node_modules e reinstale
rm -rf node_modules
pnpm install
```

### Erro: "TypeScript errors"

```bash
# Verifique erros de tipo
pnpm type-check

# Corrija os erros mostrados
```

### Erro: "Port 3000 already in use"

```bash
# Encontre o processo usando a porta
lsof -i :3000

# Mate o processo
kill -9 <PID>

# Ou use uma porta diferente
PORT=3001 pnpm dev
```

### Erro: "OAuth callback failed"

1. Verifique `VITE_APP_ID` no `.env`
2. Verifique `OAUTH_SERVER_URL`
3. Verifique se a URL de callback está registrada no Manus

---

## 📚 Recursos Adicionais

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [tRPC Documentation](https://trpc.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)

---

**Feliz desenvolvimento! 🚀**
