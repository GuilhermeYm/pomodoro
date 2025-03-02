import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
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
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
