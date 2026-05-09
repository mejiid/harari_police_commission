"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await fetch(`/api/admin/contact/${id}/read`, { method: "PATCH" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs text-accent hover:underline disabled:opacity-60"
    >
      Mark as read
    </button>
  );
}
