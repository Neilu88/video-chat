import { z } from "zod";

import { router, publicProcedure } from "../trpc";


export const usersRouter = router({
  createUser: publicProcedure
    .input(z.object({ name: z.string(), contact: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // TODO: persist that user info
      const newVideoChatUser = await ctx.prisma.videoChatUser.create({
        data: input,
      })
      return newVideoChatUser;
    }),


    findMatch: publicProcedure
    .input(z.object({userId: z.string()}))
    .query(async ({ input, ctx }) => {
      // TODO: persist that user info
      const firstMatch = await ctx.prisma.videoChatUser.findFirst({
        where: {
          status: "waiting",
          NOT: {
            id: input.userId,
          },
      },
      });

      if (!firstMatch) return null;

      const match = await ctx.prisma.match.create({
        data: {
          sourceUserId: input.userId,
          endUserId: firstMatch.id,
          status: "waiting",
        }
      })

    

     
      return match
    }),


    getMatch: publicProcedure
    .input(z.object({userId: z.string()}))
    .query(async ({ input, ctx }) => {
      // TODO: persist that user info
      const match = await ctx.prisma.match.findFirst({
        where: {
          endUserId: input.userId,
      },
      });

      return match;
    }),

 
});
