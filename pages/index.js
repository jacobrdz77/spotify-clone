import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Center from "../components/Center";
import Player from "../components/Player";
import SideBar from "../components/SideBar";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify 2.0</title>
      </Head>

      <main className="flex">
        <SideBar />
        <Center />
      </main>
    </div>
  );
}

//! Not working
export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      session,
    },
  };
}
