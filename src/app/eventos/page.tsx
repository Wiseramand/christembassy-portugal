"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const fallbackEvents = [
  { id: '1', title: 'Santa Comunhão', date: '2026-05-03T10:00:00', location: 'Sede Local', image_url: '/images/services.jpg' },
  { id: '2', title: 'Rhapaton', date: '2026-05-04T18:00:00', location: 'Global Online', image_url: '/images/services.jpg' },
  { id: '3', title: 'Culto de Domingo', date: '2026-05-10T10:00:00', location: 'Sede Local', image_url: '/images/services.jpg' },
  { id: '4', title: 'Culto de Quarta Feira', date: '2026-05-13T19:00:00', location: 'Sede Local', image_url: '/images/services.jpg' },
];

export default function EventosPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (data && data.length > 0 && !error) {
        setEvents(data);
      } else {
        setEvents(fallbackEvents);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-wine text-sm font-bold uppercase tracking-widest mb-3">Calendário</h1>
          <h2 className="text-4xl md:text-6xl font-poppins font-bold text-navy mb-6">Todos os Eventos</h2>
          <p className="text-gray-600 leading-relaxed italic">
            Fique por dentro de todos os nossos encontros, cultos e conferências planeados para si.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group cursor-pointer flex flex-col h-full"
            >
              <div className="relative overflow-hidden rounded-3xl mb-6 aspect-square shadow-lg group-hover:shadow-2xl transition-all duration-500 shrink-0">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4">
                     <div className="text-center border-r border-white/20 pr-4">
                        <p className="text-white font-bold text-xl leading-none">{new Date(event.date).getDate()}</p>
                        <p className="text-gold text-[10px] uppercase font-bold tracking-widest mt-1">
                          {new Date(event.date).toLocaleDateString('pt-PT', { month: 'short' })}
                        </p>
                     </div>
                     <div>
                        <p className="text-white text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                           <CalendarIcon size={12} className="text-gold" />
                           {new Date(event.date).toLocaleDateString('pt-PT', { weekday: 'long' })}
                        </p>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                           {new Date(event.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                     </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h4 className="text-2xl font-poppins font-bold text-navy group-hover:text-gold transition-colors mb-2 flex-1">{event.title}</h4>
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium shrink-0">
                  <MapPin size={16} className="text-wine" />
                  <span>{event.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
