import "dotenv/config";
import { db } from "./lib/db";

async function fix() {
  try {
    const article = await db.article.findFirst({
      where: { slug: "daily news" }
    });
    
    if (article) {
      await db.article.update({
        where: { id: article.id },
        data: { slug: "daily-news" }
      });
      console.log("✅ Fixed slug for 'daily news' -> 'daily-news'");
    } else {
      console.log("ℹ️ No article with slug 'daily news' found.");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await db.$disconnect();
  }
}

fix();
