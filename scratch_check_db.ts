import "dotenv/config";
import { db } from "./lib/db";

async function check() {
  try {
    const articles = await db.article.findMany({
      include: { translations: true }
    });
    console.log("Articles in DB:", JSON.stringify(articles, null, 2));
  } catch (e) {
    console.error("Error checking DB:", e);
  } finally {
    await db.$disconnect();
  }
}

check();
