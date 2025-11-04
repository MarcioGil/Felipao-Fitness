# Felipao-Fitness 💪

Um **aplicativo de academia inteligente com IA** que gera treinos personalizados baseados em seu biotipo, objetivos e disponibilidade. Desenvolvido com as tecnologias mais modernas e melhores práticas de desenvolvimento.

![Felipao-Fitness](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-22-green)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎯 Visão Geral

**Felipao-Fitness** é uma plataforma de fitness revolucionária que utiliza inteligência artificial para criar treinos 100% personalizados. Diferente de aplicativos genéricos, o Felipao-Fitness analisa suas características físicas, objetivos e disponibilidade para gerar um plano de treino único e eficaz.

### Principais Diferenciais

- **IA Avançada**: Treinos gerados por inteligência artificial em tempo real
- **100% Personalizado**: Adaptado ao seu biotipo, objetivos e disponibilidade
- **Design Moderno**: Interface intuitiva e atraente
- **Full-Stack Profissional**: Desenvolvido com as melhores práticas de engenharia
- **Seguro e Privado**: Autenticação OAuth e dados criptografados
- **Escalável**: Arquitetura preparada para crescimento

---

## ✨ Funcionalidades

### 🏠 Página Inicial
- Landing page atraente com apresentação dos recursos
- Call-to-action para criar conta
- Demonstração dos principais benefícios

### 👤 Perfil do Usuário
- Coleta de dados pessoais (idade, peso, altura)
- Seleção de biotipo corporal (ectomorfo, mesomorfo, endomorfo)
- Definição de objetivos (hipertrofia, emagrecimento, resistência, funcional)
- Nível de experiência (iniciante, intermediário, avançado)
- Disponibilidade de dias por semana
- Tipo de exercício preferido
- Registro de lesões e limitações

### 🤖 Gerador de Treinos com IA
- Geração inteligente de treinos personalizados
- Estrutura completa com exercícios, séries, repetições e descanso
- Notas técnicas para cada exercício
- Adaptação automática ao nível de experiência
- Múltiplas variações de treino

### 📊 Acompanhamento de Progresso
- Registro de sessões de treino
- Rastreamento de peso e medidas
- Gráficos e estatísticas de desempenho
- Histórico completo de treinos

### 📚 Biblioteca de Exercícios
- Mais de 500 exercícios catalogados
- Descrição técnica de cada exercício
- Ícones e ilustrações
- Grupos musculares alvo
- Variações de exercícios

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework UI moderno
- **TypeScript** - Type safety e melhor DX
- **Tailwind CSS 4** - Styling rápido e consistente
- **shadcn/ui** - Componentes reutilizáveis
- **Lucide React** - Ícones de alta qualidade
- **wouter** - Roteamento leve
- **tRPC** - Type-safe RPC client

### Backend
- **Node.js 22** - Runtime JavaScript
- **Express 4** - Framework web minimalista
- **tRPC 11** - Type-safe API
- **Drizzle ORM** - Type-safe database queries

### Banco de Dados
- **MySQL/TiDB** - Banco de dados relacional
- **Drizzle Kit** - Migrations e schema management

### IA & APIs
- **OpenAI API** - Geração de treinos com IA
- **Manus OAuth** - Autenticação segura
- **Manus Built-in APIs** - Notificações e storage

### DevOps & Deployment
- **Vite** - Build tool rápido
- **pnpm** - Package manager eficiente
- **Docker** - Containerização (opcional)

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js 22+
- pnpm 9+
- Conta Manus (para OAuth e APIs)

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

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas credenciais
nano .env
```

Variáveis necessárias:
```env
DATABASE_URL=mysql://user:password@localhost:3306/felipao_fitness
JWT_SECRET=seu_secret_aqui
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

