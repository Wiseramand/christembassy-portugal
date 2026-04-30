"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Download, Search, BookOpen, ExternalLink, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const fallbackBooks = [
  {
    id: 'fb1',
    title: 'O Poder da Sua Mente',
    author: 'Pastor Chris Oyakhilome',
    description: 'Acredite na vida divina que Cristo trouxe. Este livro ensina-o a usar a sua mente para mudar as circunstâncias da sua vida.',
    image_url: '/images/services.jpg', 
    pdf_url: '#',
    category: 'Crescimento Espiritual'
  }
];

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data && data.length > 0) {
          setBooks(data);
        } else {
          setBooks(fallbackBooks);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        setBooks(fallbackBooks);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => 
    (book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <section className="py-12 container mx-auto px-6">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-navy/10 border-t-gold rounded-full animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">A carregar biblioteca...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredBooks.map((book, idx) => (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all group flex flex-col h-full"
              >
                {/* Book Cover */}
                <div className="aspect-[3/4] bg-navy relative overflow-hidden">
                   <img 
                     src={book.image_url || '/images/services.jpg'} 
                     alt={book.title}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                   />
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <BookOpen size={48} className="text-gold mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                      <span className="text-white font-poppins font-bold text-lg leading-tight drop-shadow-md">{book.title}</span>
                      <span className="text-gold/90 text-[10px] mt-2 uppercase tracking-widest font-bold">{book.category}</span>
                   </div>
                   <div className="absolute top-4 right-4">
                      <span className="bg-wine text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">PDF</span>
                   </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-base font-poppins font-bold text-navy mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-gray-400 text-[10px] font-medium mb-3 uppercase tracking-widest">Por {book.author}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                    {book.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                    <a 
                      href={book.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-grow flex items-center justify-center gap-2 bg-navy text-white py-2 rounded-lg font-bold text-[11px] hover:bg-wine transition-all"
                    >
                      <Eye size={12} />
                      Ler
                    </a>
                    <a 
                      href={book.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all shrink-0"
                      title="Descarregar PDF"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredBooks.length === 0 && (
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
                     <a 
                       href="https://rhapsodyofrealities.org" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="bg-gold text-navy px-10 py-4 rounded-full font-bold hover:bg-white transition-all inline-flex items-center gap-3"
                     >
                        Descarregar Edição Atual
                        <Download size={20} />
                     </a>
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
