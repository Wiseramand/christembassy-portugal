"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Download, Search, BookOpen, ExternalLink } from 'lucide-react';

const books = [
  {
    id: 1,
    title: 'O Poder da Sua Mente',
    author: 'Pastor Chris Oyakhilome',
    description: 'Acredite na vida divina que Cristo trouxe. Este livro ensina-o a usar a sua mente para mudar as circunstâncias da sua vida.',
    image: '/images/services.jpg', // Placeholder
    pdf_url: '#',
    category: 'Crescimento Espiritual'
  },
  {
    id: 2,
    title: 'Como Rezar Eficazmente',
    author: 'Pastor Chris Oyakhilome',
    description: 'Descubra os princípios vitais da oração eficaz que produz resultados e muda o mundo ao seu redor.',
    image: '/images/services.jpg', // Placeholder
    pdf_url: '#',
    category: 'Oração'
  },
  {
    id: 3,
    title: 'O Teu Espírito Recreativo',
    author: 'Pastor Chris Oyakhilome',
    description: 'Entenda a natureza do seu espírito humano e como ele pode ser recriado pela Palavra de Deus.',
    image: '/images/services.jpg', // Placeholder
    pdf_url: '#',
    category: 'Identidade em Cristo'
  },
  {
    id: 4,
    title: 'A Porta Para A Glória',
    author: 'Pastor Chris Oyakhilome',
    description: 'Aprenda como a meditação na Palavra de Deus é a chave para viver na glória de Deus diariamente.',
    image: '/images/services.jpg', // Placeholder
    pdf_url: '#',
    category: 'Meditação'
  }
];

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="bg-navy py-24 relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-wine/5 via-transparent to-transparent z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center text-gold mx-auto mb-6"
          >
            <Book size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-poppins font-bold mb-6"
          >
            Livraria Digital
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10">
            Aceda a uma coleção curada de livros do Pastor Chris Oyakhilome para fortalecer a sua fé e conhecimento da Palavra.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Pesquisar por título ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-gold/30 focus:bg-white/15 transition-all text-white placeholder:text-gray-500"
            />
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book, idx) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all group flex flex-col h-full"
            >
              {/* Book Cover Placeholder */}
              <div className="aspect-[3/4] bg-navy relative overflow-hidden">
                 <img 
                   src={book.image} 
                   alt={book.title}
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                 />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <BookOpen size={48} className="text-gold mb-4 opacity-40" />
                    <span className="text-white font-poppins font-bold text-lg leading-tight">{book.title}</span>
                    <span className="text-gold/80 text-xs mt-2 uppercase tracking-widest">{book.category}</span>
                 </div>
                 <div className="absolute top-4 right-4">
                    <span className="bg-wine text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">PDF</span>
                 </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-poppins font-bold text-navy mb-2 line-clamp-1">{book.title}</h3>
                <p className="text-gray-400 text-xs font-medium mb-4">Por {book.author}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {book.description}
                </p>
                
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-wine font-bold text-sm hover:gap-3 transition-all">
                    Ler Mais <ExternalLink size={14} />
                  </button>
                  <a 
                    href={book.pdf_url}
                    className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all"
                    title="Descarregar PDF"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-24">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Search size={32} />
             </div>
             <h3 className="text-2xl font-poppins font-bold text-navy">Nenhum livro encontrado</h3>
             <p className="text-gray-500">Tente ajustar a sua pesquisa ou explorar outras categorias.</p>
          </div>
        )}
      </section>

      {/* Rhapsody CTA */}
      <section className="py-24 bg-wine">
         <div className="container mx-auto px-6">
            <div className="bg-white/5 rounded-[3rem] p-12 md:p-20 border border-white/10 relative overflow-hidden">
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="text-white space-y-6">
                     <h2 className="text-3xl md:text-5xl font-poppins font-bold">Rhapsody of Realities</h2>
                     <p className="text-white/70 text-lg leading-relaxed">
                        Descarregue a edição deste mês do nosso devocional diário e transforme a sua vida com revelações frescas da Palavra de Deus todos os dias.
                     </p>
                     <button className="bg-gold text-navy px-10 py-4 rounded-full font-bold hover:bg-white transition-all flex items-center gap-3">
                        Descarregar Edição Atual
                        <Download size={20} />
                     </button>
                  </div>
                  <div className="relative hidden lg:block">
                     <div className="w-64 h-80 bg-white/10 rounded-3xl mx-auto rotate-6 border border-white/20 backdrop-blur-md flex items-center justify-center">
                        <BookOpen size={64} className="text-gold opacity-50" />
                     </div>
                     <div className="absolute top-0 left-1/4 w-64 h-80 bg-gold rounded-3xl -rotate-6 shadow-2xl flex flex-col p-8 items-center justify-center text-center">
                        <span className="text-navy font-poppins font-black text-2xl uppercase italic">Rhapsody</span>
                        <span className="text-navy/60 text-sm font-bold mt-2">Daily Devotional</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
