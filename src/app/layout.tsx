import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://unir-pdf.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Unir PDF online | Combinar PDFs gratis",
    template: "%s | Unir PDF online",
  },
  description:
    "Combina dos o más archivos PDF en uno solo. Reordena documentos con arrastrar y soltar, genera tu PDF unido al instante y sin subir archivos a un servidor.",
  keywords: [
    "unir pdf",
    "combinar pdf",
    "fusionar pdf",
    "juntar pdf online",
    "merge pdf español",
  ],
  openGraph: {
    title: "Unir PDF online | Combinar PDFs gratis",
    description:
      "Herramienta gratuita para unir varios PDF en uno. Ordena tus documentos y descarga el resultado al instante.",
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Unir PDF online",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unir PDF online | Combinar PDFs gratis",
    description:
      "Combina PDFs en segundos. Todo ocurre en tu navegador, sin registro.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        {children}
        <footer className="border-t py-6 text-center text-xs text-muted-foreground">
          Unir PDF online — procesamiento local en tu navegador
        </footer>
      </body>
    </html>
  );
}
