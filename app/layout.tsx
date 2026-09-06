import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import LoaderProvider from "@/components/loading/LoaderProvider";
import { PerformanceProvider } from "@/lib/performance/usePerformance";
import { RuntimeMonitor } from "@/lib/performance/RuntimeMonitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vader-Verse",
  description: "The ultimate gaming and entertainment platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        <PerformanceProvider>
          <RuntimeMonitor />
          <LoaderProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </LoaderProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}
