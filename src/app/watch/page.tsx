"use client";

import React, { useEffect, useState } from 'react';
import HLSPlayer from '@/components/video/HLSPlayer';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Share2, LogIn, Globe, MapPin, Phone, User, Play } from 'lucide-react';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import { toast } from 'sonner';

interface StreamSettings {
  is_live: boolean;
  m3u8_url: string;
}

const countryCodes = [
  { code: '+351', country: 'Portugal' },
  { code: '+244', country: 'Angola' },
  { code: '+55', country: 'Brasil' },
  { code: '+238', country: 'Cabo Verde' },
  { code: '+258', country: 'Moçambique' },
  { code: '+239', country: 'São Tomé e Príncipe' },
  { code: '+245', country: 'Guiné-Bissau' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+34', country: 'Espanha' },
  { code: '+33', country: 'França' },
  { code: '+49', country: 'Alemanha' },
  { code: '+41', country: 'Suíça' },
  { code: '+352', country: 'Luxemburgo' },
  // ... can add more or use a more complete list
];

export default function WatchPage() {
  const [settings, setSettings] = useState<StreamSettings>({
    is_live: false,
    m3u8_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone_code: '+351',
    phone_number: '',
    country: 'Portugal',
    city: ''
  });

  useEffect(() => {
    // Check if already entered in this session
    const entered = localStorage.getItem('ce_visitor_entered');
    if (entered) setHasEntered(true);

    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('stream_settings')
          .select('is_live, m3u8_url')
          .single();
        
        if (data && !error) {
          setSettings(data);
        }
      } catch (err) {
        console.error("Error fetching stream settings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();

    const channel = supabase
      .channel('stream_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stream_settings' }, (payload) => {
        setSettings(payload.new as StreamSettings);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleEnter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullPhone = `${formData.phone_code} ${formData.phone_number}`;
      const { error } = await supabase
        .from('visitors')
        .insert([{
          name: formData.name,
          phone: fullPhone,
          country: formData.country,
          city: formData.city
        }]);

      if (error) throw error;

      localStorage.setItem('ce_visitor_entered', 'true');
      setHasEntered(true);
      toast.success("Bem-vindo ao nosso Culto Online!");
    } catch (err: any) {
      toast.error("Erro ao entrar: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-off-white">
      <div className="container mx-auto px-6 mb-12">
        {!hasEntered ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-navy p-10 text-center text-white relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-wine/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="w-16 h-16 bg-wine rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                  <Play size={28} fill="white" className="ml-1" />
               </div>
               <h1 className="text-3xl font-poppins font-bold mb-3">Assistir em Direto</h1>
               <p className="text-gray-400 text-sm">Por favor, identifique-se para entrar na transmissão e receber a bênção de hoje.</p>
            </div>

            <form onSubmit={handleEnter} className="p-10 space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                     <input 
                       required
                       type="text"
                       placeholder="Ex: João Silva"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telemóvel</label>
                     <div className="flex gap-2">
                        <select 
                          className="bg-off-white p-4 rounded-xl outline-none text-sm font-bold w-24"
                          value={formData.phone_code}
                          onChange={(e) => setFormData({...formData, phone_code: e.target.value})}
                        >
                           {countryCodes.map(c => (
                             <option key={c.code} value={c.code}>{c.code}</option>
                           ))}
                        </select>
                        <div className="relative flex-grow">
                           <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                           <input 
                             required
                             type="tel"
                             placeholder="912 345 678"
                             value={formData.phone_number}
                             onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                             className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all"
                           />
                        </div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">País</label>
                     <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                          required
                          type="text"
                          placeholder="Ex: Portugal"
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                          className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all"
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Cidade</label>
                  <div className="relative">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                     <input 
                       required
                       type="text"
                       placeholder="Ex: Lisboa"
                       value={formData.city}
                       onChange={(e) => setFormData({...formData, city: e.target.value})}
                       className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all"
                     />
                  </div>
               </div>

               <button 
                 type="submit"
                 disabled={isSubmitting}
                 className="w-full bg-wine text-white p-5 rounded-xl font-bold hover:bg-navy transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
               >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Entrar na Transmissão
                      <LogIn size={20} />
                    </>
                  )}
               </button>
            </form>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content: Player */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {loading ? (
                  <div className="aspect-video bg-navy/5 rounded-2xl animate-pulse flex items-center justify-center">
                    <p className="text-navy/40 font-medium tracking-widest uppercase text-xs">A carregar o Motor de Transmissão...</p>
                  </div>
                ) : (
                  <HLSPlayer 
                    url={settings.m3u8_url} 
                    isLive={settings.is_live} 
                  />
                )}
              </motion.div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div>
                  <h1 className="text-3xl font-poppins font-bold text-navy mb-2">
                    Culto em Direto
                  </h1>
                  <p className="text-gray-500 font-medium">Christ Embassy Portugal Online</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-xl font-bold text-navy hover:bg-navy hover:text-white transition-all group">
                    <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                    Partilhar
                  </button>
                  <div className="h-10 w-px bg-gray-100 hidden md:block" />
                  <div className="flex items-center gap-2 text-wine font-bold">
                    <Users size={20} />
                    <span>A assistir agora</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                 <h3 className="text-navy font-poppins font-bold mb-6">Horário dos Cultos</h3>
                 <div className="space-y-4">
                    {[
                      { day: 'Domingos', time: '10:00', title: 'Culto de Celebração' },
                      { day: 'Quartas-feiras', time: '18:30', title: 'Culto de Meio de Semana' },
                      { day: 'Sextas-feiras', time: '22:00', title: 'Vigília de Oração' }
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                         <div>
                            <p className="font-bold text-navy text-sm">{s.title}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{s.day}</p>
                         </div>
                         <p className="text-wine font-bold text-sm bg-wine/5 px-3 py-1 rounded-full">{s.time}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <UpcomingEvents />
    </div>
  );
}
