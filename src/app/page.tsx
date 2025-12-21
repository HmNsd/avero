'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  const headerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // GSAP animations
    gsap.fromTo(headerRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    
    gsap.fromTo(titleRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, delay: 0.3, ease: "back.out(1.7)" }
    );
  }, []);
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-black flex flex-col transition-colors duration-300">
      <ThemeToggle />
      <header ref={headerRef} className="w-full py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 backdrop-blur-md bg-stone-100/80 dark:bg-white/10 border-b border-stone-300/50 dark:border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
              BnC Auth
            </span>
          </div>
          <nav className="flex gap-1 sm:gap-2 md:gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/login"
                className="text-stone-900 dark:text-white text-xs sm:text-sm md:text-lg lg:text-xl hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors px-1.5 sm:px-2 py-1 rounded-md hover:bg-stone-200/50 dark:hover:bg-white/10"
              >
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/signup"
                className="text-stone-900 dark:text-white text-xs sm:text-sm md:text-lg lg:text-xl hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors px-1.5 sm:px-2 py-1 rounded-md hover:bg-stone-200/50 dark:hover:bg-white/10"
              >
                Signup
              </Link>
            </motion.div>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <motion.div 
          className="w-full max-w-4xl text-center space-y-6 sm:space-y-8 md:space-y-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
        <h1 ref={titleRef} className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-stone-900 dark:text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-lg leading-tight px-2">
          Welcome to{" "}
          <motion.span 
            className="text-indigo-600 dark:text-indigo-400 block xs:inline mt-1 xs:mt-0 sm:mt-2 sm:block md:inline md:mt-0"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            BnC Auth
          </motion.span>
        </h1>
        <motion.p 
          className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-stone-700 dark:text-gray-200 mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          A modern authentication starter built with Next.js, featuring email
          verification, password reset, and a beautiful UI.
        </motion.p>
        <motion.div 
          className="flex flex-row gap-2 mb-8 sm:mb-10 md:mb-16 justify-center px-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="bg-stone-200 dark:bg-gray-800 hover:bg-stone-300 dark:hover:bg-gray-700 text-stone-900 dark:text-white font-medium py-2 px-3 rounded-lg shadow-md transition-all duration-300 text-sm border border-stone-300 dark:border-gray-700 hover:scale-105 w-20 text-center"
            >
              Login
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/signup"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg shadow-md transition-all duration-300 text-sm hover:scale-105 w-20 text-center"
            >
              Signup
            </Link>
          </motion.div>
        </motion.div>
        <motion.ol 
          className="bg-stone-200/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 text-left text-stone-700 dark:text-gray-200 text-xs sm:text-sm md:text-base w-full max-w-2xl mx-auto shadow-xl space-y-2 sm:space-y-3 md:space-y-4 border border-stone-300/50 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {[
            "Register with your email and password.",
            "Verify your email address.", 
            "Login and manage your profile securely.",
            "Forgot your password? Easily reset it via email."
          ].map((text, index) => (
            <motion.li 
              key={index}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
            >
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-base sm:text-lg md:text-xl flex-shrink-0">
                {index + 1}.
              </span>
              <span className="leading-relaxed">{text}</span>
            </motion.li>
          ))}
        </motion.ol>
        </motion.div>
      </main>
      <motion.footer 
        className="w-full py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 backdrop-blur-md bg-stone-100/80 dark:bg-white/10 border-t border-stone-300/50 dark:border-white/20 shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 sm:gap-3 md:gap-4 text-stone-700 dark:text-white">
          <motion.div 
            className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2 }}
          >
            {[
              { href: "https://www.linkedin.com/in/hmnsd/", text: "LinkedIn" },
              { href: "https://github.com/HmNsd", text: "GitHub" },
              { href: "https://hmnsd.github.io/hmnsd-portfolio/", text: "About" }
            ].map((link, index) => (
              <motion.a
                key={link.text}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-1 rounded-md hover:bg-stone-200/50 dark:hover:bg-white/10"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 2.1 + index * 0.1 }}
              >
                {link.text}
              </motion.a>
            ))}
          </motion.div>
          <motion.span 
            className="text-xs sm:text-sm text-center leading-relaxed px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.4 }}
          >
            © {new Date().getFullYear()} Secure Auth Next.js App by Brewncode
          </motion.span>
        </div>
      </motion.footer>
    </div>
  );
}
