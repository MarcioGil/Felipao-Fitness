import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Dumbbell, TrendingUp, Brain, BarChart3, Zap, Users } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Dumbbell className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-foreground/60">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="container flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">Felipao-Fitness</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/60">Bem-vindo, {user.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-12">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Seu Personal Trainer <span className="text-gradient">com IA</span>
                </h2>
                <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                  Treinos personalizados gerados por inteligência artificial, adaptados ao seu biotipo, 
                  objetivos e disponibilidade. Acompanhe seu progresso em tempo real.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Começar Agora
                  </Button>
                  <Button size="lg" variant="outline">
                    Ver Recursos
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-card rounded-2xl p-8 border border-border/50 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                      <Brain className="w-6 h-6 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">IA Avançada</p>
                        <p className="text-sm text-foreground/60">Treinos personalizados</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-secondary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Progresso</p>
                        <p className="text-sm text-foreground/60">Acompanhamento em tempo real</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-lg">
                      <Zap className="w-6 h-6 text-accent flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Rápido</p>
                        <p className="text-sm text-foreground/60">Resultados em semanas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Recursos Principais</h3>
              <p className="text-foreground/60 max-w-2xl mx-auto">
                Tudo que você precisa para alcançar seus objetivos de fitness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: "Gerador de Treinos com IA",
                  description: "Treinos personalizados baseados em seu biotipo, objetivos e disponibilidade",
                  color: "primary",
                },
                {
                  icon: BarChart3,
                  title: "Acompanhamento de Progresso",
                  description: "Gráficos e estatísticas detalhadas do seu desenvolvimento",
                  color: "secondary",
                },
                {
                  icon: Dumbbell,
                  title: "Biblioteca de Exercícios",
                  description: "Mais de 500 exercícios com ilustrações e técnicas corretas",
                  color: "accent",
                },
                {
                  icon: TrendingUp,
                  title: "Planos Nutricionais",
                  description: "Recomendações de alimentação personalizadas com IA",
                  color: "primary",
                },
                {
                  icon: Users,
                  title: "Comunidade",
                  description: "Conecte-se com outros usuários e compartilhe experiências",
                  color: "secondary",
                },
                {
                  icon: Zap,
                  title: "Treinos Rápidos",
                  description: "Sessões de 15, 30 ou 60 minutos adaptadas ao seu tempo",
                  color: "accent",
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                const colorClasses = {
                  primary: "bg-primary/10 text-primary",
                  secondary: "bg-secondary/10 text-secondary",
                  accent: "bg-accent/10 text-accent",
                };

                return (
                  <Card key={idx} className="border-border/50 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl p-12 text-center text-white shadow-xl">
            <h3 className="text-3xl font-bold mb-4">Pronto para Transformar Seu Corpo?</h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Comece seu jornada de fitness hoje mesmo com treinos personalizados gerados por IA
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Criar Meu Primeiro Treino
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-xl mt-16">
          <div className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-4">Felipao-Fitness</h4>
                <p className="text-sm text-foreground/60">
                  Seu personal trainer com IA para treinos personalizados
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Recursos</h4>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li><a href="#" className="hover:text-foreground transition">Treinos</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Exercícios</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Progresso</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Suporte</h4>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li><a href="#" className="hover:text-foreground transition">Ajuda</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Contato</a></li>
                  <li><a href="#" className="hover:text-foreground transition">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li><a href="#" className="hover:text-foreground transition">Privacidade</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Termos</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border/50 pt-8 text-center text-sm text-foreground/60">
              <p>&copy; 2025 Felipao-Fitness. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Not authenticated - Landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">Felipao-Fitness</h1>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setIsLoggingIn(true);
              window.location.href = getLoginUrl();
            }}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Conectando..." : "Entrar"}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Seu Personal Trainer <span className="text-gradient">com IA</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
              Treinos personalizados gerados por inteligência artificial, adaptados ao seu biotipo, 
              objetivos e disponibilidade. Acompanhe seu progresso em tempo real e alcance seus objetivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  setIsLoggingIn(true);
                  window.location.href = getLoginUrl();
                }}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Conectando..." : "Começar Gratuitamente"}
              </Button>
              <Button size="lg" variant="outline">
                Saber Mais
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-card rounded-2xl p-8 border border-border/50 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                  <Brain className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">IA Avançada</p>
                    <p className="text-sm text-foreground/60">Treinos personalizados</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Progresso</p>
                    <p className="text-sm text-foreground/60">Acompanhamento em tempo real</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-lg">
                  <Zap className="w-6 h-6 text-accent flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Rápido</p>
                    <p className="text-sm text-foreground/60">Resultados em semanas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Por Que Escolher GymAI Pro?</h3>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Tudo que você precisa para alcançar seus objetivos de fitness em um único lugar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Gerador de Treinos com IA",
                description: "Treinos personalizados baseados em seu biotipo, objetivos e disponibilidade",
                color: "primary",
              },
              {
                icon: BarChart3,
                title: "Acompanhamento de Progresso",
                description: "Gráficos e estatísticas detalhadas do seu desenvolvimento",
                color: "secondary",
              },
              {
                icon: Dumbbell,
                title: "Biblioteca de Exercícios",
                description: "Mais de 500 exercícios com ilustrações e técnicas corretas",
                color: "accent",
              },
              {
                icon: TrendingUp,
                title: "Planos Nutricionais",
                description: "Recomendações de alimentação personalizadas com IA",
                color: "primary",
              },
              {
                icon: Users,
                title: "Comunidade",
                description: "Conecte-se com outros usuários e compartilhe experiências",
                color: "secondary",
              },
              {
                icon: Zap,
                title: "Treinos Rápidos",
                description: "Sessões de 15, 30 ou 60 minutos adaptadas ao seu tempo",
                color: "accent",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              const colorClasses = {
                primary: "bg-primary/10 text-primary",
                secondary: "bg-secondary/10 text-secondary",
                accent: "bg-accent/10 text-accent",
              };

              return (
                <Card key={idx} className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl p-12 text-center text-white shadow-xl">
          <h3 className="text-3xl font-bold mb-4">Pronto para Transformar Seu Corpo?</h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Comece sua jornada de fitness hoje mesmo com treinos personalizados gerados por IA
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => {
              setIsLoggingIn(true);
              window.location.href = getLoginUrl();
            }}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Conectando..." : "Criar Conta Grátis"}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-xl mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Felipao-Fitness</h4>
              <p className="text-sm text-foreground/60">
                Seu personal trainer com IA para treinos personalizados
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition">Treinos</a></li>
                <li><a href="#" className="hover:text-foreground transition">Exercícios</a></li>
                <li><a href="#" className="hover:text-foreground transition">Progresso</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition">Ajuda</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contato</a></li>
                <li><a href="#" className="hover:text-foreground transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-foreground/60">
            <p>&copy; 2025 Felipao-Fitness. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
