import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Prison Police Commission",
    template: "%s | Prison Police Commission",
  },
  description: "Official website of the Prison Police Commission",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
