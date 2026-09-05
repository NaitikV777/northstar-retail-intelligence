import type { Metadata } from "next";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import "./aurora.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og-aurora.jpg`;
  const title = "Northstar — Retail Intelligence";
  const description = "Sales, inventory, and product intelligence for modern neighborhood retailers.";

  return {
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title, description, type: "website", images: [{ url: socialImage, width: 1200, height: 630, alt: "Northstar retail intelligence dashboard" }] },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${syne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
