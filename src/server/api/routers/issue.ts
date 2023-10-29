import { Status } from "@prisma/client";
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
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

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
        status: z.enum(["OPEN", "CLOSED", "IN_PROGRESS"]).nullish(),
        orderOption: z.any(),
      }),
    )
    .query(({ ctx, input }) => {
      let orderCondition = {};
      let statusCondition = {};

      if (input.status) {
        statusCondition = { status: input.status };
      }

      switch (input.orderOption) {
        case "":
          orderCondition = {};
          break;
        case "time":
          orderCondition = { createdAt: "desc" };
          break;
        case "title":
          orderCondition = { title: "asc" };
          break;
        case "status":
          orderCondition = { status: "asc" };
          break;
        default:
          break;
      }

      return ctx.db.issue.findMany({
        where: statusCondition,
        orderBy: orderCondition,
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      const { id, title, description, status } = input;

      const updatedIssue = ctx.db.issue.update({
        where: { id },
        data: {
          title,
          description,
          status,
        },
      });

      return updatedIssue;
    }),
});
