"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, User, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  created_at: string;
  message: string;
  user_name: string;
  is_admin: boolean;
}

export default function ChatAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);
      
      if (data) setMessages(data);
      if (error) {
        console.error("Error fetching messages:", error);
        if (error.code === '42P01') {
          toast.error("A tabela 'chat_messages' ainda não foi criada no Supabase.");
        }
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('admin_chat_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'chat_messages' }, (payload) => {
        setMessages((prev) => prev.filter(m => m.id !== payload.old.id));
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          message: newMessage.trim(),
          user_name: 'Admin',
          is_admin: true
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Eliminar esta mensagem do chat?")) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Mensagem eliminada");
    } catch (err) {
      toast.error("Erro ao eliminar mensagem");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-navy text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-wine rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} />
           </div>
           <div>
              <h3 className="font-poppins font-bold">Chat de Moderação</h3>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Em tempo real</p>
           </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
           <span className="text-xs font-bold uppercase tracking-tight">{messages.length} MENSAGENS</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-8 space-y-6 bg-gray-50/30"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col ${msg.is_admin ? 'items-end' : 'items-start'} group`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              {msg.is_admin ? (
                <span className="text-[10px] font-bold text-wine uppercase tracking-widest">VOCÊ (ADMIN)</span>
              ) : (
                <span className="text-[10px] font-bold text-navy uppercase tracking-widest">{msg.user_name}</span>
              )}
              <span className="text-[9px] text-gray-400">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
              <button 
                onClick={() => handleDeleteMessage(msg.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-300 hover:text-wine"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <div 
              className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-sm ${
                msg.is_admin 
                  ? 'bg-navy text-white rounded-tr-none' 
                  : 'bg-white text-navy border border-gray-100 rounded-tl-none'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-50 bg-white">
        <div className="relative flex items-center gap-4">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escreve como Administrador..."
            className="flex-grow bg-off-white px-6 py-4 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-wine/10 transition-all"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="px-8 h-14 bg-wine text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-navy transition-all disabled:opacity-50 shadow-lg shadow-wine/20"
          >
            {isSending ? (
               <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
               <>
                 Enviar
                 <Send size={18} />
               </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
