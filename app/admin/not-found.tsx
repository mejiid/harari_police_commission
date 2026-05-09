import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-6xl font-bold text-primary/10 mb-4">404</div>
        <h1 className="text-xl font-bold text-primary mb-2">Page Not Found</h1>
        <Link href="/admin/dashboard" className="text-accent hover:underline text-sm">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
