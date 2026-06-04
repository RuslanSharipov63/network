import type { Metadata } from "next";
import { Providers } from "./redux/provider";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import "./global.css"; 


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
