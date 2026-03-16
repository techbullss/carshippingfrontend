import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./Context/AuthContext";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "F-carshipping - Your Trusted Vehicle Import Partner in Kenya",
  description:
    "Your trusted partner for importing quality vehicles into Kenya. We simplify the process, ensuring authenticity, transparency, and exceptional service from Europe to Mombasa.",

 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundImage: "url('/ocean3.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
        className={`${geistSans.variable} ${geistMono.variable} relative w-full h-full min-h-screen antialiased`}
      >
     
          <div className="mx-[2%]  bg-gray-50 border-l-2 border-rounded rounded border-t-2 border-t-green-500 border-gray-100 shadow-lg">
            <Header />
            {children}
            <Footer />
          </div>
        <FloatingWhatsApp />
      </body>
    </html>

  );
}
