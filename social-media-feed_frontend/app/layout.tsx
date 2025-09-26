import type React from "react";
import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/auth-context";
import { ApolloProvider } from "@/lib/apollo-provider";
import { GraphQLErrorBoundary } from "@/components/graphql-error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SocialFeed - Connect and Share",
  description: "A modern social media platform built with Next.js",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.className}`}>
        <Suspense fallback={null}>
          <GraphQLErrorBoundary>
            <ApolloProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </ApolloProvider>
          </GraphQLErrorBoundary>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
