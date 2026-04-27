"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const fallbackEvents = [
  { id: '1', title: 'Super Domingo', date: '2026-04-26T10:00:00', location: 'Centro de Luanda', image_url: '/images/services.jpg' },
  { id: '2', title: 'Santa Ceia Global', date: '2026-05-03T16:00:00', location: 'Arena LoveWorld', image_url: '/images/services.jpg' },
  { id: '3', title: 'Canais de Cura', date: '2026-05-08T18:00:00', location: 'Global Online', image_url: '/images/services.jpg' },
  { id: '4', title: 'Celebração de Domingo', date: '2026-05-31T09:00:00', location: 'Sede de Luanda', image_url: '/images/services.jpg' },
];

export default function UpcomingEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(8);

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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-wine text-sm font-bold uppercase tracking-widest mb-3">Junte-se a nós para comunhão</h2>
            <h3 className="text-4xl md:text-5xl font-poppins font-bold text-navy">Próximos Eventos</h3>
          </div>
          <Link href="/events" className="text-navy font-bold flex items-center gap-2 group hover:text-wine transition-colors">
            Ver Todos os Eventos
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl mb-6 aspect-[4/5] shadow-lg group-hover:shadow-2xl transition-all duration-500">
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
              <h4 className="text-2xl font-poppins font-bold text-navy group-hover:text-gold transition-colors mb-2">{event.title}</h4>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                <MapPin size={16} className="text-wine" />
                <span>{event.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
