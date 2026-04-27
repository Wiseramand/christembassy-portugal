"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, MessageCircle } from 'lucide-react';

const testimonials = [
  { id: 1, name: 'Ana Silva', role: 'Business Owner', text: 'Being a part of this family has changed my life. The teachings of Pastor Chris have given me a new perspective on success and faith. My business has grown exponentially since I started applying the principles I learned here.', image: 'https://i.pravatar.cc/150?u=ana' },
  { id: 2, name: 'João Santos', role: 'Student', text: 'I found my purpose here. The youth community is so vibrant and the Word is so practical for my daily life. I used to be confused about my future, but now I walk with clear direction and divine wisdom.', image: 'https://i.pravatar.cc/150?u=joao' },
  { id: 3, name: 'Maria Ferreira', role: 'Teacher', text: 'The healing ministry transformed my health. I am a testimony of God’s grace and power working through our man of God. I was diagnosed with a chronic condition, but today I am completely free and whole!', image: 'https://i.pravatar.cc/150?u=maria' },
  { id: 4, name: 'Pedro Costa', role: 'Engineer', text: 'I used to struggle with my identity, but now I know who I am in Christ. This church is truly a place of belonging. My family life and career have seen a remarkable turnaround since I joined this ministry.', image: 'https://i.pravatar.cc/150?u=pedro' },
  { id: 5, name: 'Sofia Mendes', role: 'Social Worker', text: 'The love in this ministry is real. I’ve seen lives changed and hope restored in so many people around me. It’s an honor to be part of a community that is making such a significant impact in the world.', image: 'https://i.pravatar.cc/150?u=sofia' },
  { id: 6, name: 'Ricardo Pereira', role: 'Artist', text: 'My creativity has been sanctified and amplified. God is using my talent to reach many souls through the wisdom I receive here. The excellence I see in this ministry has pushed me to be the best version of myself.', image: 'https://i.pravatar.cc/150?u=ricardo' },
  { id: 7, name: 'Catarina Lopes', role: 'Nurse', text: 'The prayers and support I received during my difficult times were overwhelming. I never felt alone. Christ Embassy Angola is indeed a home away from home, filled with the warmth of God’s love.', image: 'https://i.pravatar.cc/150?u=catarina' },
  { id: 8, name: 'Tiago Oliveira', role: 'Entrepreneur', text: 'I learned the secrets of kingdom finance here. From being in debt to being a financier of the gospel, my story is one of divine promotion and supernatural abundance. All glory to God!', image: 'https://i.pravatar.cc/150?u=tiago' },
  { id: 9, name: 'Isabel Martins', role: 'Designer', text: 'The Word of God taught here is so deep yet so simple. It has empowered me to overcome every obstacle in my path. I am more than a conqueror through Christ who loves me!', image: 'https://i.pravatar.cc/150?u=isabel' },
];

export default function TestimonialsPage() {
  return (
    <div className="pt-24 min-h-screen bg-off-white pb-24">
      {/* Header */}
      <section className="bg-navy py-20 relative overflow-hidden text-center mb-16">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl relative group shadow-sm border border-gray-100 flex flex-col h-full"
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
                  src={t.image} 
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold/30 p-0.5"
                />
                <div>
                  <h4 className="font-poppins font-bold text-navy">
                    {t.name}
                  </h4>
                  <p className="text-xs text-wine font-bold uppercase tracking-widest">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimony Submission CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-wine rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
          
          <h3 className="text-3xl font-poppins font-bold mb-4 relative z-10">Tem um Testemunho?</h3>
          <p className="text-white/70 max-w-xl mx-auto mb-8 relative z-10">
            Partilhe a sua história e inspire outros com o que Deus tem feito na sua vida. 
            O seu testemunho pode ser a chave para o avanço de outra pessoa!
          </p>
          <button className="bg-gold text-navy px-12 py-4 rounded-full font-bold hover:bg-white transition-all relative z-10">
            Enviar Testemunho
          </button>
        </motion.div>
      </div>
    </div>
  );
}
