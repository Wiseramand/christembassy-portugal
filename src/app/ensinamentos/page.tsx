"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Heart, PlayCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const fallbackVideos = [
  { id: '1', title: 'Os 3 Caracteres de Deus', duration: 'Ao Vivo', thumbnail_url: 'https://img.youtube.com/vi/DRkSU-BjHq4/maxresdefault.jpg', url: 'https://www.youtube.com/embed/DRkSU-BjHq4?start=24' },
  { id: '2', title: 'Conversa de Pai e Filho', duration: 'Ao Vivo', thumbnail_url: 'https://img.youtube.com/vi/hr5nBhl4gGo/maxresdefault.jpg', url: 'https://www.youtube.com/embed/hr5nBhl4gGo?start=5034' },
  { id: '3', title: 'Os fundamentos do Evangelho Parte1', duration: 'Ao Vivo', thumbnail_url: 'https://img.youtube.com/vi/y4UybMa3EE0/maxresdefault.jpg', url: 'https://www.youtube.com/embed/y4UybMa3EE0?start=1030' },
  { id: '4', title: 'Os fundamentos do Evangelho parte2', duration: 'Ao Vivo', thumbnail_url: 'https://img.youtube.com/vi/M_GQuGjyJuA/maxresdefault.jpg', url: 'https://www.youtube.com/embed/M_GQuGjyJuA?start=1649' },
];

export default function EnsinamentosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar vídeos:', error.message);
        setVideos(fallbackVideos);
        return;
      }

      if (data && data.length > 0) {
        setVideos(data);
      } else {
        setVideos(fallbackVideos);
      }
    }
    fetchVideos();
  }, []);

  return (
    <main className="min-h-screen bg-off-white pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-gold text-sm font-bold uppercase tracking-widest mb-3">Biblioteca</h1>
          <h2 className="text-4xl md:text-6xl font-poppins font-bold text-navy mb-6">Todos os Ensinamentos</h2>
          <p className="text-gray-600 leading-relaxed italic">
            Explore a nossa coleção completa de ensinamentos para edificar a sua fé e fortalecer a sua caminhada com Deus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedVideo(video.url)}
            >
              <div className="relative aspect-video shrink-0">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-navy/20 group-hover:bg-navy/40 transition-colors">
                  <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-navy shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                  {video.duration}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-wine" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{video.category || 'Ensinamento'}</span>
                </div>
                <h4 className="text-xl font-poppins font-bold text-navy group-hover:text-gold transition-colors mb-6 line-clamp-2 leading-tight flex-1">
                  {video.title}
                </h4>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest shrink-0">
                  <div className="flex items-center gap-2">
                    <PlayCircle size={16} className="text-wine" />
                    <span>Assistir Agora</span>
                  </div>
                  <Heart size={16} className="text-gray-200" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 p-4 backdrop-blur-md"
          >
            <button
              className="absolute top-8 right-8 text-white hover:text-gold transition-colors z-50 p-2"
              onClick={() => setSelectedVideo(null)}
            >
              <X size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <iframe
                src={(function(url) {
                  if (!url) return '';
                  let embedUrl = url;
                  
                  if (url.includes('drive.google.com')) {
                    embedUrl = url.replace(/\/view.*$/, '/preview');
                  } else if (url.includes('youtube.com/embed/')) {
                    embedUrl = url;
                  } else {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = url.match(regExp);
                    if (match && match[2].length === 11) {
                      embedUrl = `https://www.youtube.com/embed/${match[2]}`;
                      
                      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
                      const start = urlObj.searchParams.get('t') || urlObj.searchParams.get('start');
                      if (start) {
                        embedUrl += `?start=${parseInt(start)}`;
                      }
                    } else if (!url.includes('http')) {
                      embedUrl = `https://www.youtube.com/embed/${url}`;
                    }
                  }
                  
                  if (!url.includes('drive.google.com')) {
                    if (embedUrl.includes('?')) {
                      if (!embedUrl.includes('autoplay=1')) embedUrl += '&autoplay=1';
                    } else {
                      embedUrl += '?autoplay=1';
                    }
                  }
                  return embedUrl;
                })(selectedVideo)}
                className="w-full h-full border-0 bg-black"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
