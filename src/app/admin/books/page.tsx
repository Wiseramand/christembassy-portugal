"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  PlusCircle, 
  Save, 
  X,
  User,
  Tag,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface ChurchBook {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url: string;
  pdf_url: string;
  category: string;
}

export default function BooksAdminPage() {
  const [books, setBooks] = useState<ChurchBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<ChurchBook | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: 'Pastor Chris Oyakhilome',
    description: '',
    image_url: '',
    pdf_url: '',
    category: ''
  });

  async function fetchBooks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Books table error:', error.message);
      setBooks([]);
    } else {
      setBooks(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenModal = (book?: ChurchBook) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        image_url: book.image_url,
        pdf_url: book.pdf_url,
        category: book.category
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: 'Pastor Chris Oyakhilome',
        description: '',
        image_url: '',
        pdf_url: '',
        category: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookPayload = {
      ...formData,
      image_url: formData.image_url || '/images/services.jpg',
      updated_at: new Date().toISOString()
    };

    try {
      if (editingBook) {
        const { error } = await supabase
          .from('books')
          .update(bookPayload)
          .eq('id', editingBook.id);
        if (error) throw error;
        toast.success("Livro atualizado com sucesso");
      } else {
        const { error } = await supabase
          .from('books')
          .insert([bookPayload]);
        if (error) throw error;
        toast.success("Livro adicionado à livraria");
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (err: any) {
      toast.error("Falha na operação: " + err.message);
    }
  };

  async function handleDelete(id: string) {
    if (!confirm("Tem a certeza que deseja eliminar este livro?")) return;
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) {
      toast.error("Falha ao eliminar");
    } else {
      toast.success("Livro removido");
      setBooks(books.filter(b => b.id !== id));
    }
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Gestão da Livraria</h1>
           <p className="text-gray-500">Adicione e gira os livros digitais e PDFs disponíveis para os fiéis.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-wine transition-all shadow-lg active:scale-95 group"
        >
          <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
          Adicionar Novo Livro
        </button>
      </div>

      {loading ? (
         <div className="bg-white p-20 rounded-3xl text-center">
            <div className="w-10 h-10 border-4 border-navy/10 border-t-wine rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">A carregar Livraria...</p>
         </div>
      ) : books.length === 0 ? (
         <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-100">
            <Book className="mx-auto mb-6 text-gray-100" size={80} />
            <h3 className="text-xl font-poppins font-bold text-navy mb-2">A Livraria está Vazia</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Comece por adicionar o seu primeiro livro PDF para que os membros o possam descarregar.</p>
            <button onClick={() => handleOpenModal()} className="btn-primary">Começar Agora</button>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <motion.div 
                key={book.id}
                layout
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col"
              >
                <div className="aspect-[3/4] relative bg-navy/5">
                   <img 
                     src={book.image_url} 
                     alt={book.title}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                   />
                   <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(book)}
                        className="w-10 h-10 bg-white/90 backdrop-blur text-navy rounded-xl flex items-center justify-center hover:bg-gold transition-colors"
                      >
                         <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(book.id)}
                        className="w-10 h-10 bg-white/90 backdrop-blur text-wine rounded-xl flex items-center justify-center hover:bg-wine hover:text-white transition-colors"
                      >
                         <Trash2 size={18} />
                      </button>
                   </div>
                   <div className="absolute bottom-4 left-4">
                      <span className="bg-gold text-navy text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        {book.category}
                      </span>
                   </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                   <h3 className="text-xl font-poppins font-bold text-navy mb-2 line-clamp-1">{book.title}</h3>
                   <p className="text-gray-400 text-sm mb-4">Por {book.author}</p>
                   <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                      {book.description}
                   </p>
                   <div className="mt-auto pt-6 border-t border-gray-50 flex items-center gap-2 text-xs font-bold text-wine uppercase tracking-widest">
                      <LinkIcon size={14} />
                      Link do PDF Ativo
                   </div>
                </div>
              </motion.div>
            ))}
         </div>
      )}

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                 <h2 className="text-2xl font-poppins font-bold text-navy">
                    {editingBook ? 'Editar Livro' : 'Adicionar Novo Livro'}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-navy">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Título do Livro</label>
                    <input 
                      required
                      type="text"
                      placeholder="O Poder da Sua Mente"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Autor</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            required
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({...formData, author: e.target.value})}
                            className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
                       <div className="relative">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            required
                            type="text"
                            placeholder="Crescimento Espiritual"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">URL do PDF</label>
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <input 
                         required
                         type="text"
                         placeholder="/books/livro.pdf ou URL externa"
                         value={formData.pdf_url}
                         onChange={(e) => setFormData({...formData, pdf_url: e.target.value})}
                         className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">URL da Imagem da Capa</label>
                    <div className="relative">
                       <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <input 
                         type="text"
                         placeholder="URL da imagem ou /images/capa.jpg"
                         value={formData.image_url}
                         onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                         className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
                    <textarea 
                      rows={4}
                      placeholder="Resumo do livro..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all resize-none"
                    ></textarea>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="w-1/3 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                    >
                       Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="w-2/3 bg-navy text-white p-4 rounded-xl font-bold hover:bg-wine transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                       <Save size={18} />
                       {editingBook ? 'Guardar Alterações' : 'Adicionar Livro'}
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
