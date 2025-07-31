import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../store/provider"; // Import the wrapper
import { store } from "../store/index";
import NotificationContainer from "@/components/Notifications";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet Keeper",
  description: "Securely manage your wallets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black`}>
        <Providers>
          <NotificationContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
