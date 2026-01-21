import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMIU Lost & Found | Reuniting Students with their Belongings",
  description:
    "The official Lost & Found portal for Sindh Madressatul Islam University. Report lost items or help reunite found belongings with their owners.",
  keywords: ["SMIU", "Lost and Found", "University", "Karachi", "Students"],
  authors: [{ name: "SMIU IT Department" }],
  openGraph: {
    title: "SMIU Lost & Found",
    description: "A trusted platform for the SMIU community",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
