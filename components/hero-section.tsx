"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiArrowRight } from "react-icons/fi";
import dynamic from "next/dynamic";

const Hero3DScene = dynamic(() => import("./hero-3d-scene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#030712]" />,
});

const titles = [
  "Full Stack Engineer",
  "Software Developer",
  "AI Solutions Architect",
  "Java Ecosystem Expert",
  "Cloud-Native Developer",
];

export default function HeroSection() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const sectionRef = useRef<HTMLElement>(null);

  /* Framer-motion parallax: fade/scale/translate content as user scrolls away */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    const timer = setTimeout(() => {
      if (isDeleting) {
        setDisplayedTitle(currentTitle.substring(0, displayedTitle.length - 1));
        setTypingSpeed(50);
        if (displayedTitle.length === 0) {
          setIsDeleting(false);
          setTitleIndex((titleIndex + 1) % titles.length);
          setTypingSpeed(150);
        }
      } else {
        setDisplayedTitle(
          currentTitle.substring(0, displayedTitle.length + 1)
        );
        if (displayedTitle.length === currentTitle.length) {
          setTypingSpeed(2000);
          setTimeout(() => setIsDeleting(true), 2000);
        } else {
          setTypingSpeed(150);
        }
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedTitle, isDeleting, titleIndex, typingSpeed]);

  return (
    <section ref={sectionRef} id="home" className="min-h-screen relative overflow-hidden">
      {/* Content — rendered first, sits below 3D */}
      <div className="absolute inset-0 z-0 bg-[#030712]" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#030712]/90 via-[#030712]/40 to-transparent pointer-events-none" style={{ clipPath: "inset(0 40% 0 0)" }} />
      <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[#030712]/60 via-transparent to-[#030712]/20 pointer-events-none" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative z-[4] container mx-auto px-4 md:px-6 min-h-screen flex items-center pt-20 pointer-events-none"
      >
        <motion.div
          className="w-full md:w-2/3 lg:w-3/5 max-w-2xl pointer-events-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-blue-400 text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Hello, I&apos;m Idrissa Maiga
          </motion.span>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-[1.1] text-white">
            Building digital
            <br />
            experiences with
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              passion
            </span>{" "}
            and
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              {" "}
              precision
            </span>
          </h1>

          <div className="h-10 mb-8">
            <span className="text-xl sm:text-2xl font-mono text-blue-300/90">
              &gt; {displayedTitle}
              <span className="inline-block w-0.5 h-6 bg-blue-400 ml-1 animate-pulse" />
            </span>
          </div>

          <p className="text-base sm:text-lg text-gray-300/80 mb-10 max-w-xl leading-relaxed">
            Transforming ideas into robust, elegant solutions with modern
            technologies and a focus on performance, security, and user
            experience.
          </p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <a
              href="/#projects"
              className="group relative px-6 sm:px-8 py-3 rounded-xl bg-blue-600 text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:bg-blue-500"
            >
              <span className="relative z-10 flex items-center">
                View Projects
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="/#connect"
              className="px-6 sm:px-8 py-3 rounded-xl border border-white/20 text-white font-medium backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              Get In Touch
            </a>
          </motion.div>

          <motion.div
            className="flex mt-10 sm:mt-12 space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <a
              href="https://github.com/IdrissaMaiga"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/10 transition-all duration-300"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/idrissa-maiga-16581b245"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/10 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:idrissa.maiga@iditechs.com"
              className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/10 transition-all duration-300"
              aria-label="Email"
            >
              <FiMail className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 3D Scene — on top, interactive on right half */}
      <div className="absolute inset-0 z-[3]" style={{ clipPath: "inset(0 0 0 0)" }}>
        <Hero3DScene />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[4] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{ opacity: contentOpacity }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2.5 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Wave transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none">
        <svg
          className="block w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ height: "80px" }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-[#0a0f1e]"
          />
        </svg>
      </div>
    </section>
  );
}
