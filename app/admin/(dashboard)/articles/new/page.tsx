import ArticleForm from "@/components/admin/ArticleForm";
import { FilePlus2 } from "lucide-react";

export default function NewArticlePage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-outline-variant/30 pb-8">
        <div>
          <h1 className="display-sm text-primary">New Article</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-2 font-bold flex items-center gap-2">
            <FilePlus2 className="w-3 h-3 text-accent" />
            Drafting Institutional Content
          </p>
        </div>
      </div>

      <div className="max-w-6xl">
        <ArticleForm />
      </div>
    </div>
  );
}
