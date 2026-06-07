import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Commune de Nouirat - Portail Citoyen",
  description: "Portail officiel des services administratifs et de gestion de la commune de Nouirat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen bg-[#0f172a] text-slate-50">
        {children}
      </body>
    </html>
  );
}
