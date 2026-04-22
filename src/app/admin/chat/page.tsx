"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  MessageCircle, 
  Send, 
  Trash2, 
  ShieldCheck, 
  User, 
  Clock,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  user_name: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export default function AdminChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('admin:chat_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        } else if (payload.eventType === 'DELETE') {
          setMessages((prev) => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      toast.error("Falha ao carregar o histórico do chat");
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || isSending) return;

    setIsSending(true);
    const { error } = await supabase
      .from('chat_messages')
      .insert([
        { 
          user_name: 'Admin', 
          message: reply, 
          is_admin: true 
        }
      ]);

    if (error) {
      toast.error("Falha ao enviar resposta");
    } else {
      setReply('');
    }
    setIsSending(false);
  }

  async function deleteMessage(id: string) {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Falha ao apagar mensagem");
    } else {
      toast.success("Mensagem apagada");
    }
  }

  async function clearChat() {
    if (!confirm("Tem a certeza que deseja limpar TODO o histórico do chat? Esta ação não pode ser desfeita.")) return;

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all

    if (error) {
      toast.error("Falha ao limpar o chat");
    } else {
      setMessages([]);
      toast.success("Chat limpo");
    }
  }

  return (
    <div className="h-full flex flex-col space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Controlo do Chat em Direto</h1>
           <p className="text-gray-500">Monitorize e interaja com os utilizadores que assistem ao stream em tempo real.</p>
        </div>
        <button 
          onClick={clearChat}
          className="flex items-center gap-2 px-6 py-3 bg-wine/5 text-wine rounded-xl font-bold text-sm hover:bg-wine hover:text-white transition-all"
        >
          <Trash2 size={18} /> Limpar Histórico
        </button>
      </div>

      <div className="flex-grow bg-white border border-gray-100 rounded-[2rem] shadow-xl overflow-hidden flex flex-col relative">
        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-grow p-8 overflow-y-auto space-y-8 bg-gray-50/30 scroll-smooth"
        >
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-300">
               <div className="w-10 h-10 border-4 border-navy/10 border-t-wine rounded-full animate-spin" />
               <p className="font-bold uppercase tracking-widest text-xs">A ligar ao Stream...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-20">
               <MessageCircle size={80} className="mb-6 text-navy" />
               <h3 className="text-2xl font-poppins font-bold text-navy">Sem atividade ainda</h3>
               <p className="max-w-xs mx-auto">Quando os utilizadores começarem a conversar na página do stream, as suas mensagens aparecerão aqui.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.is_admin ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`flex flex-col max-w-[80%] ${msg.is_admin ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1.5 px-2">
                       {msg.is_admin ? (
                         <>
                           <span className="text-[10px] font-black text-navy uppercase tracking-widest">Resposta do Administrador</span>
                           <ShieldCheck size={12} className="text-wine" />
                         </>
                       ) : (
                         <>
                           <User size={12} className="text-gold" />
                           <span className="text-[10px] font-black text-navy uppercase tracking-widest">{msg.user_name}</span>
                         </>
                       )}
                       <span className="text-[9px] text-gray-300 font-bold ml-2">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    
                    <div className="relative flex items-center gap-2">
                      {!msg.is_admin && (
                        <button 
                          onClick={() => deleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-wine transition-all"
                          title="Apagar mensagem"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      
                      <div className={`px-6 py-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${
                        msg.is_admin 
                          ? 'bg-navy text-white rounded-tr-none' 
                          : 'bg-white text-navy border border-gray-100 rounded-tl-none font-bold'
                      }`}>
                        {msg.message}
                      </div>

                      {msg.is_admin && (
                        <button 
                          onClick={() => deleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-wine transition-all"
                          title="Apagar mensagem"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-50">
           <form onSubmit={handleSendReply} className="relative flex items-center">
              <div className="absolute left-6 text-wine">
                 <ShieldCheck size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Responder como Administrador..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="w-full bg-gray-50 pl-14 pr-20 py-5 rounded-2xl border border-transparent focus:border-wine outline-none text-navy font-bold transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={!reply.trim() || isSending}
                className="absolute right-3 px-6 py-3 bg-navy text-white rounded-xl font-bold flex items-center gap-2 hover:bg-navy/90 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-navy/20"
              >
                {isSending ? '...' : 'Enviar'} <Send size={18} />
              </button>
           </form>
           <div className="mt-4 flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest px-2">
              <AlertCircle size={12} />
              <span>As mensagens enviadas aqui aparecerão com uma etiqueta "Admin" para todos os utilizadores.</span>
           </div>
        </div>
      </div>
    </div>
  );
}
