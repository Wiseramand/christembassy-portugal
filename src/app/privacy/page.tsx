"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="pt-24 min-h-screen bg-off-white pb-24">
      {/* Header */}
      <section className="bg-navy py-24 relative overflow-hidden text-center text-white mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-wine/5 via-transparent to-transparent z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-wine/20 rounded-full flex items-center justify-center text-wine mx-auto mb-6"
          >
            <Shield size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-poppins font-bold mb-6"
          >
            Política de Privacidade
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A sua privacidade é importante para nós. Saiba como protegemos e utilizamos os seus dados.
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
               <Eye className="text-gold" size={24} />
               <h2 className="text-2xl font-poppins font-bold">1. Introdução</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Na Christ Embassy Portugal, respeitamos a sua privacidade e estamos empenhados em proteger os dados pessoais que partilha connosco. Esta Política de Privacidade explica como recolhemos, utilizamos e protegemos as suas informações ao utilizar o nosso website.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-navy mb-4">
               <FileText className="text-wine" size={24} />
               <h2 className="text-2xl font-poppins font-bold">2. Informações que Recolhemos</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Recolhemos informações quando se regista no nosso site, subscreve a nossa newsletter, preenche um formulário ou faz uma doação. As informações podem incluir o seu nome, endereço de email, número de telefone e detalhes de pagamento.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-navy mb-4">
               <Lock className="text-gold" size={24} />
               <h2 className="text-2xl font-poppins font-bold">3. Como Utilizamos os seus Dados</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Para personalizar a sua experiência e responder às suas necessidades individuais.</li>
              <li>Para melhorar o nosso website e os serviços que oferecemos.</li>
              <li>Para processar transações e doações de forma segura.</li>
              <li>Para enviar emails periódicos sobre eventos, notícias e atualizações da igreja.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-navy mb-4">
               <Shield className="text-wine" size={24} />
               <h2 className="text-2xl font-poppins font-bold">4. Proteção de Informações</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Implementamos uma variedade de medidas de segurança para manter a segurança das suas informações pessoais. Utilizamos criptografia avançada para proteger dados sensíveis transmitidos online.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-poppins font-bold text-navy">5. Contacto</h2>
            <p className="text-gray-600 leading-relaxed">
              Se tiver alguma dúvida sobre esta Política de Privacidade, pode contactar-nos através do email: <span className="text-wine font-bold">contacto@christembassyportugal.pt</span>
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
