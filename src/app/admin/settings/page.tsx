"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Settings, 
  Save, 
  RefreshCcw, 
  Image as ImageIcon, 
  Type, 
  Globe,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface SiteContent {
  id: string;
  content: string;
}

export default function SettingsPage() {
  const [contents, setContents] = useState<Record<string, string>>({
    hero_title: 'Giving your life a meaning',
    hero_subtitle: 'Experience the power of the Word of God and the warmth of a loving family.',
    pastor_name: 'Pastor Chris Oyakhilome',
    pastor_image: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=800',
    about_intro: 'Christ Embassy Portugal is a vibrant arm of LoveWorld Incorporated.',
    contact_email: 'contact@ceportugal.pt'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchContent() {
    const { data, error } = await supabase.from('site_content').select('*');
    if (data && !error) {
      const contentMap: Record<string, string> = {};
      data.forEach((item: SiteContent) => {
        contentMap[item.id] = item.content;
      });
      setContents(prev => ({ ...prev, ...contentMap }));
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchContent();
  }, []);

  const handleUpdate = async (id: string, content: string) => {
    const { error } = await supabase
      .from('site_content')
      .upsert({ id, content, updated_at: new Date().toISOString() });
    
    if (error) {
      toast.error(`Falha ao atualizar ${id}`);
    }
  };

  const saveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const promises = Object.entries(contents).map(([id, content]) => handleUpdate(id, content));
      await Promise.all(promises);
      toast.success("Todo o conteúdo do site atualizado com sucesso!");
    } catch (err) {
      toast.error("Ocorreu um erro ao guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-navy/10 border-t-gold rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Definições Gerais</h1>
           <p className="text-gray-500">Gira o conteúdo global do site, branding e configurações do sistema.</p>
        </div>
        <button 
          onClick={saveAll}
          disabled={saving}
          className="btn-primary flex items-center gap-2 px-10"
        >
          {saving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
          Guardar Todas as Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Main Content Areas */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
               <div className="flex items-center gap-3 pb-6 border-b border-gray-50">
                  <Type className="text-wine transition-transform hover:scale-110" />
                  <h3 className="text-xl font-poppins font-bold text-navy">Conteúdo da Página Inicial</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Título Principal do Hero</label>
                     <input 
                        type="text" 
                        value={contents.hero_title}
                        onChange={(e) => setContents({...contents, hero_title: e.target.value})}
                        className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Subtítulo do Hero</label>
                     <textarea 
                        rows={3}
                        value={contents.hero_subtitle}
                        onChange={(e) => setContents({...contents, hero_subtitle: e.target.value})}
                        className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 resize-none"
                     ></textarea>
                  </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
               <div className="flex items-center gap-3 pb-6 border-b border-gray-50">
                  <ImageIcon className="text-gold transition-transform hover:scale-110" />
                  <h3 className="text-xl font-poppins font-bold text-navy">Perfil de Liderança</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome do Pastor</label>
                       <input 
                          type="text" 
                          value={contents.pastor_name}
                          onChange={(e) => setContents({...contents, pastor_name: e.target.value})}
                          className="w-full bg-off-white p-4 rounded-xl outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">URL da Imagem do Pastor</label>
                       <input 
                          type="text" 
                          value={contents.pastor_image}
                          onChange={(e) => setContents({...contents, pastor_image: e.target.value})}
                          className="w-full bg-off-white p-4 rounded-xl outline-none"
                       />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl flex items-center justify-center p-4 border border-dashed border-gray-200">
                     <img 
                       src={contents.pastor_image} 
                       className="w-full aspect-square object-cover rounded-xl shadow-lg" 
                       alt="Pré-visualização" 
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Configs */}
         <div className="space-y-8">
            <div className="bg-navy p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3">
                     <Globe className="text-gold" />
                     <h3 className="text-lg font-poppins font-bold">Info do Sistema</h3>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                        <span className="text-white/40 uppercase font-bold tracking-widest">Ambiente</span>
                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold">PRODUÇÃO</span>
                     </div>
                     <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                        <span className="text-white/40 uppercase font-bold tracking-widest">Estado da BD</span>
                        <span className="text-white font-bold flex items-center gap-1">
                           <CheckCircle2 size={12} className="text-green-400" /> Ligado
                        </span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-white/40 uppercase font-bold tracking-widest">Versão da API</span>
                        <span className="text-white font-bold tracking-widest">v2.4.0</span>
                     </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold mb-2">Contacto de Suporte</p>
                     <p className="text-sm font-poppins font-bold text-gold">tech-support@ceportugal.pt</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="font-poppins font-bold text-navy mb-6">Sobreposição de Info de Contacto</h3>
               <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email de Suporte Global</label>
                  <input 
                    type="email" 
                    value={contents.contact_email}
                    onChange={(e) => setContents({...contents, contact_email: e.target.value})}
                    className="w-full bg-off-white p-4 rounded-xl outline-none text-sm font-medium"
                  />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
