import "./globals.css";

export const metadata = {
  title: "CRUD Next.js - Estudo de Props",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
