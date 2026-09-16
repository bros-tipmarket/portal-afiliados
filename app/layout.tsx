import type { Metadata } from "next";
import "./globals.css";
import "./brand.css";

export const metadata: Metadata = {
  title: "TipMarket Partners | Portal do afiliado",
  description: "Resultados, campanhas, links e extratos da sua parceria TipMarket.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}

