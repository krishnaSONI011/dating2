import { Geist, Geist_Mono  , Poppins} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import { WalletContext, WalletProvider } from "@/context/WalletContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const poppins = Poppins({
  
  subsets: ["latin"],
  weight : ['400' , '500' , "600"]
})
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Affair Escorts",
  description: "call girls ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}  antialiased bg-(--website-background) text-(--webiste-text)`}
        
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
