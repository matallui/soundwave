import { cn } from "@/utils/cn";
import { fontMono, fontSans } from "@/utils/fonts";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { TailwindIndicator } from "@/components/TailwindIndicator";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Sound Wave Science</title>
        <meta name="description" content="Sound Wave Science" />
        <link rel="icon" href="/favicon.ico" />
        <body
          className={cn(
            fontSans.variable,
            fontMono.variable,
            "min-h-screen bg-background font-sans leading-5 antialiased"
          )}
        />
      </Head>
      <div className="min-w-screen relative flex min-h-screen w-screen flex-col font-sans text-sm sm:text-base">
        <Component {...pageProps} />
      </div>
      <TailwindIndicator />
    </>
  );
};

export default api.withTRPC(MyApp);
