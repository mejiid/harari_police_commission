"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { userId: string; isActive: boolean };

export default function UserActions({ userId, isActive }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleActive() {
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggleActive}
      disabled={loading}
      className={`text-xs font-medium hover:underline disabled:opacity-60 ${
        isActive ? "text-error" : "text-success"
      }`}
    >
      {isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
