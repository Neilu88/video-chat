import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import {
    RtcTokenBuilder,
    RtcRole,
  } from "agora-access-token"
  
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
