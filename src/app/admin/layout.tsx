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
  { name: 'Chat em Direto', href: '/admin/chat', icon: MessageSquare },
  { name: 'Página Inicial / Hero', href: '/admin/stream', icon: Video },
  { name: 'Eventos', href: '/admin/events', icon: Calendar },
  { name: 'Vídeos', href: '/admin/videos', icon: Video },
  { name: 'Testemunhos', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Doações', href: '/admin/donations', icon: Heart, role: 'admin' },
  { name: 'Livraria', href: '/admin/books', icon: Book },
  { name: 'Mensagens', href: '/admin/messages', icon: MessageSquare },
  { name: 'Definições', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      // If we already know we are an admin and we are not on the login page, skip
      if (isAdmin && pathname !== '/admin/login') return;

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        if (mounted) setIsAdmin(false);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted) {
          const role = user?.user_metadata?.role || user?.app_metadata?.role || 'admin';
          setUserRole(role);
          setIsAdmin(true);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setIsAdmin(false);
          setUserRole(null);
          if (pathname !== '/admin/login') router.push('/admin/login');
        }
      } else if (session && mounted) {
        if (!userRole) {
          const { data: { user } } = await supabase.auth.getUser();
          const role = user?.user_metadata?.role || user?.app_metadata?.role || 'admin';
          setUserRole(role);
        }
        setIsAdmin(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, pathname, isAdmin, userRole]);

  if (pathname === '/admin/login') return <>{children}</>;
  
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-navy/10 border-t-wine rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Verificando Acesso...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const filteredLinks = sidebarLinks.filter(link => {
    if (link.role === 'admin' && userRole === 'tecnico') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 h-screen sticky top-0 overflow-y-auto">
        <div className="p-8 border-b border-gray-50 mb-4 bg-gray-50/20 shrink-0">
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

        <nav className="flex-grow px-6 space-y-2 pb-8">
          {filteredLinks.map((link) => {
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

        <div className="p-6 border-t border-gray-50 shrink-0">
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
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col p-8 drawer-slide-in overflow-y-auto">
             {/* Same links as desktop but inside the drawer */}
             <div className="mb-8">
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Navegação</span>
             </div>
             <nav className="flex-grow space-y-4">
                {filteredLinks.map((link) => (
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

