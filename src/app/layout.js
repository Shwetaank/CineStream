import localFont from "next/font/local";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// Font optimization
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  preload: true, // Preload the font for better performance
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  preload: true,
});

// Metadata optimization
export const metadata = {
  title: "CineStream",
  description: "Your One Stop Destination for Movies, TV Shows, Animes",
  keywords: [
    "movies",
    "tv shows",
    "animes",
    "streaming",
    "search",
    "CineStream",
  ],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        <head>
          <ThemeModeScript />
          {/* Ensure any other necessary meta tags for SEO and accessibility */}
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-200`}
        >
          {/* Flowbite integration for UI components */}
          <Flowbite>
            <Header />
            <main className="flex-grow">{children}</main>{" "}
            {/* Flex-grow for full page main content */}
            <Footer />
          </Flowbite>
        </body>
      </html>
    </ClerkProvider>
  );
}
