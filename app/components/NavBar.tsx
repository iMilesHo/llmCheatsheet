// app/components/NavBar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  FaLinkedin,
  FaGithub,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMd, setIsMd] = useState(false); // true if viewport width is >= 768px

  // Dropdown state for overflow links (hamburger menu)
  const [menuOpen, setMenuOpen] = useState(false);

  // Refs for the navbar container and the outer nav element
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // State to store the computed dropdown position
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownRight, setDropdownRight] = useState(0);

  // Ensure theme is hydrated before rendering icons
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for window resizes to update isMd
  useEffect(() => {
    function handleResize() {
      setIsMd(window.innerWidth >= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update the dropdown’s position (both top and right) relative to the nav element.
  useEffect(() => {
    function updateDropdownPosition() {
      if (containerRef.current && navRef.current) {
        // Because the nav element is the relative container for our absolute dropdown,
        // we can use the container’s offset values directly.
        const top =
          containerRef.current.offsetTop + containerRef.current.offsetHeight;
        setDropdownTop(top);
        // Compute the right offset so that the dropdown’s right aligns with the navbar container’s right.
        // navRef.current.offsetWidth is the full width of the nav element.
        // containerRef.current.offsetLeft + containerRef.current.offsetWidth is the container’s right edge relative to nav.
        const right =
          navRef.current.offsetWidth -
          (containerRef.current.offsetLeft + containerRef.current.offsetWidth);
        setDropdownRight(right);
      }
    }
    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    return () => window.removeEventListener("resize", updateDropdownPosition);
  }, [mounted, isMd, menuOpen]);

  if (!mounted) return null;

  // Complete set of nav links
  const navLinks = [
    { label: "Cheatsheet and Questions for LLM", href: "/blog" },
  ];

  // Show 5 links on desktop, else 2 on mobile.
  const visibleCount = isMd ? 5 : 2;
  const visibleLinks = navLinks.slice(0, visibleCount);
  const overflowLinks = navLinks.slice(visibleCount);

  // Show the hamburger button if there are overflow links
  const hasOverflow = overflowLinks.length > 0;

  // Handler to toggle the dropdown menu
  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  return (
    // Added padding on top, left, and right using Tailwind classes: pt-4 (top) and px-4 (sides)
    <nav ref={navRef} className="relative flex justify-center z-50 pt-4 px-4">
      {/* NAVBAR CONTAINER */}
      <div
        ref={containerRef}
        className="
          relative
          w-full max-w-4xl
          px-6 py-3
          flex items-center justify-between
          bg-white/30 dark:bg-gray-800/30
          backdrop-blur-md
          border border-white-25 dark:border-dark-gray-20
          rounded-md
        "
      >
        {/* LOGO */}
        <div className="text-2xl font-bold">
          <Link href="/blog">doc</Link>
        </div>

        {/* VISIBLE LINKS */}
        <div className="flex items-center space-x-2 md:space-x-6">
          {visibleLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)} // This closes the dropdown when a link is clicked.
              className="hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT AREA: Social Icons, Theme Toggle, and Hamburger Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <FaMoon className="text-xl hover:text-yellow-500" />
            ) : (
              <FaSun className="text-xl hover:text-yellow-300" />
            )}
          </button>
          {hasOverflow && (
            <button onClick={toggleMenu}>
              {menuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          )}
        </div>
      </div>
      {/* DROPDOWN MENU */}
      {menuOpen && hasOverflow && (
        <div
          style={{ top: dropdownTop - 1, right: dropdownRight + 15 }}
          className="
              absolute
              w-auto
              flex items-center justify-between
              bg-white/30 dark:bg-gray-800/30
              backdrop-blur-lg
              border-l border-r border-b border-white-25 dark:border-dark-gray-20
              border-t-0
              rounded-none rounded-b-md
              animate-slide-down
            "
          // On desktop, auto-close the menu when the mouse leaves the dropdown.
          onMouseLeave={isMd ? () => setMenuOpen(false) : undefined}
        >
          <div className="flex flex-col space-y-3 px-4 py-2">
            {overflowLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
