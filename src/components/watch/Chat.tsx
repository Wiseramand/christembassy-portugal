"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Message {
  id: string;
  created_at: string;
  content: string;
  user_name: string;
  is_admin: boolean;
}

interface ChatProps {
  visitorName: string;
}

export default function Chat({ visitorName }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (data) setMessages(data);
      if (error) {
        console.error("Error fetching messages:", error);
        // Table might not exist
        if (error.code === '42P01') {
          toast.error("Erro: A tabela 'chat_messages' não existe no banco de dados.");
        }
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
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
          content: newMessage.trim(),
          user_name: visitorName || 'Visitante',
          is_admin: false
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error("Erro ao enviar mensagem: " + (err.message || "Verifique a conexão"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
        <h3 className="text-navy font-bold text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Chat em Direto
        </h3>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          {messages.length} mensagens
        </span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 bg-off-white rounded-full flex items-center justify-center mb-3">
               <User className="text-gray-300" size={24} />
            </div>
            <p className="text-xs text-gray-400 font-medium">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.user_name === visitorName ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {msg.is_admin ? (
                   <div className="flex items-center gap-1 bg-wine/10 text-wine px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                      <ShieldCheck size={10} />
                      Admin
                   </div>
                ) : (
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    {msg.user_name}
                  </span>
                )}
                <span className="text-[9px] text-gray-300">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div 
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.is_admin 
                    ? 'bg-navy text-white font-medium shadow-md border-l-4 border-gold' 
                    : msg.user_name === visitorName
                      ? 'bg-wine text-white rounded-tr-none'
                      : 'bg-off-white text-navy rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-50 bg-white">
        <div className="relative flex items-center gap-2">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escreve uma mensagem..."
            className="flex-grow bg-off-white px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-wine/20 border border-transparent focus:border-wine/20 transition-all"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="w-11 h-11 bg-wine text-white rounded-xl flex items-center justify-center hover:bg-navy transition-all disabled:opacity-50 shadow-md shadow-wine/10"
          >
            {isSending ? (
               <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
               <Send size={18} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
