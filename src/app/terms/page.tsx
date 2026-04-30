"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, Info, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="pt-24 min-h-screen bg-off-white pb-24">
      {/* Header */}
      <section className="bg-navy py-24 relative overflow-hidden text-center text-white mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-wine/5 via-transparent to-transparent z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center text-gold mx-auto mb-6"
          >
            <Gavel size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-poppins font-bold mb-6"
          >
            Termos de Serviço
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Ao utilizar o nosso website, concorda com os seguintes termos e condições.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 space-y-10"
        >
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-navy mb-4">
               <Info className="text-gold" size={24} />
               <h2 className="text-2xl font-poppins font-bold">1. Aceitação dos Termos</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Ao aceder a este website, o utilizador concorda em cumprir estes Termos de Serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-navy mb-4">
               <CheckCircle className="text-wine" size={24} />
               <h2 className="text-2xl font-poppins font-bold">2. Licença de Uso</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              É concedida permissão para descarregar temporariamente uma cópia dos materiais (informações ou software) no website da Christ Embassy Portugal, apenas para visualização transitória pessoal e não comercial.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-navy mb-4">
               <AlertCircle className="text-gold" size={24} />
               <h2 className="text-2xl font-poppins font-bold">3. Isenção de Responsabilidade</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Os materiais no website da Christ Embassy Portugal são fornecidos 'como estão'. A Christ Embassy Portugal não oferece garantias, expressas ou implícitas, e por este meio isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-poppins font-bold text-navy">4. Limitações</h2>
            <p className="text-gray-600 leading-relaxed">
              Em nenhum caso a Christ Embassy Portugal ou os seus fornecedores serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais no nosso website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-poppins font-bold text-navy">5. Alterações</h2>
            <p className="text-gray-600 leading-relaxed">
              A Christ Embassy Portugal pode rever estes termos de serviço para o seu website a qualquer momento, sem aviso prévio. Ao utilizar este website, concorda em ficar vinculado à versão atual desses termos de serviço.
            </p>
          </section>

          <div className="pt-10 border-t border-gray-100 text-center">
             <p className="text-gray-400 text-sm italic">Última atualização: Abril de 2026</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
