"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SimpleSidebar from "./SimpleSidebar";

export default function MinimalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }
  
  // Check if current route is an auth page or welcome page
  const isAuthPage = pathname?.startsWith('/auth');
  const isWelcomePage = pathname?.startsWith('/welcome');

  if (isAuthPage || isWelcomePage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {children}
      </div>
    );
  }

  // Main app with simplified sidebar
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <SimpleSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
