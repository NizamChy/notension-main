import "./globals.css";
import AppToaster from "@/components/shared/Toast/AppToaster";
import StoreProvider from "@/stores/StoreProvider";
import { LocationBoundary } from "@/components/shared/Map/locationRefresh";
import { Hind_Siliguri } from "next/font/google";
import QueryProvider from "@/components/shared/Providers/QueryProvider";
import BackendStatusBanner from "@/components/shared/BackendStatus/BackendStatusBanner";
import type { Metadata } from "next";
import type { ReactNode } from "react";

// const poppins = Poppins({
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NoTension | E-commerce Platform",
    template: "NoTension | %s",
  },
  description:
    "NoTension is an E-commerce Online Service Provider. You can get all kinds of services like Grocery Stores, Medicine, Food, and more.",
};

// Runs before the first paint: the site is light unless the visitor chose
// dark with the toggle, so a saved dark theme doesn't flash light.
const themeScript = `(function(){try{document.documentElement.classList.toggle("dark",localStorage.getItem("theme")==="dark")}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={hindSiliguri.className}>
        <StoreProvider>
          <QueryProvider>
            <AppToaster />
            <LocationBoundary>{children}</LocationBoundary>
            <BackendStatusBanner />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
