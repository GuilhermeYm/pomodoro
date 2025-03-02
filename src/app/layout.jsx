import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  weights: [400, 500, 600, 700],
  style: "normal",
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pomodoro Timer",
  description: "Um simples site para ajudar você a se manter focado.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.variable} antialiased bg-gradient-to-r from-slate-900 to-slate-700 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
