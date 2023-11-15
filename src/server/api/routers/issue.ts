import { Status } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const issueRouter = createTRPCRouter({
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    const deletedCount = await ctx.db.issue.deleteMany();

    return { deletedCount };
  }),

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
      take: 7,
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.issue.findMany();
  }),

  getLength: publicProcedure
    .input(
      z.object({
        status: z.enum(["OPEN", "CLOSED", "IN_PROGRESS"]).nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let statusCondition = {};

      if (input.status) {
        statusCondition = { status: input.status };
      }

      const issues = await ctx.db.issue.findMany({
        where: statusCondition,
      });

      return {
        length: issues.length,
      };
    }),

  paginated: publicProcedure
    .input(
      z.object({
        status: z.enum(["OPEN", "CLOSED", "IN_PROGRESS"]).nullish(),
        orderOption: z.any(), //check this
        page: z.number().positive().default(1),
      }),
    )
    .query(({ ctx, input }) => {
      let orderCondition = {};
      let statusCondition = {};

      if (input.status) {
        statusCondition = { status: input.status };
      }

      switch (input.orderOption) {
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
          orderCondition = { createdAt: "desc" };
          break;
      }

      return ctx.db.issue.findMany({
        where: statusCondition,
        orderBy: orderCondition,
        take: 10,
        skip: (input.page - 1) * 10,
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
