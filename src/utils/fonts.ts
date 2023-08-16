import {
  Monoton as FontMono,
  Spline_Sans_Mono as FontSans,
} from "next/font/google";

export const fontSans = FontSans({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});
