import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { User, Dumbbell, Target, Activity } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { data: profile, isLoading } = trpc.profile.get.useQuery();
  const updateProfileMutation = trpc.profile.update.useMutation();

  const [formData, setFormData] = useState({
    age: profile?.age || "",
    weight: profile?.weight || "",
    height: profile?.height || "",
    biotype: profile?.biotype || "mesomorfo",
    experience: profile?.experience || "iniciante",
    objective: profile?.objective || "hipertrofia",
    daysPerWeek: profile?.daysPerWeek || 3,
    preferredExerciseType: profile?.preferredExerciseType || "peso_livre",
    injuries: profile?.injuries || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" || name === "weight" || name === "height" || name === "daysPerWeek" ? parseInt(value) || "" : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        age: formData.age ? parseInt(String(formData.age)) : undefined,
        weight: formData.weight ? parseInt(String(formData.weight)) : undefined,
        height: formData.height ? parseInt(String(formData.height)) : undefined,
        biotype: formData.biotype as "ectomorfo" | "mesomorfo" | "endomorfo",
        experience: formData.experience as "iniciante" | "intermediario" | "avancado",
        objective: formData.objective as "hipertrofia" | "emagrecimento" | "resistencia" | "funcional",
        daysPerWeek: parseInt(String(formData.daysPerWeek)),
        preferredExerciseType: formData.preferredExerciseType as "funcional" | "maquinario" | "peso_livre" | "cardio" | "hiit",
        injuries: formData.injuries || undefined,
      };
      await updateProfileMutation.mutateAsync(dataToSubmit);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
        <div className="container max-w-4xl">
          <div className="text-center py-12">
            <p className="text-foreground/60">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-foreground/60">Personalize seus dados para receber treinos adequados ao seu perfil</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>Informações básicas sobre você</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Idade (anos)</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Altura (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="180"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Biotipo */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <CardTitle>Biotipo Corporal</CardTitle>
                  <CardDescription>Escolha o biotipo que mais se aproxima do seu corpo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "ectomorfo", label: "Ectomorfo", desc: "Corpo magro, difícil ganhar peso" },
                  { value: "mesomorfo", label: "Mesomorfo", desc: "Naturalmente musculoso" },
                  { value: "endomorfo", label: "Endomorfo", desc: "Tendência a acumular gordura" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                      formData.biotype === type.value
                        ? "border-secondary bg-secondary/10"
                        : "border-border bg-card hover:border-secondary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="biotype"
                      value={type.value}
                      checked={formData.biotype === type.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="font-semibold">{type.label}</div>
                    <div className="text-sm text-foreground/60">{type.desc}</div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Objetivos e Experiência */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Objetivos</CardTitle>
                  <CardDescription>Defina seus objetivos de fitness</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Objetivo Principal</label>
                <select
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="hipertrofia">Ganhar Massa Muscular (Hipertrofia)</option>
                  <option value="emagrecimento">Perder Peso (Emagrecimento)</option>
                  <option value="resistencia">Melhorar Resistência</option>
                  <option value="funcional">Funcionalidade e Mobilidade</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nível de Experiência</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="iniciante">Iniciante (Menos de 6 meses)</option>
                  <option value="intermediario">Intermediário (6 meses a 2 anos)</option>
                  <option value="avancado">Avançado (Mais de 2 anos)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Disponibilidade e Preferências */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Disponibilidade e Preferências</CardTitle>
                  <CardDescription>Customize seu treino ideal</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Dias Disponíveis por Semana</label>
                <select
                  name="daysPerWeek"
                  value={formData.daysPerWeek}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="1">1 dia (Full Body)</option>
                  <option value="3">3 dias (ABC)</option>
                  <option value="5">5 dias (ABCDE)</option>
                  <option value="6">6 dias (Push/Pull/Legs)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Exercício Preferido</label>
                <select
                  name="preferredExerciseType"
                  value={formData.preferredExerciseType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="funcional">Funcional</option>
                  <option value="maquinario">Maquinário</option>
                  <option value="peso_livre">Peso Livre</option>
                  <option value="cardio">Cardio</option>
                  <option value="hiit">HIIT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Lesões ou Limitações (opcional)</label>
                <textarea
                  name="injuries"
                  value={formData.injuries}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Descreva qualquer lesão ou limitação que você tenha..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              className="bg-primary hover:bg-primary/90 flex-1"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Salvando..." : "Salvar Perfil"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
