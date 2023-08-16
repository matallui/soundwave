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
    .mutation(async ({ input, ctx }) => {
      // find current record for this school, teacher, grade
      // if found, only update if new score is higher
      // if not found, create one
      // return the new record

      const existingScore = await ctx.prisma.score.findFirst({
        where: {
          school: input.school,
          teacher: input.teacher,
          grade: input.grade,
        },
      });

      if (existingScore) {
        if (existingScore.score < input.score) {
          return ctx.prisma.score.update({
            where: {
              id: existingScore.id,
            },
            data: {
              score: input.score,
            },
          });
        }
      }

      return ctx.prisma.score.create({
        data: {
          school: input.school,
          teacher: input.teacher,
          grade: input.grade,
          score: input.score,
        },
      });
    }),
});
