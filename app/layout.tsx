import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Recipe Generator",
  description: "Generate recipes from ingredients and available cook time."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
