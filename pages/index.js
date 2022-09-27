import Head from "next/head";
import Center from "../components/Center";
import SideBar from "../components/SideBar";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify 2.0</title>
      </Head>

      <main className="flex">
        <SideBar />
        <Center />

        <div>{/* Audio Player */}</div>
      </main>
    </div>
  );
}
