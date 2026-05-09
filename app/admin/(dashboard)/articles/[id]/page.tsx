import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ArticleForm from "@/components/admin/ArticleForm";

type Props = { params: Promise<{ id: string }> };

async function getArticle(id: string) {
  return db.article.findUnique({
    where: { id },
    include: { translations: true },
  });
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary mb-8">Edit Article</h1>
      <ArticleForm article={article} />
    </div>
  );
}
