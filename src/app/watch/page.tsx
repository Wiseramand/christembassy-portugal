"use client";

import React, { useEffect, useState } from 'react';
import HLSPlayer from '@/components/video/HLSPlayer';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Users, Share2 } from 'lucide-react';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import LiveChat from '@/components/chat/LiveChat';

interface StreamSettings {
  is_live: boolean;
  m3u8_url: string;
}

export default function WatchPage() {
  const [settings, setSettings] = useState<StreamSettings>({
    is_live: false,
    m3u8_url: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    // Subscribe to realtime changes
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

  return (
    <div className="pt-24 min-h-screen bg-off-white">
      <div className="container mx-auto px-6 mb-12">
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
                  Culto de Domingo de Manhã
                </h1>
                <p className="text-gray-500 font-medium">com o Pastor Chris Oyakhilome</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-xl font-bold text-navy hover:bg-navy hover:text-white transition-all group">
                  <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                  Partilhar
                </button>
                <div className="h-10 w-px bg-gray-100 hidden md:block" />
                <div className="flex items-center gap-2 text-wine font-bold">
                  <Users size={20} />
                  <span>1.2k a assistir</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <LiveChat />

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
      </div>

      <UpcomingEvents />
    </div>
  );
}
