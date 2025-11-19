import { Suspense } from "react";
import { font } from "@/lib/fonts";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "CreativeDev.Lab | Full-stack Product Studio",
    template: "%s | CreativeDev.Lab",
  },
  description:
    "CreativeDev.Lab ships conversion-focused landing pages and content hubs backed by Supabase.",
  openGraph: {
    title: "CreativeDev.Lab",
    description:
      "Landing pages and blogs engineered with Next.js, Supabase, and shadcn/ui.",
    url: defaultUrl,
    siteName: "CreativeDev.Lab",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CreativeDev.Lab",
    description:
      "Landing pages and blogs engineered with Next.js, Supabase, and shadcn/ui.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          font.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
