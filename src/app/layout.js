import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/redux/ReduxProvider";
import { LocationBoundary } from "@/components/shared/Map/locationRefresh";
import { Hind_Siliguri, Poppins } from "next/font/google";
import QueryProvider from "@/components/FashionLifestyle/Provider/QueryProvider";

// const poppins = Poppins({
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={hindSiliguri.className}>
        <ReduxProvider>
          <QueryProvider>
            <Toaster />
            <LocationBoundary>{children}</LocationBoundary>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
