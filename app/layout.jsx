import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import { ThemeProvider } from "@/context/ThemeContext";

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
  try {
    const fd = new FormData();
    fd.append("meta_id", "1");

    const res = await fetch("https://irisinformatics.net/dating/Wb/meta_detail", {
      method: "POST",
      body: fd,
      cache: "no-store",
    });

    const json = await res.json();
    const data = json?.data;

    return {
      metadataBase: new URL("https://olyvva.com"),
      title: data?.title || "Olyvva",
      description: data?.description || "Best escort service",
      keywords: data?.keyword || "escorts, affair escorts",
      icons: {
        icon: data?.favicon
          ? [{ url: data.favicon, type: "image/webp" }]
          : [{ url: "/favicon.ico" }],
        apple: data?.favicon
          ? [{ url: data.favicon, type: "image/webp" }]
          : [{ url: "/apple-touch-icon.png" }],
      },
      alternates: { canonical: "./" },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      },
      openGraph: {
        title: data?.title || "Olyvva",
        description: data?.description || "Best escort service",
        url: "https://affairescorts.com",
        siteName: data?.title || "Olyvva",
        type: "website",
      },
    };
  } catch (error) {
    console.log("Metadata API failed:", error);
    return {
      metadataBase: new URL("https://affairescorts.com"),
      title: "Olyvva",
      description: "Best escort service",
      icons: {
        icon: [{ url: "/favicon.ico" }],
        apple: [{ url: "/apple-touch-icon.png" }],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      },
      openGraph: {
        title: "Olyvva",
        description: "Best escort service",
        url: "https://affairescorts.com",
        siteName: "Olyvva",
        type: "website",
      },
    };
  }
}

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Olyvva",
    url: "https://affairescorts.com",
    logo: "https://affairescorts.com/logo.png",
    sameAs: [
      "https://www.facebook.com/",
      "https://www.instagram.com/",
      "https://twitter.com/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English"],
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>

      {/*  Removed color classes — ThemeContext sets body bg/text dynamically */}
      <body className={`${poppins.className} antialiased`}>
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