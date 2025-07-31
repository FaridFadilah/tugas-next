"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong!</h2>
          <p className="text-gray-600 mb-8">
            We're sorry, but something unexpected happened. Please try again.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => reset()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>
          
          {error.message && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                Error details
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-4 rounded-lg overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
