"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Play, Heart, Globe, Users, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Início', href: '/' },
  { name: 'Sobre Nós', href: '/about' },
  { name: 'Testemunhos', href: '/testimonials' },
  { name: 'Contacto', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const forceLight = !isHome || scrolled;

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "glass-nav py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-wine rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
            CE
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "text-xl font-poppins font-bold tracking-tight leading-none transition-colors",
              forceLight ? "text-navy" : "text-white"
            )}>
              Christ Embassy
            </span>
            <span className="text-xs font-medium text-gold uppercase tracking-widest">Angola</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-gold",
                pathname === link.href 
                  ? "text-gold" 
                  : (forceLight ? "text-navy/80" : "text-white")
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <Link href="/watch" className="flex items-center gap-2 bg-wine text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-wine/90 transition-all">
              <Play size={16} fill="white" />
              Assistir em Direto
            </Link>
            <Link href="/give" className="flex items-center gap-2 bg-gold text-navy px-5 py-2 rounded-full text-sm font-semibold hover:bg-gold/90 transition-all">
              <Heart size={16} />
              Dar / Ofertas
            </Link>
            <div className="flex items-center gap-2">
              <a href="#" className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-gold hover:text-navy",
                forceLight ? "bg-navy/5 text-navy" : "bg-white/10 text-white"
              )}>
                <Globe size={16} />
              </a>
              <a href="#" className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-gold hover:text-navy",
                forceLight ? "bg-navy/5 text-navy" : "bg-white/10 text-white"
              )}>
                <Users size={16} />
              </a>
              <a href="#" className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-gold hover:text-navy",
                forceLight ? "bg-navy/5 text-navy" : "bg-white/10 text-white"
              )}>
                <Radio size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={cn(
            "md:hidden transition-colors",
            forceLight ? "text-navy" : "text-white"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-colors",
                    pathname === link.href ? "text-gold" : "text-navy hover:text-gold"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <Link 
                href="/watch" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-wine text-white py-3 rounded-xl font-bold"
              >
                <Play size={18} fill="white" />
                Assistir Agora
              </Link>
              <Link 
                href="/give" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-gold text-navy py-3 rounded-xl font-bold"
              >
                <Heart size={18} />
                Contribuir / Ofertas
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
