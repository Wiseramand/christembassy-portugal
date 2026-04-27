"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Heart, 
  Video, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalMessages: 0,
    activeStream: false,
    totalDonations: 4250.00, // Mock
    totalViews: 12405, // Mock
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stream status
        const { data: streamData } = await supabase
          .from('stream_settings')
          .select('is_live')
          .single();

        // Fetch message count and recent messages
        const { count: messageCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true });

        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats(prev => ({
          ...prev,
          activeStream: streamData?.is_live || false,
          totalMessages: messageCount || 0
        }));
        setRecentMessages(messages || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const cards = [
    { title: 'Total de Visualizações', value: stats.totalViews.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12% em relação à semana passada', href: '/admin/testimonials' },
    { title: 'Doações', value: `€${stats.totalDonations.toLocaleString()}`, icon: Heart, color: 'text-wine', bg: 'bg-wine/5', trend: '+5.4% em relação à semana passada', href: '/admin/donations' },
    { title: 'Estado do Stream', value: stats.activeStream ? 'EM DIRETO' : 'OFFLINE', icon: Video, color: stats.activeStream ? 'text-green-600' : 'text-gray-400', bg: stats.activeStream ? 'bg-green-50' : 'bg-gray-100', trend: stats.activeStream ? 'Bitrate estável' : 'Próximo: Dom 10:00', href: '/admin/stream' },
    { title: 'Novas Mensagens', value: stats.totalMessages.toString(), icon: MessageSquare, color: 'text-gold', bg: 'bg-gold/5', trend: `${stats.totalMessages} total recebido`, href: '/admin/messages' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Visão Geral do Painel</h1>
        <p className="text-gray-500">Bem-vindo de volta. Veja o que está a acontecer hoje na Christ Embassy Angola.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => router.push(card.href)}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
               <card.icon size={28} />
            </div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">{card.title}</p>
            <h3 className="text-3xl font-poppins font-bold text-navy mb-4">{card.value}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
               <TrendingUp size={14} className={card.color} />
               {card.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Messages */}
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-poppins font-bold text-navy">Mensagens Recentes</h3>
              <button className="text-xs font-bold text-wine uppercase tracking-widest hover:underline">Ver Tudo</button>
           </div>
           
           <div className="space-y-6">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full" />
                    <div className="space-y-2 flex-grow">
                      <div className="h-4 bg-gray-100 rounded w-1/4" />
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                ))
              ) : recentMessages.length > 0 ? (
                recentMessages.map((msg, i) => (
                  <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                     <div className="w-12 h-12 bg-gray-50 text-navy rounded-full flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                        {msg.name.substring(0, 2)}
                     </div>
                     <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                           <h4 className="font-bold text-navy">{msg.name}</h4>
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                             {new Date(msg.created_at).toLocaleDateString()}
                           </span>
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-1">{msg.message}</p>
                     </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                   <MessageSquare className="mx-auto mb-4 opacity-10" size={48} />
                   <p>Ainda não foram recebidas mensagens.</p>
                </div>
              )}
           </div>
        </div>

        {/* Quick Actions / Status */}
        <div className="space-y-8">
           <div className="bg-navy p-10 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
              <h3 className="text-xl font-poppins font-bold mb-6 relative z-10">Controlo Rápido de Stream</h3>
              <div className="space-y-6 relative z-10">
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                       {stats.activeStream ? <CheckCircle2 className="text-green-400" /> : <AlertCircle className="text-gray-500" />}
                       <div>
                          <p className="font-bold text-sm">Estado do Serviço</p>
                          <p className="text-xs text-white/50">{stats.activeStream ? 'Sistema em Execução' : 'Desligado'}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => router.push('/admin/stream')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-all ${
                        stats.activeStream ? 'bg-wine text-white' : 'bg-gold text-navy'
                      }`}
                    >
                       GERIR
                    </button>
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-poppins font-bold text-navy mb-6">Próximas Tarefas Agendadas</h3>
              <div className="space-y-6">
                 {[
                   { task: 'Preparar Boletim de Domingo', time: 'Em 2 horas', icon: Clock },
                   { task: 'Rever Novos Testemunhos', time: 'Amanhã', icon: Clock },
                   { task: 'Exportar Relatório de Doações', time: 'Seg 09:00', icon: Clock },
                 ].map((task, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-off-white text-gray-400 rounded-full flex items-center justify-center">
                         <task.icon size={18} />
                      </div>
                      <div>
                         <p className="font-bold text-navy text-sm">{task.task}</p>
                         <p className="text-xs text-gray-400">{task.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
