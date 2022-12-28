import { createUseQueriesProxy } from "@trpc/react-query/shared";
import { IAgoraRTC, IAgoraRTCRemoteUser, ICameraVideoTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { atom, useAtom } from "jotai";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { any, string } from "zod";
import { userIdAtom } from "../";
import { trpc } from "../../utils/trpc";
import Countdown from "react-countdown";
//import AgoraRTC from "agora-rtc-sdk-ng";
//import createClient from "agora-rtc-sdk-ng";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
type Props = {
  videoTrack: ICameraVideoTrack | IRemoteVideoTrack;
};

export const VideoPlayer = ({videoTrack}: Props) => {


  const ref = useRef(null);

  useEffect(()=> {

    const playerRef = ref.current;
    if (!videoTrack) return;
    if (!playerRef) return;

    videoTrack.play(playerRef);

    return () => {
      videoTrack.stop();
    }
  }, [])

  return (
    <div className="flex items-center justify-center">
      <div ref={ref} className='w-[250px] h-[250px]'></div>
    </div>
  )
}

export const matchIdAtom = atom("")


const ChattingPage: NextPage = () => {
  //const [timeLeft] = useState(Date.now() + 1000 * 20);

  const promiseRef = useRef<any>(Promise.resolve());
  const router = useRouter()
  const matchId = router.query.matchId as string;
  const [userId] = useAtom(userIdAtom)
  const [otherUser, setOtherUser] = useState<IAgoraRTCRemoteUser>();
  const [videoTrack, setVideoTrack] = useState<ICameraVideoTrack>()
  const setStatusMutation = trpc.users.setStatus.useMutation();
  const joinMatchMutation = trpc.matches.joinMatch.useMutation();
  const [globalMatchId, setGlobalMatchId] = useAtom(matchIdAtom);
  
  const matchQuery = trpc.matches.getMatch.useQuery({matchId});
  const tokenQuery = trpc.matches.getToken.useQuery({userId, matchId}, {
    refetchOnWindowFocus: false
  },);


  useEffect(() => {
    if(!userId) return;
    setStatusMutation.mutate({userId, status: "chatting"})
    joinMatchMutation.mutate({matchId, userId})
    
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      matchQuery.refetch();
    }, 1000);

    if (matchQuery.data?.endsOn) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [matchQuery]);

  const handleCoutdownCompleted = () => {
    router.push("/done")
  }

  const timeLeft: any = matchQuery.data?.endsOn;

  const isEndUser = matchQuery.data?.endUserId === userId;



  let otherUserName = '';


  
  if (matchQuery.data) {
    otherUserName = isEndUser ? matchQuery.data.endUser.name : matchQuery.data.sourceUser.name
  }
  
  useEffect(() => {

    if(!userId) {
      router.push('/')
      return;
    }

    if(!router) return;
    if(!tokenQuery.data) return;
    if(!matchId) return;
    
    setGlobalMatchId(matchId);


    // connect to agora video room
    const connect = async() => {
      const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");

      
      const token = tokenQuery.data;

      const client = AgoraRTC.createClient({
        mode:"rtc",
        codec: "vp8",
      })

     await client.join(
        APP_ID,
        matchId,
        token,
        userId,
      );
  

    client.on("user-published", (user: any, mediaType: any) => {
      client.subscribe(user, mediaType).then(() => {
        if (mediaType === "video") {
          
          setOtherUser(user)
        }
        if (mediaType === "audio") {
          
          otherUser?.audioTrack?.play;
        }
    }
      )
    })

    
    const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    setVideoTrack(tracks[1]);
    await client.publish(tracks);
    
    return {tracks, client}
  }

    promiseRef.current = promiseRef.current.then(connect);

    return () => {
      const disconnect = async () => {

        const {client, tracks} = await promiseRef.current;
        client.removeAllListeners();
        tracks[0].stop();
        tracks[0].close();
        tracks[1].stop();
        tracks[1].close();
        
        await client.unpublish(tracks[1]);
        await client.leave();
      }
    promiseRef.current = promiseRef.current.then(disconnect)
    disconnect();

    }
  }, [tokenQuery.data])
  

  return (
    <div>
      <Head>
        <title>Chatting with User</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main data-theme="night" className="flex flex-col items-center justify-center min-h-screen">
        
          <div className="space-y-2 md:space-y-4 p-2 flex flex-col items-center mb-10">
            <h1 className="text-2xl md:text-5xl">Chatting with {`${otherUserName}`}</h1>
            {matchQuery.data?.endsOn && <Countdown className="text-2xl md:text-5xl text-secondary" onComplete={handleCoutdownCompleted} date={parseInt(timeLeft)} /> }
          </div>

          <div className="flex flex-row items-center justify-center md:space-x-10">
              <div className="hidden md:inline p-1 bg-gradient-to-r from-sky-400 to-cyan-300">
                {videoTrack && <VideoPlayer videoTrack={videoTrack} />}
              </div>
              <div className="p-1 rounded-md bg-gradient-to-r from-sky-400 to-cyan-300">
                {otherUser?.videoTrack && <VideoPlayer videoTrack={otherUser.videoTrack} />}
              </div>
          </div>
      </main>
    </div>
  );
};

export default ChattingPage;

