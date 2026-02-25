import { Playwrite_AT } from "next/font/google";
import { FaHandPaper } from "react-icons/fa";

const playwrite = Playwrite_AT({
  subsets: ["latin"],
});

export default function Footer() {
  return (
    <footer className="w-full bg-white text-black pt-14 pb-10 border-t">

      {/* Container */}
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-10">

          {/* Logo + badge */}
          <div>
            <h1 className="text-3xl font-semibold mb-4">
              Affair{" "}
              <span className={`${playwrite.className} text-[#ff4000]`}>
                Escorts
              </span>
            </h1>

            <span className="inline-block border px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100">
              RESTRICTED TO ADULTS
            </span>
          </div>

          {/* About text */}
          <p className="text-gray-600 leading-relaxed">
            Premium advertising platform for verified independent listings.
            We connect service providers with clients in a secure and
            professional environment.
          </p>
        </div>

        {/* STOP TRAFFICKING Banner */}
        <div className="border border-[#ff4000] rounded-2xl p-5 flex items-center gap-5 mb-12 bg-[#fff7f4]">
          
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#ff4000] text-white text-xl">
            <FaHandPaper />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[#ff4000] tracking-wide">
            STOP HUMAN TRAFFICKING
          </h2>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t pt-10">

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">LEGAL</h3>
            <ul className="space-y-2 text-gray-600">
              <li>2257 Exemption</li>
              <li>Terms of Service</li>
              <li>Disclaimer</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">SUPPORT</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Contact Us</li>
              <li>Help & FAQ</li>
              <li>Sitemap</li>
            </ul>
          </div>

          {/* Security */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">SECURITY</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">COMPANY</h3>
            <ul className="space-y-2 text-gray-600">
              <li>About Us</li>
              <li>Latest Blog</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="text-center text-gray-500 text-sm mt-12">
          © {new Date().getFullYear()} Affair Escorts. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
