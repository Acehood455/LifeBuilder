import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lifebuilder Christian Academy",
  description:
    "Empowering students through Christ-centered education that nurtures academic excellence, moral integrity, and lifelong purpose.",
  authors: [{ name: "Lifebuilder Christian Academy" }],
  openGraph: {
    title: "Lifebuilder Christian Academy",
    description:
      "Discover Lifebuilder Christian Academy — a place where faith meets knowledge and every learner is equipped to thrive with purpose.",
    url: "https://lifebuilderschools.com/",
    siteName: "Lifebuilder Christian Academy",
    images: [
      {
        url: "https://lifebuilderschools.com/lifebuilderLogo.png",
        width: 2000,
        height: 1333,
        alt: "Lifebuilder Christian Academy Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lifebuilder Christian Academy",
    description:
      "Building faith, excellence, and purpose in every child — Lifebuilder Christian Academy.",
    images: ["https://lifebuilderschools.com/lifebuilderLogo.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <ToastContainer position="bottom-right" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}
