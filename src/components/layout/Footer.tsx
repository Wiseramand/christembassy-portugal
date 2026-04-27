import React from 'react';
import Link from 'next/link';
import { Globe, Users, Play, Radio, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-wine rounded-full flex items-center justify-center text-white font-bold">
                CE
              </div>
              <span className="text-xl font-poppins font-bold tracking-tight">Christ Embassy PT</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Dando um sentido à sua vida. Junte-se a nós para uma experiência de transformação de vida na Christ Embassy Angola.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                <Users size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                <Play size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-navy transition-all">
                <Radio size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-poppins font-bold mb-6 text-gold">Links Rápidos</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link href="/watch" className="text-gray-400 hover:text-white transition-colors">Assistir em Direto</Link></li>
              <li><Link href="/give" className="text-gray-400 hover:text-white transition-colors">Dar / Ofertas</Link></li>
              <li><Link href="/testimonials" className="text-gray-400 hover:text-white transition-colors">Testemunhos</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-poppins font-bold mb-6 text-gold">Informações de Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-gold shrink-0 mt-1" size={18} />
                <span className="text-gray-400 text-sm leading-relaxed">
                  Luanda, Angola
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-gold shrink-0" size={18} />
                <span className="text-gray-400 text-sm">+351 000 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-gold shrink-0" size={18} />
                <span className="text-gray-400 text-sm">contacto@ceangola.ao</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-poppins font-bold mb-6 text-gold">Mantenha-se Atualizado</h4>
            <p className="text-gray-400 text-sm mb-4">Subscreva a nossa newsletter para receber as últimas novidades.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Endereço de email" 
                className="bg-white/5 border border-white/10 px-4 py-2 rounded-l-lg focus:outline-none focus:border-gold w-full text-sm"
              />
              <button className="bg-gold text-navy px-4 py-2 rounded-r-lg font-bold hover:bg-gold/90 transition-all text-sm">
                Subscrever
              </button>
            </form>
          </div>
        </div>

        <div className="h-px bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Christ Embassy Angola. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Termos de Serviço</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
