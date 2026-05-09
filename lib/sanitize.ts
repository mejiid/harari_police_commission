// Strip HTML tags and trim input to prevent XSS in plain text fields
export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .trim()
    .slice(0, 5000); // max length guard
}

export function sanitizeEmail(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim().toLowerCase().slice(0, 254);
}
