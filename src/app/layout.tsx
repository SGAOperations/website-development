import "./styles.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { DialogProvider } from "@/components/ui/dialog-provider";
import { Inter, Bebas_Neue } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  title: "SGA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning: the CMS sets display-setting data attributes on <html> before React hydrates.
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`} suppressHydrationWarning>
      <body>
        <DialogProvider>
          {children}
        </DialogProvider>
        <Toaster />
      </body>
    </html>
  )
}
