"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, MessageCircle, X, Send, Heart, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  image_url: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Membro',
    text: '',
    image_url: ''
  });

  async function fetchTestimonials() {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("Error fetching testimonials:", error.message);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([{
          ...formData,
          image_url: formData.image_url || 'https://i.pravatar.cc/150'
        }]);

      if (error) throw error;

      toast.success("Testemunho enviado com sucesso! Obrigado por partilhar.");
      setIsModalOpen(false);
      setFormData({ name: '', role: 'Membro', text: '', image_url: '' });
      fetchTestimonials();
    } catch (err: any) {
      toast.error("Erro ao enviar: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-off-white pb-24">
      {/* Header */}
      <section className="bg-navy py-20 relative overflow-hidden text-center mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-wine/5 via-transparent to-transparent z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-6"
          >
            <MessageCircle size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-poppins font-bold text-white mb-6"
          >
            Testemunhos Gloriosos
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            &quot;E eles o venceram pelo sangue do Cordeiro e pela palavra do seu testemunho...&quot; - Apocalipse 12:11
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6">
        {loading ? (
           <div className="flex justify-center py-24">
              <div className="w-12 h-12 border-4 border-navy/10 border-t-wine rounded-full animate-spin" />
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl relative group shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-xl transition-all"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#D4AF37" className="text-gold" />
                  ))}
                </div>

                <div className="absolute top-10 right-10 text-gray-100 group-hover:text-gold/10 transition-colors">
                  <Quote size={50} />
                </div>

                <p className="text-gray-600 italic leading-relaxed mb-10 flex-grow">
                  &quot;{t.text}&quot;
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                  <img 
                    src={t.image_url || 'https://i.pravatar.cc/150'} 
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold/30 p-0.5"
                  />
                  <div>
                    <h4 className="font-poppins font-bold text-navy">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-wine font-bold uppercase tracking-widest">
                      {t.role || 'Membro'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Testimony Submission CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-wine rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
          
          <h3 className="text-3xl md:text-5xl font-poppins font-bold mb-6 relative z-10">Tem um Testemunho?</h3>
          <p className="text-white/70 max-w-2xl mx-auto mb-10 text-lg relative z-10">
            Partilhe a sua história e inspire outros com o que Deus tem feito na sua vida. 
            O seu testemunho pode ser a chave para o avanço de outra pessoa!
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gold text-navy px-12 py-5 rounded-full font-bold hover:bg-white hover:scale-105 transition-all relative z-10 shadow-lg"
          >
            Enviar Meu Testemunho
          </button>
        </motion.div>
      </div>

      {/* Submission Modal */}
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
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-wine/10 rounded-full flex items-center justify-center text-wine">
                       <Heart size={20} />
                    </div>
                    <h2 className="text-2xl font-poppins font-bold text-navy">Partilhar Testemunho</h2>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-navy transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Seu Nome</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            required
                            type="text"
                            placeholder="João Silva"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">O seu papel / Profissão</label>
                       <input 
                         type="text"
                         placeholder="Ex: Empresário / Estudante / Membro"
                         value={formData.role}
                         onChange={(e) => setFormData({...formData, role: e.target.value})}
                         className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Seu Testemunho</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Conte-nos o que Deus fez na sua vida..."
                      value={formData.text}
                      onChange={(e) => setFormData({...formData, text: e.target.value})}
                      className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all resize-none"
                    ></textarea>
                 </div>

                 <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-navy text-white p-5 rounded-xl font-bold hover:bg-wine transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 group"
                    >
                       {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                       ) : (
                          <>
                             <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                             Enviar Testemunho
                          </>
                       )}
                    </button>
                    <p className="text-center text-gray-400 text-xs mt-6">
                       Ao enviar, o seu testemunho será analisado pela nossa equipa antes de ser publicado.
                    </p>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
