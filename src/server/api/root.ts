import { createTRPCRouter } from "~/server/api/trpc";
import { issueRouter } from "./routers/issue";

export const appRouter = createTRPCRouter({
  issue: issueRouter,
});

export type AppRouter = typeof appRouter;
