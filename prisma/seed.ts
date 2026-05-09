import "dotenv/config";
import { db } from "../lib/db";
import { auth } from "../lib/auth";

async function main() {
  console.log("Seeding database...");

  // Create super admin via Better Auth
  const existing = await db.user.findUnique({
    where: { email: "admin@prisoncommission.gov.et" },
  });

  if (!existing) {
    await auth.api.signUpEmail({
      body: {
        name: "Super Admin",
        email: "admin@prisoncommission.gov.et",
        password: "Admin@123456",
      },
    });

    // Update role to SUPER_ADMIN
    await db.user.update({
      where: { email: "admin@prisoncommission.gov.et" },
      data: { role: "SUPER_ADMIN" },
    });

    console.log("✅ Super admin created: admin@prisoncommission.gov.et / Admin@123456");
    console.log("⚠️  Change the password immediately after first login!");
  } else {
    console.log("ℹ️  Super admin already exists, skipping.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
