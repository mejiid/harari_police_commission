import "dotenv/config";
import { db } from "./lib/db";

async function cleanup() {
  try {
    const articles = await db.article.findMany();
    for (const article of articles) {
      const trimmed = article.slug.trim().replace(/\s+/g, "-").toLowerCase();
      if (trimmed !== article.slug) {
        await db.article.update({
          where: { id: article.id },
          data: { slug: trimmed }
        });
        console.log(`✅ Cleaned slug: "${article.slug}" -> "${trimmed}"`);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await db.$disconnect();
  }
}

cleanup();
