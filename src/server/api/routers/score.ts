import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const scoreRouter = createTRPCRouter({
  getHighScores: publicProcedure
    .input(z.object({ limit: z.number().positive().lte(100) }))
    .query(({ input, ctx }) => {
      return ctx.prisma.score.findMany({
        take: input.limit,
        orderBy: {
          score: "desc",
        },
      });
    }),

  addScore: publicProcedure
    .input(
      z.object({
        school: z.string(),
        teacher: z.string(),
        grade: z.string(),
        score: z.number().positive(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.score.upsert({
        create: {
          school: input.school,
          teacher: input.teacher,
          grade: input.grade,
          score: input.score,
        },
        update: {
          score: input.score,
        },
        where: {
          school_teacher_grade: {
            school: input.school,
            teacher: input.teacher,
            grade: input.grade,
          },
        },
      });
    }),
});
