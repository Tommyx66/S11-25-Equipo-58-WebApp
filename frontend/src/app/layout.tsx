import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Righteous } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/contexts/UIContext";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClerkTokenLogger } from "@/components/ClerkTokenLogger";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const _righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0F8354",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://s11-25-equipo-58-web-app.vercel.app/"),
  title: {
    default: "EcoShop | Tu Mercado de Impacto Positivo",
    template: "%s | EcoShop",
  },
  description: "Descubre productos certificados de bajo impacto ambiental. Transparencia total en huella de carbono, origen y trazabilidad.",
  applicationName: "EcoShop",
  openGraph: {
    title: "EcoShop | Consumo Responsable y Transparente",
    siteName: "EcoShop",
    locale: "es_AR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" className="scroll-smooth">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${_righteous.variable} antialiased selection:bg-[#0F8354] selection:text-white`}
        >
          <QueryProvider>
            <UIProvider>
              <CartProvider>
                <UserProvider>
                  
                  <SmoothScroll>
                    <ClerkTokenLogger />
                    <div className="relative z-10 flex min-h-screen flex-col">
                      <Header />
                      <main className="flex-1">
                        {children}
                      </main>
                      <Footer />
                    </div>
                  </SmoothScroll>

                </UserProvider>
              </CartProvider>
            </UIProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}