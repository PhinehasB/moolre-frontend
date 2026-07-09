import type { Metadata } from "next";
import { Inter, Geist_Mono, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    template: "%s | Klare",
    default: "Klare: Payroll for pan-African businesses",
  },
  description:
    "Manage payroll, your team, and your Moolre wallet.",
  metadataBase: new URL("https://www.klare.app/"),

  icons: {
    icon: "/app/favicon.ico",
    shortcut: "/app/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Klare: Payroll for pan-African businesses",
    description:
      "Manage payroll, your team, and your Moolre wallet",
    type: "website",
    siteName: "Klare",
    images: ["OG_IMAGE.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col overflow-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
