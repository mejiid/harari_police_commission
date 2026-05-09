import Link from "next/link";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="text-8xl font-bold text-primary/10 mb-4">404</div>
          <h1 className="text-2xl font-bold text-primary mb-2">Page Not Found</h1>
          <p className="text-text-muted mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="bg-primary text-white font-semibold px-6 py-3 rounded hover:bg-primary-dark transition-colors"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
