import { router } from "../trpc";
import { authRouter } from "./auth";
import { usersRouter } from "./users";
import { matchesRouter } from "./matches";

export const appRouter = router({
  users: usersRouter,
  auth: authRouter,
  matches: matchesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
