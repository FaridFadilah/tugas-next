import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MinimalLayout from "./components/MinimalLayout";
import { ThemeProvider } from "./components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Activity Tracker",
  description: "Track your daily activities, create journals, summaries, and reminders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 transition-colors`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="activity-tracker-theme">
          <MinimalLayout>{children}</MinimalLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
