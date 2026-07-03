import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ResponseLogger } from "@/components/response-logger";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import FarcasterWrapper from "@/components/FarcasterWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestId = cookies().get("x-request-id")?.value;

  return (
        <html lang="en">
          <head>
            {requestId && <meta name="x-request-id" content={requestId} />}
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              
      <FarcasterWrapper>
        {children}
      </FarcasterWrapper>
      
              <Toaster />
              <ResponseLogger />
            </ThemeProvider>
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "STC ImpactViz",
        description: "Analyze tourism blockchain data for economic, social, and environmental impacts. Generate a sustainability index and carbon insights with interactive dashboards. Export as CSV/JSON.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_aa4ac443-679c-480c-90cd-62933ae44dc5-ctWXPhZGTaHpfL7Qzi8CFSeex0jwWU","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"STC ImpactViz","url":"https://cutting-captain-701.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
