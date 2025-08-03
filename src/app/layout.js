import { Roboto } from "next/font/google";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "3D AI Teacher",
  description: "Learn Spanish with AI Teacher",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <body className={roboto.className}>{children}</body>
    </html>
  );
}