export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-surface">{children}</body>
    </html>
  );
}
