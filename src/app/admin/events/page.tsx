"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  PlusCircle, 
  Save, 
  X,
  MapPin,
  Clock,
  Image as ImageIcon,
  Upload,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
}

export default function EventsAdminPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image_url: ''
  });

  async function fetchEvents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.warn('Events table error:', error.message);
      setEvents([]);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (event?: ChurchEvent) => {
    if (event) {
      const dt = new Date(event.date);
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: dt.toISOString().split('T')[0],
        time: dt.toTimeString().split(' ')[0].slice(0, 5),
        location: event.location,
        image_url: event.image_url
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `event-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('books') // Reusing the same bucket as requested "mesmo upload"
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('books')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Imagem carregada!");
    } catch (error: any) {
      toast.error(`Erro no upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const combinedDate = `${formData.date}T${formData.time}:00`;
    
    const eventPayload = {
      title: formData.title,
      description: formData.description,
      date: combinedDate,
      location: formData.location,
      image_url: formData.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
    };

    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventPayload)
          .eq('id', editingEvent.id);
        if (error) throw error;
        toast.success("Evento atualizado");
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventPayload]);
        if (error) throw error;
        toast.success("Evento criado");
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      toast.error("Falha na operação: " + err.message);
    }
  };

  async function handleDelete(id: string) {
    if (!confirm("Tem a certeza que deseja eliminar este evento?")) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      toast.error("Falha ao eliminar");
    } else {
      toast.success("Evento eliminado");
      setEvents(events.filter(e => e.id !== id));
    }
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Gestão de Eventos</h1>
           <p className="text-gray-500">Planeie e gira os próximos serviços e conferências.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-wine transition-all shadow-lg active:scale-95 group"
        >
          <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
          Criar Novo Evento
        </button>
      </div>

      {loading ? (
         <div className="bg-white p-20 rounded-3xl text-center">
            <div className="w-10 h-10 border-4 border-navy/10 border-t-wine rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">A carregar Eventos...</p>
         </div>
      ) : events.length === 0 ? (
         <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-100">
            <Calendar className="mx-auto mb-6 text-gray-100" size={80} />
            <h3 className="text-xl font-poppins font-bold text-navy mb-2">Nenhum Evento Encontrado</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Comece por criar o seu primeiro evento.</p>
            <button onClick={() => handleOpenModal()} className="btn-primary">Começar</button>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <motion.div 
                key={event.id}
                layout
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
              >
                <div className="aspect-[16/9] relative">
                   <img 
                     src={event.image_url} 
                     alt={event.title}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                   />
                   <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/40 transition-colors" />
                   <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(event)}
                        className="w-10 h-10 bg-white/90 backdrop-blur text-navy rounded-xl flex items-center justify-center hover:bg-gold transition-colors"
                      >
                         <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="w-10 h-10 bg-white/90 backdrop-blur text-wine rounded-xl flex items-center justify-center hover:bg-wine hover:text-white transition-colors"
                      >
                         <Trash2 size={18} />
                      </button>
                   </div>
                </div>
                <div className="p-8">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="bg-wine/5 px-2 py-1 rounded text-[10px] font-bold text-wine uppercase tracking-widest leading-none">
                         {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="bg-gold/10 px-2 py-1 rounded text-[10px] font-bold text-gold uppercase tracking-widest leading-none">
                         {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                   </div>
                   <h3 className="text-xl font-poppins font-bold text-navy mb-4">{event.title}</h3>
                   <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                         <MapPin size={16} className="text-gray-300" />
                         {event.location}
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
         </div>
      )}

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                 <h2 className="text-2xl font-poppins font-bold text-navy">
                    {editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-navy">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Título do Evento</label>
                    <input 
                      required
                      type="text"
                      placeholder="Serviço Especial de Domingo"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all"
                    />
                 </div>

                 {/* Image Upload */}
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Cartaz / Imagem do Evento</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="hidden" 
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className={`w-full p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                        formData.image_url 
                          ? 'border-green-200 bg-green-50 text-green-700' 
                          : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-wine hover:bg-wine/5'
                      }`}
                    >
                       {isUploading ? (
                         <Loader2 className="animate-spin text-wine" size={32} />
                       ) : formData.image_url ? (
                         <CheckCircle2 size={32} />
                       ) : (
                         <Upload size={32} />
                       )}
                       <span className="font-bold uppercase tracking-wider text-sm">
                         {isUploading ? 'A carregar...' : formData.image_url ? 'Imagem Pronta' : 'Selecionar Imagem do Computador'}
                       </span>
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Data</label>
                       <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            required
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Hora</label>
                       <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            required
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                            className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Localização</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <input 
                         required
                         type="text"
                         placeholder="Odivelas / Setúbal / Online"
                         value={formData.location}
                         onChange={(e) => setFormData({...formData, location: e.target.value})}
                         className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
                    <textarea 
                      rows={3}
                      placeholder="Conte mais sobre este evento..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 border-2 border-transparent focus:border-wine transition-all resize-none"
                    ></textarea>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="w-1/3 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                    >
                       Cancelar
                    </button>
                    <button 
                      type="submit"
                      disabled={isUploading}
                      className="w-2/3 bg-navy text-white p-4 rounded-xl font-bold hover:bg-wine transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                       <Save size={18} />
                       {editingEvent ? 'Guardar Alterações' : 'Criar Evento'}
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
