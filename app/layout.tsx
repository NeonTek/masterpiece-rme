import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // <-- IMPORT HERE

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Masterpiece Empire",
  description: "Powered by Masterpiece Empire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header /> 
        <main>{children}</main>
      </body>
    </html>
  );
}
