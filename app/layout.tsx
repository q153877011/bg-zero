import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BG-Zero — Remove Background Instantly",
  description:
    "Remove image backgrounds instantly. AI-powered. Runs locally. 100% private.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
