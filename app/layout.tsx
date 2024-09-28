import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/providers/AppWalletProvider";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallzone",
  description: "Buy and sell wallpapers with crypto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>
        <AppWalletProvider>
          <div className="h-screen ">
            <NavBar />
            <div className="flex items-center justify-center h-minus-36">
              {children}
            </div>
          </div>
        </AppWalletProvider>
      </body>
    </html>
  );
}
