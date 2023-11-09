import { Status } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getOrderOption } from "~/utils";
import { orderOptionSchema } from "~/utils/schemas";

export const issueRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.issue.create({
        data: {
          title: input.title,
          description: input.description,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.issue.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getAll: publicProcedure
    .input(
      z.object({
        status: z.enum(["OPEN", "CLOSED", "IN_PROGRESS"]).optional(),
        orderOption: orderOptionSchema,
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.issue.findMany({
        where: { ...(input.status && { status: input.status }) },
        orderBy: getOrderOption(input.orderOption),
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.issue.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.issue.delete({
        where: {
          id: input.id,
        },
      });
    }),

  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        status: z.nativeEnum(Status),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedIssue = ctx.db.issue.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
        },
      });

      return updatedIssue;
    }),
});
