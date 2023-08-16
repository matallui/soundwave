import Head from "next/head";
import Image from "next/image";
import { Game } from "@/components/Game";
import { Leaderboard } from "@/components/Leaderboard";

export default function Home() {
  return (
    <>
      <Head>
        <title>Sound Wave Science</title>
        <meta name="description" content="Sound Wave Science" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          {/* Banner */}
          <div className="flex flex-col items-center space-y-2 font-mono uppercase">
            <div className="h-[150px] w-[300px]">
              <Image src="/logo.png" alt="logo" width={300} height={150} />
            </div>
            <h1 className="rounded-xl bg-white p-2 text-center font-mono text-5xl text-background">
              SOUND WAVE SCIENCE!
            </h1>
          </div>
          {/* Description */}
          <div className="lg:max-w-[90%]">
            <h3 className="mb-2 mt-4 text-xl font-bold uppercase">
              Let&apos;s get loud!
            </h3>
            <p className="text-justify">
              Join the fun in our harmonica competition where your mission is to
              play louder than anyone else! Just like a ruler measures length,
              we&apos;ve got a super cool gadget, a sound level meter, to
              measure your sound&apos;s loudness. When your class rocks out on
              the harmonicas, the goal is to get the highest score on the meter.
              Remember, the class that makes the most noise wins, so let&apos;s
              make some noise together!
            </p>
          </div>
          {/* Game */}
          <Game />
        </div>
        <Leaderboard />
      </main>
    </>
  );
}
