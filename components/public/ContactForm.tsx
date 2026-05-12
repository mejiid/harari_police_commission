"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed");
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-10 bg-surface-container-low border border-outline-variant/30 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {t("name")} <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="John Doe"
            className="w-full bg-white border border-outline-variant/50 px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/30"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {t("email")} <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
            className="w-full bg-white border border-outline-variant/50 px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {t("subject")} <span className="text-accent">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="Subject of inquiry"
          className="w-full bg-white border border-outline-variant/50 px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/30"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {t("message")} <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Detailed message..."
          className="w-full bg-white border border-outline-variant/50 px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/30 resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
        <div className="flex-1">
          {state === "success" && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 border border-green-100 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
              {t("success")}
            </div>
          )}
          {state === "error" && (
            <div className="flex items-center gap-2 text-accent bg-accent/5 px-4 py-2 border border-accent/10 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {t("error")}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full sm:w-auto bg-primary text-white font-bold px-12 py-5 text-[10px] uppercase tracking-[0.3em] hover:bg-primary-container transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
        >
          {state === "loading" ? "Processing..." : t("submit")}
        </button>
      </div>
    </form>
  );
}
