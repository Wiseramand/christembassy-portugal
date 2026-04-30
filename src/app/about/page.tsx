"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Target, Users, BookOpen, Heart, Globe } from 'lucide-react';

const values = [
  { icon: Globe, title: 'A Nossa Visão', text: 'Levar a presença divina de Deus aos povos e às nações do mundo e demonstrar o carácter do Espírito Santo.' },
  { icon: Target, title: 'A Nossa Missão', text: 'Formar gerações de homens e mulheres que entrarão na sua herança, à medida que ensinamos a Palavra de Deus, para que cumpram o sonho de Deus.' },
  { icon: Heart, title: 'O Nosso Propósito', text: 'Dar a conhecer Cristo e conduzir as pessoas à sua herança n’Ele. A Palavra de Deus ganhará vida no seu espírito enquanto adora connosco. A graça e a paz ser-vos-ão multiplicadas pelo conhecimento do nosso Senhor e Salvador Jesus Cristo.' },
];

export default function AboutPage() {
  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-navy py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-poppins font-bold text-white mb-6"
          >
            Sobre Nós
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gold font-medium max-w-2xl mx-auto italic"
          >
            "Levando a presença divina de Deus às nações e aos povos do mundo."
          </motion.p>
        </div>
      </section>

      {/* History / Intro */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
               <img 
                 src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" 
                 alt="Edifício da Igreja"
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-wine/10 rounded-full blur-3xl" />
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-poppins font-bold text-navy leading-tight">
              Nossa Doutrina
            </h2>
            <div className="w-20 h-1 bg-wine" />
            <p className="text-gray-600 text-lg leading-relaxed">
              Deus levantou-nos através da Sua Palavra e do Seu Espírito para crermos na vida divina que Cristo nos trouxe (Tito 1:2-3; 2 Pedro 1:3-4).
            </p>
            <p className="text-gray-600 leading-relaxed">
              Pela nossa fé na Sua Palavra, passámos a experimentar a realidade da vida divina. Essa vida, nos seus atributos, inclui: justiça, prosperidade, sucesso, abundância, vitória, saúde divina e a comunicação da própria vida e presença de Jesus Cristo aos povos do mundo.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Fazemo-lo trazendo o maior número possível de homens e mulheres para fora das trevas, da servidão e da escravidão da ignorância, para que também eles possam desfrutar da gloriosa liberdade dos filhos de Deus.
            </p>
            
            <div className="pt-4">
              <h3 className="font-bold text-navy mb-4">Alcançamos estes objectivos através de:</h3>
              <ul className="space-y-4">
                 <li className="flex gap-4 items-start">
                    <div className="min-w-10 w-10 h-10 bg-wine/10 rounded-full flex items-center justify-center text-wine shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <p className="text-gray-600">Ajudar as pessoas a desenvolver o seu espírito humano por meio da Palavra de Deus.</p>
                 </li>
                 <li className="flex gap-4 items-start">
                    <div className="min-w-10 w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0">
                      <Target size={20} />
                    </div>
                    <p className="text-gray-600">Ensinar-lhes os princípios e ensinamentos da nova aliança no sangue de Jesus Cristo.</p>
                 </li>
                 <li className="flex gap-4 items-start">
                    <div className="min-w-10 w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center text-navy shrink-0">
                      <Users size={20} />
                    </div>
                    <p className="text-gray-600">Prepará-las e capacitá-las para espalhar a Palavra e tocar outros, assim como elas próprias foram tocadas pela Palavra de Deus.</p>
                 </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision Cards */}
      <section className="py-24 bg-off-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center group"
              >
                <div className="w-20 h-20 bg-wine/5 rounded-full flex items-center justify-center text-wine mx-auto mb-8 group-hover:bg-wine group-hover:text-white transition-all duration-300">
                  <v.icon size={36} />
                </div>
                <h4 className="text-2xl font-poppins font-bold text-navy mb-4">{v.title}</h4>
                <p className="text-gray-500 leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
           <h2 className="text-gold text-sm font-bold uppercase tracking-widest mb-3">Orientação Visionária</h2>
           <h3 className="text-4xl md:text-5xl font-poppins font-bold text-navy mb-6">Nossa Liderança</h3>
           <p className="text-gray-500 leading-relaxed">
             Guiados pelo Espírito Santo e pelos ensinamentos do nosso homem de Deus, o Pastor Chris Oyakhilome.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-navy rounded-3xl overflow-hidden shadow-2xl">
           <div className="h-full aspect-square lg:aspect-auto">
             <img 
               src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=800"
               alt="Pastor Chris"
               className="w-full h-full object-cover"
             />
           </div>
           <div className="p-12 text-white">
              <h4 className="text-wine text-sm font-bold uppercase tracking-widest mb-4">Presidente e Fundador</h4>
              <h5 className="text-4xl font-poppins font-bold mb-6 text-gold">Pastor Chris Oyakhilome</h5>
              <p className="text-gray-300 leading-relaxed mb-8 italic">
                “A Palavra de Deus é a verdadeira luz. Quando você caminha nessa luz, você caminha em glória. 
                Tudo em sua vida será belo.”
              </p>
              <p className="text-gray-400 leading-relaxed mb-10">
                O Pastor Chris Oyakhilome (D.Sc., D.D.), é o Presidente da LoveWorld Inc. 
                e da Christ Embassy. Sendo um Homem enviado de Deus e um ministro único do Evangelho de Jesus Cristo, 
                sua liderança cheia do Espírito e ungida continua a impulsionar um ministério dinâmico, multifacetado e global.
              </p>
              <button className="flex items-center gap-3 font-bold text-gold hover:text-white transition-colors">
                Saiba mais sobre o Pastor Chris
                <BookOpen size={20} />
              </button>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-wine">
        <div className="container mx-auto px-6 text-center text-white">
           <Heart size={64} className="mx-auto mb-8 text-gold animate-pulse" />
           <h3 className="text-4xl font-poppins font-bold mb-6">Faça parte da nossa Família</h3>
           <p className="text-white/70 max-w-xl mx-auto mb-10">
             Quer seja novo na zona ou esteja à procura de uma casa espiritual, 
             há um lugar para si aqui na Christ Embassy Angola.
           </p>
           <div className="flex flex-wrap justify-center gap-4">
              <Link href="/watch" className="bg-white text-wine px-10 py-4 rounded-full font-bold hover:bg-gold hover:text-navy transition-all">
                 Juntar-se a um Culto
              </Link>
              <Link href="/contact" className="border border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-navy transition-all">
                 Contacte-nos
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
