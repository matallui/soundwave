import { cn } from "@/utils/cn";
import { fontMono, fontSans } from "@/utils/fonts";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { TailwindIndicator } from "@/components/TailwindIndicator";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans leading-5 antialiased",
        fontSans.variable,
        fontMono.variable
      )}
    >
      <div className="min-w-screen relative flex min-h-screen w-screen flex-col">
        <Component {...pageProps} />
      </div>
      <TailwindIndicator />
    </div>
  );
};

export default api.withTRPC(MyApp);
