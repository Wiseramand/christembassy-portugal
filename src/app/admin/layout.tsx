"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Video, 
  Calendar, 
  MessageSquare, 
  Heart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Church,
  ChevronRight,
  Book
} from 'lucide-react';
import Link from 'next/link';

const sidebarLinks = [
  { name: 'Painel', href: '/admin', icon: LayoutDashboard },
  { name: 'Visitantes em Direto', href: '/admin/visitors', icon: Users },
  { name: 'Página Inicial / Hero', href: '/admin/stream', icon: Video },
  { name: 'Eventos', href: '/admin/events', icon: Calendar },
  { name: 'Vídeos', href: '/admin/videos', icon: Video },
  { name: 'Testemunhos', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Doações', href: '/admin/donations', icon: Heart },
  { name: 'Livraria', href: '/admin/books', icon: Book },
  { name: 'Mensagens', href: '/admin/messages', icon: MessageSquare },
  { name: 'Definições', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(true);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
        setIsAdmin(false);
      } else if (session) {
        setIsAdmin(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  if (pathname === '/admin/login') return <>{children}</>;
  
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="w-8 h-8 border-4 border-navy/10 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="p-8 border-b border-gray-50 mb-4 bg-gray-50/20">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-wine rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-wine/20 group-hover:scale-105 transition-transform duration-300">
               CE
            </div>
            <div className="flex flex-col">
               <span className="font-poppins font-black text-navy text-lg block leading-tight tracking-tight">Painel</span>
               <span className="text-[10px] uppercase font-bold text-gold tracking-[0.2em]">Portugal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow px-6 space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-navy text-white shadow-md active:scale-95" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-navy"
                }`}
              >
                <Icon size={20} />
                <span className="font-bold text-sm tracking-wide">{link.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-wine font-bold hover:bg-wine/5 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-white">
            <Church size={16} />
          </div>
          <span className="font-poppins font-bold text-navy text-sm uppercase tracking-widest">Admin PT</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-navy hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col p-8 drawer-slide-in">
             {/* Same links as desktop but inside the drawer */}
             <div className="mb-8">
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Navegação</span>
             </div>
             <nav className="flex-grow space-y-4">
                {sidebarLinks.map((link) => (
                   <Link 
                     key={link.href} 
                     href={link.href}
                     onClick={() => setSidebarOpen(false)}
                     className={`flex items-center gap-3 py-2 ${pathname === link.href ? 'text-wine font-bold' : 'text-gray-500 font-medium'}`}
                   >
                     <link.icon size={20} />
                     {link.name}
                   </Link>
                ))}
             </nav>
             <button onClick={handleLogout} className="flex items-center gap-3 text-wine font-bold py-4">
                <LogOut size={20} /> Sair
             </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-12 pt-24 lg:pt-12">
        {children}
      </main>
    </div>
  );
}
