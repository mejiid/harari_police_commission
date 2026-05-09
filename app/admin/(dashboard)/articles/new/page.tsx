import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary mb-8">New Article</h1>
      <ArticleForm />
    </div>
  );
}
