import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Dashboard Application",
  description: "A professional and modern dashboard application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0f172a] text-slate-50">
        {children}
      </body>
    </html>
  );
}
