import type { Metadata } from "next";
import { Geist, Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { TeamProvider } from "@/providers/team-provider";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "400", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Dental Data | Dental Lab Management",
  description: "Comprehensive management system for dental labs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geist.variable} antialiased`}
    >
      <body>
        {/* <ClerkProvider> */}
          <QueryProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                forcedTheme="dark"
                enableSystem={false}
              >
                <Toaster richColors position="bottom-right" />
                {children}
              </ThemeProvider>
            </AuthProvider>
          </QueryProvider>
        {/* </ClerkProvider> */}
      </body>
    </html>
  );
}
