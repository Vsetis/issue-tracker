import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const issueRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.issue.create({
        data: {
          title: input.title,
          description: input.description,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.issue.findMany();
  }),
});
