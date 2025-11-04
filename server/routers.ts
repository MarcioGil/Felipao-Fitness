import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { protectedProcedure } from "./_core/trpc";
import { getUserProfile, upsertUserProfile, getExercises, getUserWorkouts } from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // GymAI Pro - User Profile Router
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getUserProfile(ctx.user.id);
    }),
    update: protectedProcedure
      .input(z.object({
        age: z.number().optional(),
        weight: z.number().optional(),
        height: z.number().optional(),
        biotype: z.enum(["ectomorfo", "mesomorfo", "endomorfo"]).optional(),
        experience: z.enum(["iniciante", "intermediario", "avancado"]).optional(),
        objective: z.enum(["hipertrofia", "emagrecimento", "resistencia", "funcional"]).optional(),
        daysPerWeek: z.number().optional(),
        preferredExerciseType: z.enum(["funcional", "maquinario", "peso_livre", "cardio", "hiit"]).optional(),
        injuries: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return upsertUserProfile(ctx.user.id, input);
      }),
  }),

  // GymAI Pro - Exercises Router
  exercises: router({
    list: publicProcedure
      .input(z.object({
        muscleGroup: z.string().optional(),
        exerciseType: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return getExercises(input);
      }),
  }),

  // GymAI Pro - Workouts Router
  workouts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserWorkouts(ctx.user.id);
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
        const prompt = `
Você é um personal trainer especializado em criar treinos personalizados com IA.

Crie um treino detalhado com as seguintes características:
- Biotipo: ${input.biotype}
- Dias por semana: ${input.daysPerWeek}
- Tipo de exercício preferido: ${input.exerciseType}
- Objetivo: ${input.objective}
- Nível de experiência: ${input.experience}

Retorne o treino em formato JSON com a seguinte estrutura:
{
  "name": "Nome do treino",
  "description": "Descrição breve",
  "workoutType": "full_body|abc|abcde|push_pull_legs",
  "days": [
    {
      "dayNumber": 1,
      "name": "Dia 1",
      "exercises": [
        {
          "name": "Nome do exercício",
          "sets": 3,
          "reps": "8-12",
          "rest": "60-90 segundos",
          "notes": "Notas técnicas"
        }
      ]
    }
  ]
}
        `;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Você é um personal trainer especializado em criar treinos personalizados. Sempre retorne respostas em JSON válido.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "workout_plan",
              strict: false,
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  workoutType: { type: "string" },
                  days: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        dayNumber: { type: "number" },
                        name: { type: "string" },
                        exercises: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: { type: "string" },
                              sets: { type: "number" },
                              reps: { type: "string" },
                              rest: { type: "string" },
                              notes: { type: "string" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        try {
          const content = response.choices[0].message.content;
          const workoutData = typeof content === "string" ? JSON.parse(content) : content;
          return workoutData;
        } catch (error) {
          console.error("Failed to parse workout response:", error);
          throw new Error("Falha ao gerar treino com IA");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
