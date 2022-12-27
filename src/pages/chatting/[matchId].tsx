import { createUseQueriesProxy } from "@trpc/react-query/shared";
import { useAtom } from "jotai";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { userIdAtom } from "../";
import { trpc } from "../../utils/trpc";


const WaitingPage: NextPage = () => {
  const router = useRouter()
  const matchId = router.query.matchId as string;
  const [userId] = useAtom(userIdAtom)

  const matchQuery = trpc.matches.getMatch.useQuery({matchId});
  
  const isEndUser = matchQuery.data?.endUserId === userId;
  let otherUserName = '';
  
  if (matchQuery.data) {
    otherUserName = isEndUser ? matchQuery.data.endUser.name : matchQuery.data.sourceUser.name
  }
  
 
  return (
    <div>
      <Head>
        <title>Chatting with User</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main data-theme="night" className="flex flex-col items-center justify-center min-h-screen">
        <h1>Chatting with {`${otherUserName}`}</h1>
      </main>
    </div>
  );
};

export default WaitingPage;

