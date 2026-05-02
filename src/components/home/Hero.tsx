"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Heart, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const [settings, setSettings] = useState({
    hero_video_url: 'https://youtu.be/9poIdQFwwiY',
    hero_title: 'Dando um sentido à sua vida',
    hero_subtitle: 'Experimente o poder da Palavra de Deus e o calor de uma família amorosa.'
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('stream_settings').select('*').single();
      if (data) {
        setSettings({
          hero_video_url: data.hero_video_url || 'https://youtu.be/9poIdQFwwiY',
          hero_title: data.hero_title || 'Dando um sentido à sua vida',
          hero_subtitle: data.hero_subtitle || 'Experimente o poder da Palavra de Deus e o calor de uma família amorosa.'
        });
      }
    }
    fetchSettings();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-navy">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent z-10" />
        <img 
          src="/images/pastorchris.jpg" 
          alt="Pastor Chris Oyakhilome"
          className="w-full h-full object-cover opacity-40 blur-[2px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              Bem-vindo à Christ Embassy Portugal
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-poppins font-bold text-white leading-tight mb-6">
              {settings.hero_title.split('<br />').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </h1>
            
            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-lg">
              {settings.hero_subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                href="/watch" 
                className="btn-gold flex items-center gap-2 group"
              >
                <Play size={20} fill="currentColor" />
                Assistir em Direto
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/give" 
                className="btn-primary border border-white/20 bg-transparent flex items-center gap-2 hover:bg-white hover:text-navy"
              >
                <Heart size={20} />
                Dar Oferta
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-gold/30 shadow-2xl group">
              {(settings.hero_video_url.includes('youtube.com') || settings.hero_video_url.includes('youtu.be')) ? (
                <div className="w-full aspect-[4/3] md:aspect-auto">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeID(settings.hero_video_url)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeID(settings.hero_video_url)}&controls=0&modestbranding=1&rel=0&showinfo=0`}
                    className="w-full h-full min-h-[300px] md:min-h-[450px]"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              ) : (
                <>
                  <video 
                    key={settings.hero_video_url}
                    ref={videoRef}
                    src={settings.hero_video_url} 
                    className="w-full h-auto object-cover aspect-[4/3] md:aspect-auto"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white font-poppins font-bold text-xl">Pastor Chris Oyakhilome</p>
                    <p className="text-gold text-sm font-medium">Presidente, LoveWorld Inc.</p>
                  </div>

                  {/* Mute/Unmute Button Overlay */}
                  <button 
                    onClick={toggleMute}
                    className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90"
                    aria-label={isMuted ? "Ativar som" : "Desativar som"}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </>
              )}
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-wine/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gold/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-white/30 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
