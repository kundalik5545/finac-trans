import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";



const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finac - Finance Tracking App",
  description: "Track your income and expenses effortlessly with Finac",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} absolute inset-0 z-0 antialiased`}
        style={myStyles}
      >
        <Providers>
          <Navbar />
          <main className="">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


// Cyan Radial Glow Background
const myStyles = {
  backgroundImage: `
          repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px)
        `,
  backgroundSize: "40px 40px",
}


