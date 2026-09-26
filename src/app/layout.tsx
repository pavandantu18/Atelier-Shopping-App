import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
const interfaceFont = localFont({src: [{path:"./fonts/jost-regular.ttf",weight:"400",style:"normal"},{path:"./fonts/jost-medium.ttf",weight:"500",style:"normal"}],variable:"--font-interface",display:"swap"});
const editorialFont = localFont({src:"./fonts/cormorant-regular.ttf",weight:"400",variable:"--font-editorial",display:"swap"});

export const metadata: Metadata = {
  title: "Atelier — A wardrobe, considered",
  description:
    "Discover the autumn edit: considered silhouettes, everyday companions, and a quieter approach to personal style.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interfaceFont.variable} ${editorialFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
