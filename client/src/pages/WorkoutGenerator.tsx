import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

export default function WorkoutGenerator() {
  const { user } = useAuth();
  const { data: profile } = trpc.profile.get.useQuery();
  const generateMutation = trpc.workouts.generate.useMutation();
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [formData, setFormData] = useState({
    biotype: profile?.biotype || "mesomorfo",
    daysPerWeek: profile?.daysPerWeek || 3,
    exerciseType: profile?.preferredExerciseType || "peso_livre",
    objective: profile?.objective || "hipertrofia",
    experience: profile?.experience || "iniciante",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "daysPerWeek" ? parseInt(value) : value,
    }));
  };

  const handleGenerate = async () => {
    try {
      const workout = await generateMutation.mutateAsync({
        biotype: formData.biotype as "ectomorfo" | "mesomorfo" | "endomorfo",
        daysPerWeek: formData.daysPerWeek,
        exerciseType: formData.exerciseType as "funcional" | "maquinario" | "peso_livre" | "cardio" | "hiit",
        objective: formData.objective as "hipertrofia" | "emagrecimento" | "resistencia" | "funcional",
        experience: formData.experience as "iniciante" | "intermediario" | "avancado",
      });
      setGeneratedWorkout(workout);
      toast.success("Treino gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar treino");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Gerador de Treinos com IA</h1>
          <p className="text-foreground/60">Crie um treino personalizado baseado em suas características e objetivos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-4">
              <CardHeader>
                <CardTitle>Personalize seu Treino</CardTitle>
                <CardDescription>Ajuste os parâmetros para gerar um treino ideal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Biotipo</label>
                  <select
                    name="biotype"
                    value={formData.biotype}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ectomorfo">Ectomorfo</option>
                    <option value="mesomorfo">Mesomorfo</option>
                    <option value="endomorfo">Endomorfo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dias por Semana</label>
                  <select
                    name="daysPerWeek"
                    value={formData.daysPerWeek}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="1">1 dia (Full Body)</option>
                    <option value="3">3 dias (ABC)</option>
                    <option value="5">5 dias (ABCDE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Exercício</label>
                  <select
                    name="exerciseType"
                    value={formData.exerciseType}
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
                  <label className="block text-sm font-medium mb-2">Objetivo</label>
                  <select
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="hipertrofia">Hipertrofia</option>
                    <option value="emagrecimento">Emagrecimento</option>
                    <option value="resistencia">Resistência</option>
                    <option value="funcional">Funcional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Experiência</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 gap-2"
                  size="lg"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar Treino
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resultado */}
          <div className="lg:col-span-2">
            {generatedWorkout ? (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>{generatedWorkout.name}</CardTitle>
                  <CardDescription>{generatedWorkout.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {generatedWorkout.days && generatedWorkout.days.map((day: any, dayIdx: number) => (
                    <div key={dayIdx} className="border-t border-border/50 pt-6 first:border-t-0 first:pt-0">
                      <h3 className="text-lg font-semibold mb-4">{day.name}</h3>
                      <div className="space-y-3">
                        {day.exercises && day.exercises.map((exercise: any, exIdx: number) => (
                          <div key={exIdx} className="bg-card rounded-lg p-4 border border-border/50">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                                {exercise.sets} × {exercise.reps}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/60 mb-2">Descanso: {exercise.rest}</p>
                            {exercise.notes && (
                              <p className="text-sm text-foreground/70 italic">{exercise.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-secondary hover:bg-secondary/90 mt-6">Salvar Treino</Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Sparkles className="w-12 h-12 text-primary/50 mb-4" />
                  <p className="text-foreground/60 text-center">Preencha os parâmetros e clique em "Gerar Treino" para criar seu treino personalizado com IA</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
