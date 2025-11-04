# 🔌 Documentação da API - Felipao-Fitness

Documentação completa de todos os endpoints tRPC do Felipao-Fitness.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints](#endpoints)
4. [Exemplos de Uso](#exemplos-de-uso)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Rate Limiting](#rate-limiting)

---

## 🎯 Visão Geral

A API do Felipao-Fitness é construída com **tRPC**, um framework que oferece:

- **Type Safety:** Tipos compartilhados entre frontend e backend
- **Autocompletar:** IDE oferece sugestões automáticas
- **Validação:** Zod valida todos os inputs
- **Sem Schema:** Não precisa de OpenAPI/Swagger

### Base URL

```
http://localhost:3000/api/trpc
```

### Autenticação

Todas as requisições são autenticadas via **JWT Cookie** criado durante o login OAuth.

---

## 🔐 Autenticação

### Login (OAuth)

O login é feito via redirecionamento para o portal Manus OAuth.

```typescript
// Frontend
import { getLoginUrl } from '@/const';

window.location.href = getLoginUrl();
```

**Fluxo:**
1. Usuário clica em "Entrar"
2. Redireciona para `https://portal.manus.im/oauth/authorize`
3. Usuário se autentica
4. Callback para `/api/oauth/callback`
5. JWT session criada em cookie
6. Redireciona para dashboard

### Verificar Sessão

```typescript
// Frontend
const { data: user } = trpc.auth.me.useQuery();

// Retorna:
// {
//   id: number;
//   openId: string;
//   name: string | null;
//   email: string | null;
//   role: 'user' | 'admin';
//   createdAt: Date;
// }
```

### Logout

```typescript
// Frontend
const logout = trpc.auth.logout.useMutation();

logout.mutate();
```

---

## 🔌 Endpoints

### Auth Router

#### `auth.me`

Obtém o usuário autenticado atual.

**Tipo:** Query (GET)

**Autenticação:** Não requerida

**Input:** Nenhum

**Output:**
```typescript
{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
} | null
```

**Exemplo:**
```typescript
const { data: user, isLoading } = trpc.auth.me.useQuery();

if (isLoading) return <div>Carregando...</div>;
if (!user) return <div>Não autenticado</div>;

return <div>Bem-vindo, {user.name}</div>;
```

---

#### `auth.logout`

Faz logout do usuário.

**Tipo:** Mutation (POST)

**Autenticação:** Requerida

**Input:** Nenhum

**Output:**
```typescript
{
  success: true;
}
```

**Exemplo:**
```typescript
const logout = trpc.auth.logout.useMutation();

const handleLogout = async () => {
  await logout.mutateAsync();
  window.location.href = '/';
};
```

---

### Profile Router

#### `profile.get`

Obtém o perfil do usuário autenticado.

**Tipo:** Query (GET)

**Autenticação:** Requerida

**Input:** Nenhum

**Output:**
```typescript
{
  id: number;
  userId: number;
  age: number | null;
  weight: number | null;
  height: number | null;
  biotype: 'ectomorfo' | 'mesomorfo' | 'endomorfo' | null;
  experience: 'iniciante' | 'intermediario' | 'avancado' | null;
  objective: 'hipertrofia' | 'emagrecimento' | 'resistencia' | 'funcional' | null;
  daysPerWeek: number | null;
  preferredExerciseType: string | null;
  injuries: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null
```

**Exemplo:**
```typescript
const { data: profile } = trpc.profile.get.useQuery();

return (
  <div>
    <p>Idade: {profile?.age}</p>
    <p>Biotipo: {profile?.biotype}</p>
    <p>Objetivo: {profile?.objective}</p>
  </div>
);
```

---

#### `profile.update`

Atualiza o perfil do usuário.

**Tipo:** Mutation (POST)

**Autenticação:** Requerida

**Input:**
```typescript
{
  age?: number;
  weight?: number;
  height?: number;
  biotype?: 'ectomorfo' | 'mesomorfo' | 'endomorfo';
  experience?: 'iniciante' | 'intermediario' | 'avancado';
  objective?: 'hipertrofia' | 'emagrecimento' | 'resistencia' | 'funcional';
  daysPerWeek?: number;
  preferredExerciseType?: 'funcional' | 'maquinario' | 'peso_livre' | 'cardio' | 'hiit';
  injuries?: string;
}
```

**Output:** Mesmo que `profile.get`

**Exemplo:**
```typescript
const updateProfile = trpc.profile.update.useMutation();

const handleUpdate = async () => {
  await updateProfile.mutateAsync({
    age: 25,
    weight: 75,
    height: 180,
    biotype: 'mesomorfo',
    experience: 'intermediario',
    objective: 'hipertrofia',
    daysPerWeek: 4,
    preferredExerciseType: 'peso_livre',
  });
  
  toast.success('Perfil atualizado!');
};
```

---

### Exercises Router

#### `exercises.list`

Lista exercícios com filtros opcionais.

**Tipo:** Query (GET)

**Autenticação:** Não requerida

**Input:**
```typescript
{
  muscleGroup?: string;      // Ex: "peito", "costas", "pernas"
  exerciseType?: string;     // Ex: "peso_livre", "maquinario"
}
```

**Output:**
```typescript
Array<{
  id: number;
  name: string;
  description: string | null;
  muscleGroup: string | null;
  exerciseType: string | null;
  difficulty: 'facil' | 'medio' | 'dificil' | null;
  instructions: string | null;
  icon: string | null;
  videoUrl: string | null;
  createdAt: Date;
}>
```

**Exemplo:**
```typescript
const { data: exercises } = trpc.exercises.list.useQuery({
  muscleGroup: 'peito',
  exerciseType: 'peso_livre',
});

return (
  <div>
    {exercises?.map((exercise) => (
      <div key={exercise.id}>
        <h3>{exercise.name}</h3>
        <p>{exercise.description}</p>
        <p>Dificuldade: {exercise.difficulty}</p>
      </div>
    ))}
  </div>
);
```

---

### Workouts Router

#### `workouts.list`

Lista todos os treinos do usuário autenticado.

**Tipo:** Query (GET)

**Autenticação:** Requerida

**Input:** Nenhum

**Output:**
```typescript
Array<{
  id: number;
  userId: number;
  name: string;
  description: string | null;
  workoutType: string | null;
  durationMinutes: number | null;
  difficulty: string | null;
  generatedByAI: boolean;
  content: {
    name: string;
    description: string;
    workoutType: string;
    days: Array<{
      dayNumber: number;
      name: string;
      exercises: Array<{
        name: string;
        sets: number;
        reps: string;
        rest: string;
        notes: string;
      }>;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}>
```

**Exemplo:**
```typescript
const { data: workouts } = trpc.workouts.list.useQuery();

return (
  <div>
    {workouts?.map((workout) => (
      <Card key={workout.id}>
        <h3>{workout.name}</h3>
        <p>{workout.description}</p>
        <p>Tipo: {workout.workoutType}</p>
      </Card>
    ))}
  </div>
);
```

---

#### `workouts.generate`

Gera um novo treino personalizado com IA.

**Tipo:** Mutation (POST)

**Autenticação:** Requerida

**Input:**
```typescript
{
  biotype: 'ectomorfo' | 'mesomorfo' | 'endomorfo';
  daysPerWeek: number;  // 1-7
  exerciseType: 'funcional' | 'maquinario' | 'peso_livre' | 'cardio' | 'hiit';
  objective: 'hipertrofia' | 'emagrecimento' | 'resistencia' | 'funcional';
  experience: 'iniciante' | 'intermediario' | 'avancado';
}
```

**Output:**
```typescript
{
  name: string;
  description: string;
  workoutType: string;  // "full_body" | "abc" | "abcde" | "push_pull_legs"
  days: Array<{
    dayNumber: number;
    name: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest: string;
      notes: string;
    }>;
  }>;
}
```

**Exemplo:**
```typescript
const generateWorkout = trpc.workouts.generate.useMutation();

const handleGenerate = async () => {
  const workout = await generateWorkout.mutateAsync({
    biotype: 'mesomorfo',
    daysPerWeek: 4,
    exerciseType: 'peso_livre',
    objective: 'hipertrofia',
    experience: 'intermediario',
  });

  console.log('Treino gerado:', workout);
  // {
  //   name: "Treino ABC - Hipertrofia",
  //   description: "Treino focado em ganho de massa muscular...",
  //   workoutType: "abc",
  //   days: [
  //     {
  //       dayNumber: 1,
  //       name: "Dia A - Peito e Tríceps",
  //       exercises: [
  //         {
  //           name: "Supino Reto",
  //           sets: 4,
  //           reps: "8-10",
  //           rest: "90-120 segundos",
  //           notes: "Mantenha o peito elevado..."
  //         },
  //         ...
  //       ]
  //     },
  //     ...
  //   ]
  // }
};
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Fluxo Completo de Usuário

```typescript
// 1. Verificar se está autenticado
const { data: user } = trpc.auth.me.useQuery();

if (!user) {
  // Redirecionar para login
  window.location.href = getLoginUrl();
  return;
}

// 2. Obter perfil
const { data: profile } = trpc.profile.get.useQuery();

// 3. Se não tem perfil, mostrar formulário
if (!profile?.age) {
  return <ProfileForm />;
}

// 4. Gerar treino
const generateWorkout = trpc.workouts.generate.useMutation();

const handleGenerateWorkout = async () => {
  const workout = await generateWorkout.mutateAsync({
    biotype: profile.biotype,
    daysPerWeek: profile.daysPerWeek,
    exerciseType: profile.preferredExerciseType,
    objective: profile.objective,
    experience: profile.experience,
  });

  console.log('Treino gerado:', workout);
};

// 5. Listar treinos anteriores
const { data: workouts } = trpc.workouts.list.useQuery();

return (
  <div>
    <h1>Bem-vindo, {user.name}</h1>
    <button onClick={handleGenerateWorkout}>Gerar Novo Treino</button>
    <div>
      {workouts?.map((w) => <WorkoutCard key={w.id} workout={w} />)}
    </div>
  </div>
);
```

### Exemplo 2: Usar com React Query

```typescript
// Prefetch dados
const queryClient = useQueryClient();

const handlePrefetch = async () => {
  await queryClient.prefetchQuery({
    queryKey: ['profile.get'],
    queryFn: () => trpc.profile.get.query(),
  });
};

// Invalidar cache após atualização
const updateProfile = trpc.profile.update.useMutation({
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['profile.get'] });
  },
});
```

### Exemplo 3: Tratamento de Erros

```typescript
const generateWorkout = trpc.workouts.generate.useMutation({
  onSuccess: (data) => {
    toast.success('Treino gerado com sucesso!');
  },
  onError: (error) => {
    toast.error(`Erro: ${error.message}`);
  },
});

