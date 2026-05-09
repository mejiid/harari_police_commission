"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewUserPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      role: (form.elements.namedItem("role") as HTMLSelectElement).value,
    };

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) { setError("Failed to create user."); return; }
    router.push("/admin/users");
    router.refresh();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary mb-8">New User</h1>
      <form onSubmit={handleSubmit} className="max-w-md bg-white rounded-lg border border-border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Full Name</label>
          <input name="name" required className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Email</label>
          <input name="email" type="email" required className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Password</label>
          <input name="password" type="password" required minLength={8} className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Role</label>
          <select name="role" className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
            <option value="EDITOR">Editor</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
        {error && <p className="text-error text-sm">{error}</p>}
        <button type="submit" disabled={saving}
          className="w-full bg-primary text-white font-semibold py-2.5 rounded hover:bg-primary-dark transition-colors disabled:opacity-60">
          {saving ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
