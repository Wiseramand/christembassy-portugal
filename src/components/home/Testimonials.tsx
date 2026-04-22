"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Star as StarIcon, Quote as QuoteIcon } from 'lucide-react';

const fallbackTestimonials = [
  { id: '1', name: 'Ana Silva', role: 'Empresária', text: 'Fazer parte desta família mudou a minha vida. Os ensinamentos do Pastor Chris deram-me uma nova perspetiva sobre o sucesso e a fé.', image_url: 'https://i.pravatar.cc/150?u=ana' },
  { id: '2', name: 'João Santos', role: 'Estudante', text: 'Encontrei o meu propósito aqui. A comunidade jovem é tão vibrante e a Palavra é tão prática para o meu dia a dia.', image_url: 'https://i.pravatar.cc/150?u=joao' },
  { id: '3', name: 'Maria Ferreira', role: 'Professora', text: 'O ministério de cura transformou a minha saúde. Sou um testemunho da graça e do poder de Deus atuando através do nosso homem de Deus.', image_url: 'https://i.pravatar.cc/150?u=maria' },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    async function fetchT() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (data && data.length > 0 && !error) {
        setTestimonials(data);
      } else {
        setTestimonials(fallbackTestimonials);
      }
    }
    fetchT();
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20">
          <div className="w-16 h-1 bg-wine mb-8" />
          <h2 className="text-4xl md:text-6xl font-poppins font-bold text-navy mb-6">Vidas Transformadas</h2>
          <p className="text-gray-500 leading-relaxed text-lg">
            Leia histórias reais dos nossos membros sobre como Deus está a agir na nossa comunidade e a mudar vidas através da Palavra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-off-white p-10 rounded-[2.5rem] relative group hover:bg-navy hover:text-white transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border border-gray-100/50"
            >
              <div className="absolute top-10 right-10 text-gold/10 group-hover:text-gold/20 transition-colors">
                <QuoteIcon size={80} />
              </div>
              
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={16} fill="#D4AF37" className="text-gold" />
                ))}
              </div>

              <p className="text-lg leading-relaxed mb-10 relative z-10 font-medium">
                "{t.text}"
              </p>

              <div className="flex items-center gap-5">
                <div className="relative">
                   <div className="absolute inset-0 bg-gold rounded-full blur group-hover:blur-md transition-all opacity-20" />
                   <img 
                    src={t.image_url} 
                    alt={t.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white relative z-10"
                   />
                </div>
                <div>
                  <h4 className="font-poppins font-bold text-xl text-navy group-hover:text-white transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-xs text-gold font-bold uppercase tracking-[0.2em] mt-1">
                    {t.role || 'Parceiro(a)'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
