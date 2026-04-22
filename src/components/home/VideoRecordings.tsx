"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Clock, Heart, PlayCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const fallbackVideos = [
  { id: '1', title: 'O Poder da Sua Mente', duration: '45:20', thumbnail_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '2', title: 'Viver no Espírito', duration: '52:15', thumbnail_url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=600', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '3', title: 'Fé que Funciona', duration: '38:10', thumbnail_url: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=600', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: '4', title: 'Prosperidade Sem Fim', duration: '1:05:30', thumbnail_url: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&q=80&w=600', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
];

export default function VideoRecordings() {
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (data && data.length > 0 && !error) {
        setVideos(data);
      } else {
        setVideos(fallbackVideos);
      }
    }
    fetchVideos();
  }, []);

  return (
    <section className="py-24 bg-off-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-gold text-sm font-bold uppercase tracking-widest mb-3">Reveja a Palavra</h2>
          <h3 className="text-4xl md:text-5xl font-poppins font-bold text-navy mb-6">Ensinamentos Recentes</h3>
          <p className="text-gray-600 leading-relaxed italic">
            "A fé vem pelo ouvir, e o ouvir pela Palavra de Deus." - Romanos 10:17
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {videos.map((video, idx) => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer"
              onClick={() => setSelectedVideo(video.url)}
            >
              <div className="relative aspect-video">
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
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-wine" />
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{video.category || 'Ensinamento'}</span>
                </div>
                <h4 className="text-xl font-poppins font-bold text-navy group-hover:text-gold transition-colors mb-6 line-clamp-2 leading-tight">
                  {video.title}
                </h4>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
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

      {/* Video Modal Player */}
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
                src={selectedVideo.includes('youtube.com') ? selectedVideo : `https://www.youtube.com/embed/${selectedVideo}`} 
                className="w-full h-full"
                allowFullScreen
                allow="autoplay"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
