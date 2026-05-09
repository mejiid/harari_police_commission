import { db } from "@/lib/db";
import UserActions from "@/components/admin/UserActions";
import Link from "next/link";

async function getUsers() {
  return db.user.findMany({ orderBy: { createdAt: "asc" } });
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-primary">Users</h1>
        <Link
          href="/admin/users/new"
          className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          + New User
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Email</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Role</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface/50">
                <td className="px-4 py-3 font-medium text-text">{user.name}</td>
                <td className="px-4 py-3 text-text-muted">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    user.role === "SUPER_ADMIN"
                      ? "bg-primary/10 text-primary"
                      : "bg-surface text-text-muted border border-border"
                  }`}>
                    {user.role === "SUPER_ADMIN" ? "Super Admin" : "Editor"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    user.isActive ? "bg-success/10 text-success" : "bg-error/10 text-error"
                  }`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <UserActions userId={user.id} isActive={user.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
