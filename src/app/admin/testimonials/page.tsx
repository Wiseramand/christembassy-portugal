"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  PlusCircle, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Star,
  Quote
} from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  image_url: string;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    image_url: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) toast.error("Falha ao carregar testemunhos");
    else setTestimonials(data || []);
    setLoading(false);
  }

  const handleOpenModal = (t?: Testimonial) => {
    if (t) {
      setEditing(t);
      setFormData({ name: t.name, text: t.text, image_url: t.image_url });
    } else {
      setEditing(null);
      setFormData({ name: '', text: '', image_url: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, image_url: formData.image_url || 'https://i.pravatar.cc/150' };

    try {
      if (editing) {
        const { error } = await supabase.from('testimonials').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success("Testemunho atualizado");
      } else {
        const { error } = await supabase.from('testimonials').insert([payload]);
        if (error) throw error;
        toast.success("Testemunho criado");
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  async function handleDelete(id: string) {
    if (!confirm("Tem a certeza?")) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) toast.error("Falha ao eliminar");
    else { toast.success("Eliminado"); setTestimonials(testimonials.filter(t => t.id !== id)); }
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Gestão de Testemunhos</h1>
           <p className="text-gray-500">Gira as histórias de transformação da nossa família da igreja.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <PlusCircle size={20} />
          Adicionar Testemunho
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {testimonials.map((t) => (
           <motion.div key={t.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col group relative">
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleOpenModal(t)} className="p-2 bg-off-white text-navy rounded-xl hover:bg-gold"><Edit size={16} /></button>
                 <button onClick={() => handleDelete(t.id)} className="p-2 bg-off-white text-wine rounded-xl hover:bg-wine hover:text-white"><Trash2 size={16} /></button>
              </div>
              <div className="text-gold mb-4"><Quote size={32} /></div>
              <p className="text-sm text-gray-500 italic mb-6 line-clamp-4 flex-grow">"{t.text}"</p>
              <div className="flex items-center gap-4">
                 <img src={t.image_url} className="w-10 h-10 rounded-full object-cover" alt={t.name} />
                 <h4 className="font-bold text-navy">{t.name}</h4>
              </div>
           </motion.div>
         ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 space-y-6">
               <h2 className="text-2xl font-poppins font-bold text-navy">{editing ? 'Editar' : 'Adicionar'} Testemunho</h2>
               <form onSubmit={handleSave} className="space-y-4">
                  <input required placeholder="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-off-white p-4 rounded-xl outline-none" />
                  <textarea required rows={4} placeholder="Texto do testemunho..." value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full bg-off-white p-4 rounded-xl outline-none resize-none" />
                  <input placeholder="URL da Imagem" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-off-white p-4 rounded-xl outline-none" />
                  <button type="submit" className="w-full btn-primary">Guardar</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
