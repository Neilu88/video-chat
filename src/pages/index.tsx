import { createUseQueriesProxy } from "@trpc/react-query/shared";
import { type NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import {atom, useAtom} from "jotai";

type RegisterForm = {
  name: string;
  contact: string;
}

export const userIdAtom = atom("");

const Home: NextPage = () => {
  const [userId, setUserId] = useAtom(userIdAtom);
  
  const router = useRouter();
  const createUser = trpc.users.createUser.useMutation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const onSubmit = async (data: RegisterForm) => {

    const newUser = await createUser.mutateAsync(data);
    setUserId(newUser.id);
    router.push("/waiting");
  }
  

  return (
    <div>
      <Head>
        <title>Chat Room</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main data-theme="night" className="flex flex-col items-center justify-center min-h-screen">
      
      <h1 className="text-5xl font-semibold bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text p-4 mb-10">Chat Room</h1>

      <div className="form-control w-full max-w-xs p-4 border-2 border-primary rounded-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input {...register("name", { required: true })} type="text" placeholder="your display name" className="input-secondary input input-bordered w-full max-w-xs" />
          {errors.name && <span className="text-accent">*This field is required</span>}

          <label className="label">
            <span className="label-text">Contact</span>
          </label>
          <input {...register("contact", { required: true })} type="text" placeholder="your contact info" className="input-secondary input input-bordered w-full max-w-xs" />
          {errors.contact && <span className="text-accent">*This field is required</span>}

          <button className="btn bg-gradient-to-r from-sky-400 to-cyan-300 mt-10 text-black w-full">Join</button>
        </form>
      </div>
        
      </main>
    </div>
  );
};

export default Home;

