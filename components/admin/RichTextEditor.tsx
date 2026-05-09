"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type Props = {
  content: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[200px] px-4 py-3 text-sm text-text focus:outline-none",
      },
    },
  });

  // Sync external content changes (e.g. tab switch)
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border border-border rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-border bg-surface">
        {[
          { label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
          { label: "I", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
          { label: "S", action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike") },
          { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
          { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
          { label: "UL", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
          { label: "OL", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
          { label: "—", action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              btn.active
                ? "bg-primary text-white"
                : "bg-white border border-border text-text hover:bg-surface"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
