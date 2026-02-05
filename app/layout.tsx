import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SMIU Lost & Found | Reuniting Students with their Belongings",
  description:
    "The official Lost & Found portal for Sindh Madressatul Islam University. Report lost items or help reunite found belongings with their owners.",
  keywords: ["SMIU", "Lost and Found", "University", "Karachi", "Students"],
  authors: [{ name: "SMIU IT Department" }],
  icons: {
    icon: "https://www.smiu.edu.pk/themes/smiu/images/13254460_710745915734761_8157428650049174152_n.png",
    shortcut: "https://www.smiu.edu.pk/themes/smiu/images/13254460_710745915734761_8157428650049174152_n.png",
    apple: "https://www.smiu.edu.pk/themes/smiu/images/13254460_710745915734761_8157428650049174152_n.png",
  },
  openGraph: {
    title: "SMIU Lost & Found",
    description: "A trusted platform for the SMIU community",
    type: "website",
    images: [
      {
        url: "https://www.smiu.edu.pk/themes/smiu/images/13254460_710745915734761_8157428650049174152_n.png",
        width: 1200,
        height: 630,
        alt: "SMIU Lost & Found",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMIU Lost & Found",
    description: "A trusted platform for the SMIU community",
    images: ["https://www.smiu.edu.pk/themes/smiu/images/13254460_710745915734761_8157428650049174152_n.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased font-sans`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
