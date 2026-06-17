"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX, FiDownload, FiLogIn, FiLogOut } from "react-icons/fi";
import { useSession, signIn, signOut } from "next-auth/react";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "Story", href: "/#story" },
  { name: "Work", href: "/#projects" },
  { name: "Expertise", href: "/#skills" },
  { name: "Insights", href: "/#insights" },
  { name: "Connect", href: "/#connect" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/blog")) {
      setActiveSection("blog");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 10);

      if (window.location.pathname !== "/") return;

      const sectionIds = navLinks
        .filter((link) => link.href.startsWith("/#"))
        .map((link) => link.href.replace("/#", ""));
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-inset ${
        scrolled
          ? "py-3 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/10"
          : "py-3 sm:py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo & Name */}
        <Link
          href="/#home"
          className="flex items-center space-x-2 sm:space-x-3 group touch-friendly"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 overflow-hidden rounded-full transition-all duration-300 border-2 border-white/30 group-hover:border-blue-400">
            <Image
              src="/logos/id_.jpg"
              alt="Idrissa Maiga"
              width={80}
              height={80}
              className="scale-110 rounded-full"
            />
          </div>
          <div>
            <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors duration-300">
              Idrissa Maiga
            </span>
            <span className="block text-xs sm:text-sm text-gray-400 font-mono">
              Full-Stack Developer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <ul className="flex space-x-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                    (link.href === "/blog" ? activeSection === "blog" : activeSection === link.href.replace("/#", ""))
                      ? "text-blue-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.name}
                  {(link.href === "/blog" ? activeSection === "blog" : activeSection === link.href.replace("/#", "")) && (
                    <motion.span
                      layoutId="activeSection"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Resume Download Button */}
          <a
            href="/IdrissaMaigaCV.pdf"
            download
            className="hidden sm:flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 hover:text-blue-300 transition-all duration-200"
          >
            <FiDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Resume</span>
          </a>

          {/* Auth Button */}
          {session ? (
            <button
              onClick={() => signOut()}
              className="hidden sm:flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 text-gray-300 border border-white/10 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-200"
            >
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ""}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              )}
              <FiLogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="hidden sm:flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 text-gray-300 border border-white/10 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-200"
            >
              <FiLogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Sign In</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <FiMenu className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 bg-[#030712]/95 backdrop-blur-lg safe-area-inset"
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                        (link.href === "/blog" ? activeSection === "blog" : activeSection === link.href.replace("/#", ""))
                          ? "bg-blue-500/15 text-blue-400"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <a
                    href="/IdrissaMaigaCV.pdf"
                    download
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiDownload className="w-4 h-4" />
                    <span className="text-sm font-medium">Download Resume</span>
                  </a>
                </li>
                <li>
                  {session ? (
                    <button
                      onClick={() => { signOut(); setMobileMenuOpen(false); }}
                      className="flex items-center space-x-2 px-4 py-2.5 w-full bg-white/10 text-gray-300 border border-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
                    >
                      {session.user?.image && (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || ""}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      )}
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { signIn("google"); setMobileMenuOpen(false); }}
                      className="flex items-center space-x-2 px-4 py-2.5 w-full bg-white/10 text-gray-300 border border-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
                    >
                      <FiLogIn className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign In with Google</span>
                    </button>
                  )}
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
