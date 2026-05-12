import { db } from "@/lib/db";
import UserActions from "@/components/admin/UserActions";
import Link from "next/link";
import { UserPlus, Shield, UserCircle, CheckCircle2, XCircle } from "lucide-react";

async function getUsers() {
  return db.user.findMany({ orderBy: { createdAt: "asc" } });
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="display-sm text-primary">System Users</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-2 font-bold">
            Administrative Access Control
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center justify-center gap-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-8 py-4 hover:bg-primary-container transition-all shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          Authorize New User
        </Link>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Identity & Role</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Email Address</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Permissions</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <UserCircle className="w-4 h-4" />
                      </div>
                      <div>
                         <div className="font-display font-bold text-primary group-hover:text-accent transition-colors">
                           {user.name}
                         </div>
                         <div className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold mt-0.5">
                           ID: {user.id.slice(0, 8)}...
                         </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-on-surface-variant font-medium">
                    {user.email}
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      user.role === "SUPER_ADMIN"
                        ? "bg-primary/5 text-primary border border-primary/10 shadow-sm"
                        : "bg-surface-container-low text-on-surface-variant/60 border border-outline-variant/30"
                    }`}>
                      <Shield className={`w-3 h-3 ${user.role === "SUPER_ADMIN" ? "text-accent" : ""}`} />
                      {user.role === "SUPER_ADMIN" ? "Super Admin" : "Editor"}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      user.isActive 
                        ? "text-green-700" 
                        : "text-red-700"
                    }`}>
                      {user.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {user.isActive ? "Active" : "Revoked"}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <UserActions userId={user.id} isActive={user.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