4. **Execute as migrações do banco de dados**
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
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas principais
│   │   │   ├── Home.tsx      # Landing page
│   │   │   ├── Profile.tsx   # Perfil do usuário
│   │   │   └── WorkoutGenerator.tsx  # Gerador de treinos
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── lib/              # Utilitários e helpers
│   │   ├── App.tsx           # Componente raiz
│   │   └── index.css         # Estilos globais
│   └── public/               # Assets estáticos
│
├── server/                    # Backend Express
│   ├── routers.ts            # Procedimentos tRPC
│   ├── db.ts                 # Query helpers
│   └── _core/                # Configuração interna
│
├── drizzle/                   # Schema e migrations
│   ├── schema.ts             # Definição das tabelas
│   └── migrations/           # Histórico de migrações
│
├── shared/                    # Código compartilhado
│   └── const.ts              # Constantes
│
├── package.json              # Dependências
├── tsconfig.json             # Configuração TypeScript
├── vite.config.ts            # Configuração Vite
└── drizzle.config.ts         # Configuração Drizzle
```

---

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

#### `users`
Usuários autenticados do sistema
```sql
- id (PK)
- openId (UNIQUE) - ID do OAuth
- name
- email
- role (admin | user)
- createdAt, updatedAt, lastSignedIn
```

#### `user_profiles`
Perfil personalizado de cada usuário
```sql
- id (PK)
- userId (FK, UNIQUE)
- age, weight, height
- biotype (ectomorfo | mesomorfo | endomorfo)
- experience (iniciante | intermediario | avancado)
- objective (hipertrofia | emagrecimento | resistencia | funcional)
- daysPerWeek
- preferredExerciseType
- injuries (JSON)
```

#### `exercises`
Biblioteca de exercícios
```sql
- id (PK)
- name
- description
- muscleGroup
- exerciseType
- difficulty
- instructions
- icon, videoUrl
```

#### `workouts`
Treinos gerados
```sql
- id (PK)
- userId (FK)
- name, description
- workoutType (full_body | abc | abcde | push_pull_legs)
- durationMinutes
- difficulty
- generatedByAI
- content (JSON com estrutura do treino)
```

#### `workout_sessions`
Sessões de treino realizadas
```sql
- id (PK)
- userId (FK)
- workoutId (FK)
- date
- durationMinutes
- exercisesCompleted, totalExercises
- notes
```

#### `progress_tracking`
Rastreamento de progresso
```sql
- id (PK)
- userId (FK)
- date
- weight, bodyFat
- measurements (JSON)
- notes
```

---

## 🔌 API Endpoints (tRPC)

### Autenticação
```typescript
auth.me.useQuery()           // Obter usuário atual
auth.logout.useMutation()    // Fazer logout
```

### Perfil
```typescript
profile.get.useQuery()       // Obter perfil do usuário
profile.update.useMutation() // Atualizar perfil
```

### Exercícios
```typescript
exercises.list.useQuery({
  muscleGroup?: string
  exerciseType?: string
})
```

### Treinos
```typescript
workouts.list.useQuery()     // Listar treinos do usuário
workouts.generate.useMutation({
  biotype,
  daysPerWeek,
  exerciseType,
  objective,
  experience
})
```

---

## 🎨 Design System

### Paleta de Cores
- **Primária**: Indigo (#6366F1) - Confiança e energia
- **Secundária**: Emerald (#10B981) - Saúde e crescimento
- **Destaque**: Amber (#F59E0B) - Motivação e ação
- **Fundo**: Branco (#FFFFFF) - Clareza
- **Texto**: Cinza Escuro (#1F2937) - Legibilidade

### Tipografia
- **Headings**: Poppins (700) - Impacto visual
- **Body**: Inter (400-600) - Legibilidade

### Componentes
Todos os componentes utilizam shadcn/ui com customizações do design system.

---

## 🔐 Segurança

- **Autenticação OAuth** via Manus
- **JWT Sessions** com cookies seguros
- **Type Safety** com TypeScript
- **Validação de Input** com Zod
- **CORS** configurado corretamente
- **Rate Limiting** (recomendado em produção)

---

## 📊 Monitoramento e Analytics

O projeto está configurado para:
- Rastreamento de eventos de usuário
- Análise de uso do aplicativo
- Monitoramento de performance
- Logs de erro centralizados

---

## 🚢 Deployment

### Deploy na Plataforma Manus
```bash
# Criar checkpoint
pnpm build

# Publicar via UI Management
# Acesse o painel de controle e clique em "Publish"
```

### Deploy em Produção
```bash
# Build
pnpm build

# Iniciar servidor
node dist/index.js
```

Variáveis de ambiente necessárias em produção:
```env
NODE_ENV=production
DATABASE_URL=mysql://...
JWT_SECRET=seu_secret_seguro
VITE_APP_ID=seu_app_id
```

---

## 📝 Documentação Adicional

- [Guia de Desenvolvimento](./docs/DEVELOPMENT.md)
- [Arquitetura do Projeto](./docs/ARCHITECTURE.md)
- [Contribuindo](./CONTRIBUTING.md)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Desenvolvedor

**Márcio Gil**
- GitHub: [@MarcioGil](https://github.com/MarcioGil)
- Email: seu_email@example.com

---

## 🙏 Agradecimentos

- Manus AI - Plataforma de desenvolvimento
- OpenAI - API de IA para geração de treinos
- React & TypeScript communities
- shadcn/ui - Componentes reutilizáveis

---

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

---

**Desenvolvido com ❤️ para transformar vidas através do fitness**
