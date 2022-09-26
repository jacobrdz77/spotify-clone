import Head from "next/head";
import SideBar from "../components/SideBar";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify 2.0</title>
      </Head>

      <main>
        <SideBar />
        {/* Center */}

        <div>{/* Audio Player */}</div>
      </main>
    </div>
  );
}
