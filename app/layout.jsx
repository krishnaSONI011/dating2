import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import { ThemeProvider } from "@/context/ThemeContext";
import api from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {

  const fd = new FormData();
  fd.append("meta_id", "1");

  const res = await api.post("/Wb/meta_detail", fd);
  const data = res.data?.data;

  return {
    metadataBase: new URL("https://affairescorts.com"),

    title: data?.title,
    description: data?.description,

    alternates: {
      canonical: "./",
    },

    openGraph: {
      title: data?.title,
      description: data?.description,
      url: "./",
      siteName: data?.title,
      type: "website",
    },
  };
}

export default function RootLayout({ children }) {

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Affair Escorts",
    url: "https://affairescorts.com",
    logo: "https://affairescorts.com/logo.png",
    sameAs: [
      "https://www.facebook.com/",
      "https://www.instagram.com/",
      "https://twitter.com/"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English"]
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>

      <body
        className={`${poppins.className} antialiased bg-(--website-background) text-(--webiste-text)`}
      >
        <AuthProvider>
          <WalletProvider>
            <ThemeProvider>

              <ToastContainer
                position="top-center"
                autoClose={5000}
                theme="colored"
              />

              <Navbar />
              {children}
              <Footer />

            </ThemeProvider>
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}