try {
  await generateWorkout.mutateAsync(params);
} catch (error) {
  console.error('Erro ao gerar treino:', error);
}
```

---

## ⚠️ Tratamento de Erros

### Códigos de Erro tRPC

| Código | Descrição |
|--------|-----------|
| `UNAUTHORIZED` | Não autenticado |
| `FORBIDDEN` | Sem permissão |
| `NOT_FOUND` | Recurso não encontrado |
| `BAD_REQUEST` | Entrada inválida |
| `INTERNAL_SERVER_ERROR` | Erro do servidor |

### Exemplo de Tratamento

```typescript
const mutation = trpc.profile.update.useMutation({
  onError: (error) => {
    if (error.code === 'UNAUTHORIZED') {
      // Redirecionar para login
      window.location.href = getLoginUrl();
    } else if (error.code === 'BAD_REQUEST') {
      // Mostrar erro de validação
      toast.error('Dados inválidos');
    } else {
      // Erro genérico
      toast.error('Algo deu errado');
    }
  },
});
```

---

## 🚦 Rate Limiting

Recomendações de rate limiting em produção:

- **Auth endpoints:** 5 requisições por minuto por IP
- **Workout generation:** 10 requisições por hora por usuário
- **Outros endpoints:** 100 requisições por minuto por usuário

---

## 📚 Recursos Adicionais

- [tRPC Documentation](https://trpc.io)
- [React Query Documentation](https://tanstack.com/query)
- [Zod Validation](https://zod.dev)

---

**Desenvolvido com ❤️ para facilitar a integração com o Felipao-Fitness**
