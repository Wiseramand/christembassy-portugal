"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  Mail, 
  Phone, 
  Clock, 
  ChevronRight,
  Search,
  Filter,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Falha ao carregar mensagens");
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function toggleReadStatus(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error("Falha ao atualizar estado");
    } else {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
      if (selectedMsg?.id === id) {
        setSelectedMsg({ ...selectedMsg, is_read: !currentStatus });
      }
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Tem a certeza que deseja eliminar esta mensagem?")) return;

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Falha ao eliminar mensagem");
    } else {
      toast.success("Mensagem eliminada");
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
    }
  }

  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Mensagens de Contacto</h1>
           <p className="text-gray-500">Gira pedidos de informação, pedidos de oração e testemunhos do website.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-gray-100 p-2 rounded-2xl shadow-sm">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Procurar mensagens..."
                className="bg-transparent pl-12 pr-4 py-2 outline-none text-sm text-navy w-64"
              />
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all uppercase tracking-widest">
              <Filter size={16} /> Filtrar
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-grow overflow-hidden min-h-[600px]">
        {/* Message List */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
           <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Caixa de Entrada ({messages.length})</span>
           </div>
           <div className="flex-grow overflow-y-auto">
              {loading ? (
                <div className="p-12 text-center text-gray-300">
                  <div className="w-8 h-8 border-4 border-navy/10 border-t-wine rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">A sincronizar...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-20 text-center text-gray-300">
                   <MessageSquare className="mx-auto mb-6 opacity-10" size={64} />
                   <p className="text-sm font-bold uppercase tracking-widest">Ainda não existem mensagens</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {messages.map((m) => (
                    <button 
                      key={m.id}
                      onClick={() => setSelectedMsg(m)}
                      className={`w-full text-left p-6 flex flex-col gap-2 transition-all hover:bg-gray-50 relative ${
                        selectedMsg?.id === m.id ? 'bg-gold/5 border-l-4 border-l-gold' : 'border-l-4 border-l-transparent'
                      }`}
                    >
                       {!m.is_read && <div className="absolute top-6 right-6 w-2 h-2 bg-wine rounded-full" />}
                       <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold truncate ${m.is_read ? 'text-gray-400' : 'text-navy'}`}>{m.name}</h4>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            {new Date(m.created_at).toLocaleDateString()}
                          </span>
                       </div>
                       <p className={`text-xs line-clamp-1 ${m.is_read ? 'text-gray-300' : 'text-gray-500'}`}>
                          {m.message}
                       </p>
                    </button>
                  ))}
                </div>
              )}
           </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden flex flex-col relative">
           <AnimatePresence mode="wait">
             {selectedMsg ? (
               <motion.div 
                 key={selectedMsg.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex flex-col h-full"
               >
                 {/* Toolbar */}
                 <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => toggleReadStatus(selectedMsg.id, selectedMsg.is_read)}
                        className={`p-2 rounded-xl transition-all ${selectedMsg.is_read ? 'text-gray-400 hover:text-navy hover:bg-gray-100' : 'text-green-600 bg-green-50'}`}
                        title="Marcar como Lida/Não Lida"
                       >
                          <CheckCircle size={20} />
                       </button>
                       <button 
                        onClick={() => deleteMessage(selectedMsg.id)}
                        className="p-2 text-gray-400 hover:text-wine hover:bg-wine/5 rounded-xl transition-all"
                        title="Eliminar Mensagem"
                       >
                          <Trash2 size={20} />
                       </button>
                    </div>
                    <button className="text-gray-400 p-2 hover:bg-gray-100 rounded-xl" onClick={() => setSelectedMsg(null)}>
                       <X size={20} />
                    </button>
                 </div>

                 {/* Content body */}
                 <div className="flex-grow p-10 overflow-y-auto space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-gray-50">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-navy text-white rounded-3xl flex items-center justify-center font-poppins font-bold text-2xl uppercase shadow-lg">
                             {selectedMsg.name.substring(0, 2)}
                          </div>
                          <div>
                             <h2 className="text-3xl font-poppins font-bold text-navy">{selectedMsg.name}</h2>
                             <div className="flex flex-wrap gap-4 mt-2">
                                <div className="flex items-center gap-2 text-wine font-bold text-xs uppercase tracking-widest">
                                   <Mail size={14} />
                                   {selectedMsg.email}
                                </div>
                                {selectedMsg.phone && (
                                  <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-widest">
                                    <Phone size={14} />
                                    {selectedMsg.phone}
                                  </div>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                             <Clock size={14} /> Recebido
                          </div>
                          <p className="font-bold text-navy text-sm">{new Date(selectedMsg.created_at).toLocaleString()}</p>
                       </div>
                    </div>

                    <div className="prose prose-navy max-w-none">
                       <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-6 border-l-2 border-wine pl-4">Conteúdo da Mensagem</h4>
                       <p className="text-gray-600 text-lg leading-relaxed bg-off-white p-8 rounded-3xl border border-gray-100 whitespace-pre-wrap italic">
                          &quot;{selectedMsg.message}&quot;
                       </p>
                    </div>
                    
                    <div className="pt-10 flex gap-4">
                       <a 
                        href={`mailto:${selectedMsg.email}`}
                        className="btn-primary flex items-center justify-center gap-2 flex-grow"
                       >
                          Responder via Email
                          <ChevronRight size={18} />
                       </a>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-center p-20 text-gray-300">
                  <div className="w-32 h-32 bg-off-white rounded-full flex items-center justify-center mb-8 relative">
                     <div className="absolute inset-0 bg-gold/10 rounded-full animate-ping opacity-20" />
                     <MessageSquare size={64} className="opacity-10" />
                  </div>
                  <h3 className="text-2xl font-poppins font-bold text-gray-400 mb-2">Nenhuma Mensagem Selecionada</h3>
                  <p className="max-w-xs text-sm">Selecione uma mensagem da lista para ver os seus detalhes e responder.</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
