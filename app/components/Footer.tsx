// app/components/Footer.tsx

import Link from "next/link";
import { FaLinkedin, FaGithub, FaTwitter, FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full relative">
      {/* Footer Content */}
      <div className="relative max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200">
        <div className="flex flex-col-reverse md:flex-row justify-between items-start">
          {/* Left Section (Logo and Copyright) */}
          <div className="mt-6 md:mt-0 md:w-1/3">
            {/* Logo */}
            <div className="text-2xl font-bold mb-2"></div>
            {/* Thank You Message */}
            <p className="mb-4">Thanks for stopping by ☺</p>
            {/* Copyright */}
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-24">
              © 2025 . All Rights Reserved.
            </div>
          </div>

          {/* Right Section (Links and Elsewhere) */}
          <div className="flex md:w-2/3 md:justify-end space-x-12">
            {/* Combined Columns */}
            <div className="flex space-x-12">
              {/* Links Column */}
              <div></div>
              {/* Elsewhere Column */}
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
