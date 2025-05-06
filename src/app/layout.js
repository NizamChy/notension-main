import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Poppins } from "next/font/google";
import ReduxProvider from "@/redux/ReduxProvider";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "NoTension | E-commerce Platform.",
  description:
    "NoTension is an E-commerce Online Service Provider. You can get all kinds of services like Grocery Stores, Medicine, Food, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ReduxProvider>
          <Toaster />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
