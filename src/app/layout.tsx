import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CompareBar } from "@/components/CompareBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "College Compass – Find Your Perfect College in India",
    template: "%s | College Compass",
  },
  description:
    "Discover, compare, and save top colleges in India. Search by location, fees, rating and more. Make informed college decisions with College Compass.",
  keywords: ["colleges in India", "college search", "IIT", "NIT", "engineering colleges", "MBA colleges"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CompareBar />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
