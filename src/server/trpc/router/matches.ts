import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const matchesRouter = router({
  getMatch: publicProcedure
    .input(z.object({ matchId: z.string()}))
    .query(async ({ input, ctx }) => {
      // TODO: persist that user info
      return await ctx.prisma.match.findUnique({
        where: {
            id: input.matchId,
        },
        include: {
            endUser: true,
            sourceUser: true,
        }
    })
      })
    });
