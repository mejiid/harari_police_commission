"use client";

import Link from "next/link";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="text-8xl font-bold text-primary/10 mb-4">500</div>
          <h1 className="text-2xl font-bold text-primary mb-2">Something went wrong</h1>
          <p className="text-text-muted mb-8">
            An unexpected error occurred. Please try again.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={reset}
              className="bg-primary text-white font-semibold px-6 py-3 rounded hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="border border-border text-text px-6 py-3 rounded hover:bg-surface transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
