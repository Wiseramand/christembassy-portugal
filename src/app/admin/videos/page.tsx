"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  PlusCircle, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Play, 
  Link as LinkIcon,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';

interface VOD {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
}

export default function VideosAdminPage() {
  const [videos, setVideos] = useState<VOD[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VOD | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    thumbnail_url: '',
    duration: '',
    category: 'Teaching'
  });

  async function fetchVideos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Falha ao carregar vídeos");
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenModal = (video?: VOD) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title,
        url: video.url,
        thumbnail_url: video.thumbnail_url,
        duration: video.duration,
        category: video.category
      });
    } else {
      setEditingVideo(null);
      setFormData({
        title: '',
        url: '',
        thumbnail_url: '',
        duration: '',
        category: 'Ensino'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      thumbnail_url: formData.thumbnail_url || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600'
    };

    try {
      if (editingVideo) {
        const { error } = await supabase.from('videos').update(payload).eq('id', editingVideo.id);
        if (error) throw error;
        toast.success("Vídeo atualizado");
      } else {
        const { error } = await supabase.from('videos').insert([payload]);
        if (error) throw error;
        toast.success("Vídeo adicionado à biblioteca");
      }
      setIsModalOpen(false);
      fetchVideos();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  async function handleDelete(id: string) {
    if (!confirm("Remover este vídeo da biblioteca?")) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) {
      toast.error("Falha ao eliminar");
    } else {
      toast.success("Vídeo removido");
      setVideos(videos.filter(v => v.id !== id));
    }
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Gestão de Vídeos</h1>
           <p className="text-gray-500">Gira a sua biblioteca de Vídeo-On-Demand e séries de ensino.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded-2xl font-bold hover:bg-navy hover:text-white transition-all shadow-lg active:scale-95"
        >
          <PlusCircle size={20} />
          Adicionar Vídeo
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
           <div className="w-8 h-8 border-4 border-navy/10 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {videos.map((video) => (
             <motion.div 
               key={video.id}
               className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
             >
                <div className="aspect-video relative group-hover:shadow-inner transition-all">
                   <img 
                     src={video.thumbnail_url} 
                     className="w-full h-full object-cover" 
                     alt={video.title} 
                   />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-gold text-navy rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                         <Play size={24} fill="currentColor" />
                      </div>
                   </div>
                   <div className="absolute top-3 right-3 flex gap-2">
                      <button onClick={() => handleOpenModal(video)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-navy hover:bg-gold transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(video.id)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-wine hover:bg-wine hover:text-white transition-colors">
                        <Trash2 size={16} />
                      </button>
                   </div>
                   <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest">
                      {video.duration}
                   </div>
                </div>
                <div className="p-6">
                   <div className="flex items-center gap-2 mb-3">
                      <Tag size={12} className="text-gold" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{video.category}</span>
                   </div>
                   <h3 className="font-poppins font-bold text-navy truncate group-hover:text-gold transition-colors" title={video.title}>
                     {video.title}
                   </h3>
                </div>
             </motion.div>
           ))}
        </div>
      )}

      {/* Video Modal */}
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
               className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
               <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-2xl font-poppins font-bold text-navy">
                    {editingVideo ? 'Editar Vídeo' : 'Adicionar Novo Vídeo'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-navy">
                     <X size={24} />
                  </button>
               </div>

               <form onSubmit={handleSave} className="p-8 space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Título do Vídeo</label>
                     <input 
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-off-white p-4 rounded-xl outline-none"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">URL do YouTube / Vídeo</label>
                     <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                           required
                           type="text"
                           value={formData.url}
                           onChange={(e) => setFormData({...formData, url: e.target.value})}
                           className="w-full bg-off-white p-4 pl-12 rounded-xl outline-none"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Duração</label>
                        <input 
                           required
                           type="text"
                           placeholder="45:00"
                           value={formData.duration}
                           onChange={(e) => setFormData({...formData, duration: e.target.value})}
                           className="w-full bg-off-white p-4 rounded-xl outline-none"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
                        <select 
                           value={formData.category}
                           onChange={(e) => setFormData({...formData, category: e.target.value})}
                           className="w-full bg-off-white p-4 rounded-xl outline-none"
                        >
                           <option value="Ensino">Ensino</option>
                           <option value="Serviço de Domingo">Serviço de Domingo</option>
                           <option value="Conferência">Conferência</option>
                           <option value="Testemunho">Testemunho</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">URL da Miniatura (Opcional)</label>
                     <input 
                        type="text"
                        value={formData.thumbnail_url}
                        onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                        className="w-full bg-off-white p-4 rounded-xl outline-none"
                     />
                  </div>

                  <div className="pt-6 flex gap-4">
                     <button type="submit" className="w-full bg-navy text-white p-4 rounded-xl font-bold hover:bg-wine transition-all flex items-center justify-center gap-2">
                        <Save size={18} />
                        Guardar Vídeo
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
