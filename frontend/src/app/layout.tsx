import type { Metadata } from "next";
import { Providers } from "./redux/provider";
/* import { Geist, Geist_Mono } from "next/font/google"; */
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import "./global.css";

/* const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

const geistMono = Geist_Mono({
variable: "--font-geist-mono",
subsets: ["latin"],
}); */

export const metadata: Metadata = {
  title: "Ты мне, я тебе",
  description: "Социальная сеть взаимопомощи.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <HeaderComponent />
          <div className="AppContainer">{children}</div>
          <FooterComponent />
        </Providers>
      </body>
    </html>
  );
}
