import type { Metadata } from "next";
import { Pixelify_Sans, Silkscreen } from "next/font/google";
import "./globals.css";

const display = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
});
const body = Pixelify_Sans({ variable: "--font-pixelify", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Huacoween: Pollo a la Brasa del Más Allá",
  description:
    "Un escape point-and-click de Halloween, tenebroso y chistoso, en pixel art.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} antialiased`}
    >
      <body className="bg-night font-sans text-white">{children}</body>
    </html>
  );
}
