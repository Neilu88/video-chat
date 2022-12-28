import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import {
    RtcTokenBuilder,
    RtcRole,
  } from "agora-access-token"
import { userIdAtom } from "../../../pages";
  
export const matchesRouter = router({
  postFeedback: publicProcedure
    .input(z.object({ matchId: z.string(), userId: z.string(), status: z.string()}))
    .mutation(async ({ input, ctx }) => {
      // TODO: persist that user info
      const match = await ctx.prisma.match.findUnique({
        where: {
          id: input.matchId,
        }
      })
      const isEndUser = match?.endUserId === input.userId;

      await ctx.prisma.match.update({
        where: {
            id: input.matchId,
        },
        data: {
          [isEndUser ? 'endUserFeedback': 'sourceUserFeedback']: input.status
        }
    })
      }),
  
  joinMatch: publicProcedure
      .input(z.object({ matchId: z.string(), userId: z.string()}))
      .mutation(async ({ input, ctx }) => {
        const match = await ctx.prisma.match.findUnique({
          where: {
            id: input.matchId,
          },
        });
        const isSinkUser = input.userId === match?.endUserId;
  
        const updatedMatch = await ctx.prisma.match.update({
          where: {
            id: input.matchId,
          },
          data: {
            [isSinkUser ? "endUserJoined" : "sourceUserJoined"]: true,
          },
        });
  
        if (updatedMatch.endUserJoined && updatedMatch.sourceUserJoined) {
          await ctx.prisma.match.update({
            where: {
              id: input.matchId,
            },
            data: {
              status: "chatting",
              endsOn: `${Date.now() + 20 * 1000}`,
              }})
          }
      
        }),

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
      }),

  getToken: publicProcedure
    .input(z.object({ userId: z.string(), matchId: z.string()}))
    .query(async ({ input, ctx }) => {
        const appID = process.env.AGORA_APP_ID!;
        const appCertificate = process.env.AGORA_APP_CERT!;
        const channelName = input.matchId;
        const account = input.userId;
        const role = RtcRole.PUBLISHER;
  
        const expirationTimeInSeconds = 3600
  
        const currentTimestamp = Math.floor(Date.now() / 1000)
  
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
  
        const token = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, account, role, privilegeExpiredTs);
        
        return token;
      })

    });
