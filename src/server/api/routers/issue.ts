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
    .input(z.object({ status: z.any(), orderOption: z.string() }))
    .query(({ ctx, input }) => {
      let whereCondition = {};
      let orderCondition = {};

      if (input.status === "all") {
      } else if (input.status === "open") {
        whereCondition = { status: "OPEN" };
      } else if (input.status === "closed") {
        whereCondition = { status: "CLOSED" };
      } else if (input.status === "progress") {
        whereCondition = { status: "IN_PROGRESS" };
      }

      if (input.orderOption === "time") {
        orderCondition = { createdAt: "desc" };
      } else if (input.orderOption === "title") {
        orderCondition = { title: "asc" };
      } else if (input.orderOption === "status") {
        orderCondition = { status: "asc" };
      }

      return ctx.db.issue.findMany({
        where: whereCondition,
        orderBy: orderCondition,
      });
    }),
});
