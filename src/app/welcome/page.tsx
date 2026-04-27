"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Church, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="pt-24 min-h-screen bg-off-white pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-navy">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy z-10" />
          <img 
            src="/images/pastor/charles-okorodudu.png" 
            alt="Pastor Charles Okorodudu"
            className="w-full h-full object-cover opacity-60 object-top"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-poppins font-bold text-white mb-6">
              Bem-vindo à Família
            </h1>
            <p className="text-xl text-gold font-medium tracking-widest uppercase">
              Pastor Charles Okorodudu
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-24 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 bg-white p-8 md:p-16 rounded-3xl shadow-2xl border border-gray-100"
          >
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <h2 className="text-3xl font-poppins font-bold text-navy mb-8">Uma Mensagem do nosso Pastor de Grupo</h2>
              
              <p className="mb-6 text-xl font-medium text-navy/80">
                "É com imensa alegria e o amor de Cristo que vos dou as boas-vindas à Christ Embassy Portugal. 
                Estamos aqui para dar um sentido à sua vida e ajudá-lo a descobrir o propósito glorioso que Deus tem para si."
              </p>

              <p className="mb-6">
                Na Christ Embassy, acreditamos que a Palavra de Deus é a resposta para todos os desafios da vida. 
                O nosso ministério é dedicado a levar a presença divina de Deus às nações do mundo e a demonstrar o caráter do Espírito Santo.
              </p>

              <div className="my-12 p-8 bg-gold/5 rounded-2xl border-l-4 border-gold italic text-navy/70">
                "O Evangelho de Jesus Cristo é o poder de Deus para a salvação. Através da nossa comunhão, 
                você experimentará uma transformação real que elevará a sua vida de glória em glória."
              </div>

              <p className="mb-6">
                Quer seja novo em Portugal ou esteja à procura de um lar espiritual, convidamo-lo a juntar-se a nós em qualquer um dos nossos centros. 
                Temos uma família à sua espera, pronta para caminhar consigo nesta jornada de fé.
              </p>

              <p className="font-bold text-navy mt-12">
                Com amor,<br />
                <span className="text-wine text-2xl">Pastor Charles Okorodudu</span><br />
                <span className="text-gray-400 font-medium">Pastor de Grupo, Christ Embassy Portugal</span>
              </p>
            </div>
          </motion.div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-navy p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-xl font-poppins font-bold mb-6 flex items-center gap-2">
                <Star className="text-gold" fill="currentColor" />
                A Nossa Visão
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Levar a presença divina de Deus a todas as pessoas em Portugal, manifestando a vida de Cristo através da Palavra.
              </p>
              <Link href="/about" className="text-gold font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Saber mais sobre nós <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg"
            >
              <h3 className="text-xl font-poppins font-bold text-navy mb-6 flex items-center gap-2">
                <Heart className="text-wine" />
                Junte-se a Nós
              </h3>
              <p className="text-gray-500 mb-6">
                Descubra a igreja mais próxima de si e venha adorar connosco no próximo domingo.
              </p>
              <Link href="/contact" className="btn-gold w-full flex justify-center">
                Encontrar uma Igreja
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
