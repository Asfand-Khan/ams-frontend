import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/shadcn/sonner";
import TanstackQueryProvider from "@/providers/TanstackClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orio Attendance",
  description: "Dashboard for Orio Attendance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanstackQueryProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextTopLoader
            color="#0074FC"
            showSpinner={false}
            speed={200}
            easing="ease"
          />
          <Toaster position="bottom-right" richColors />
          {children}
        </body>
      </html>
    </TanstackQueryProvider>
  );
}
