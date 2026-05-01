"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, MessageSquare, CheckCircle2, Church, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const OTHER_CHURCHES = [
  { name: 'Christ Embassy Odivelas', address: 'RUA HEROIS DE CHAIMITE, N 21, LT D. CP: 2675-376 ODIVELAS', phone: '+351 916 419 087' },
  { name: 'Christ Embassy Setúbal', address: 'Rua General Daniel de Sousa 116, 2900-344 Setúbal', phone: '+351 916 419 087' },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    church: 'Christ Embassy Odivelas',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([formData]);

      if (error) throw error;

      toast.success("Mensagem enviada com sucesso!", {
        description: "Entraremos em contacto brevemente."
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', church: 'Christ Embassy Odivelas', message: '' });
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error("Falha ao enviar mensagem", {
        description: err.message || "Por favor, tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };

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
            <MessageSquare size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-poppins font-bold mb-6"
          >
            Entre em Contacto
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Tem uma pergunta, um testemunho ou apenas quer dizer olá? 
            Gostaríamos muito de ouvi-lo.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-poppins font-bold text-navy mb-6">Informações de Contacto</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Contacte-nos através de qualquer um destes canais ou visite-nos durante os nossos horários de culto. 
                A nossa equipa está sempre pronta para o ajudar.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: 'Localização', detail: 'Odivelas & Setúbal', sub: 'Igrejas Locais' },
                  { icon: Clock, title: 'Horários dos Cultos', detail: 'Domingos às 10h', sub: 'Qua: 19h | Sex (Intercessão): 19h' },
                  { icon: Phone, title: 'Ligue-nos', detail: '+351 916 419 087', sub: 'Seg-Sex, 9h - 17h' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy text-sm uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-xl font-poppins font-bold text-navy mb-1">{item.detail}</p>
                      <p className="text-sm text-gray-400">{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 relative"
          >
            {submitted ? (
              <div className="py-20 text-center space-y-6">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                 </div>
                 <h3 className="text-3xl font-poppins font-bold text-navy">Obrigado!</h3>
                 <p className="text-gray-500">A sua mensagem foi entregue com sucesso. Responderemos em breve via email.</p>
                 <button 
                   onClick={() => setSubmitted(false)}
                   className="btn-primary mt-8"
                 >
                   Enviar outra Mensagem
                 </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-poppins font-bold text-navy mb-8">Envie-nos uma Mensagem</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="João Silva"
                        className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 transition-all border-2 border-transparent focus:border-wine"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Endereço de Email</label>
                      <input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="joao@exemplo.com"
                        className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 transition-all border-2 border-transparent focus:border-wine"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telemóvel (Opcional)</label>
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+351 916 419 087"
                        className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 transition-all border-2 border-transparent focus:border-wine"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Igreja Destinatária</label>
                      <select 
                        value={formData.church}
                        onChange={(e) => setFormData({...formData, church: e.target.value})}
                        className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 transition-all border-2 border-transparent focus:border-wine appearance-none cursor-pointer"
                      >
                        {OTHER_CHURCHES.map((church) => (
                          <option key={church.name} value={church.name}>{church.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Como podemos ajudar?</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Escreva a sua mensagem aqui..."
                      className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 transition-all border-2 border-transparent focus:border-wine resize-none"
                    ></textarea>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-navy text-white p-5 rounded-2xl font-bold text-lg hover:bg-wine transition-all flex items-center justify-center gap-3 shadow-lg group disabled:opacity-50"
                  >
                    {loading ? (
                       <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Enviar Mensagem
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>

        {/* Other Churches Directory */}
        <section className="mt-16">
          <div className="text-center mb-16">
            <h2 className="text-gold font-bold uppercase tracking-widest mb-4">A Nossa Presença</h2>
            <h3 className="text-4xl font-poppins font-bold text-navy">Outras Igrejas do Grupo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {OTHER_CHURCHES.map((church, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-navy/5 rounded-2xl flex items-center justify-center text-navy mb-6 group-hover:bg-wine group-hover:text-white transition-colors">
                  <Church size={24} />
                </div>
                <h4 className="text-xl font-poppins font-bold text-navy mb-4">{church.name}</h4>
                <div className="space-y-3 text-gray-500">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="shrink-0 text-gold" />
                    <span className="text-sm">{church.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="shrink-0 text-gold" />
                    <span className="text-sm">{church.phone}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setFormData({ ...formData, church: church.name });
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="mt-8 text-wine font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all"
                >
                  Enviar Mensagem <Send size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
