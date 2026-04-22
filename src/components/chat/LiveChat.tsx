"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, User, MessageCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  user_name: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [isSettingName, setIsSettingName] = useState(true);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load name from local storage
    const savedName = localStorage.getItem('ce_chat_name');
    if (savedName) {
      setUserName(savedName);
      setIsSettingName(false);
    }

    // Fetch initial messages
    fetchMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);

    if (data && !error) {
      setMessages(data);
    }
    setLoading(false);
  }

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('ce_chat_name', userName.trim());
      setIsSettingName(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = newMessage;
    setNewMessage('');

    const { error } = await supabase
      .from('chat_messages')
      .insert([
        { 
          user_name: userName, 
          message: messageToSend, 
          is_admin: false 
        }
      ]);

    if (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isSettingName) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mb-6">
          <User size={32} className="text-navy" />
        </div>
        <h3 className="text-xl font-poppins font-bold text-navy mb-2 text-center">Participe na Conversa</h3>
        <p className="text-gray-500 text-sm mb-8 text-center">Introduza o seu nome para começar a conversar com outros em direto.</p>
        
        <form onSubmit={handleSetName} className="w-full space-y-4">
          <input 
            type="text" 
            placeholder="O seu nome"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 rounded-xl border border-transparent focus:border-gold outline-none text-navy font-medium transition-all"
            required
            maxLength={20}
          />
          <button 
            type="submit"
            className="w-full bg-navy text-white py-4 rounded-xl font-bold shadow-lg shadow-navy/10 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Começar a Conversar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-50 bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-wine/10 rounded-lg flex items-center justify-center text-wine">
            <MessageCircle size={18} />
          </div>
          <div>
            <h3 className="text-sm font-poppins font-bold text-navy">Conversa em Direto</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Em Tempo Real</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsSettingName(true)}
          className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-navy transition-colors"
        >
          Alterar Nome
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-grow p-6 overflow-y-auto space-y-6 bg-off-white/30 scroll-smooth"
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-300">
            <div className="w-6 h-6 border-2 border-navy/10 border-t-wine rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">A ligar...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
             <MessageCircle size={48} className="mb-4 text-gray-300" />
             <p className="text-sm font-medium text-gray-500">Ainda não há mensagens. Seja o primeiro a dizer algo!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div 
              key={msg.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.is_admin ? 'items-center' : ''}`}
            >
              {msg.is_admin ? (
                <div className="bg-navy/5 border border-navy/10 rounded-2xl p-4 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={14} className="text-wine" />
                    <span className="text-[10px] font-black text-navy uppercase tracking-widest">Equipa do Ministério</span>
                  </div>
                  <p className="text-sm text-navy/80 leading-relaxed font-medium">
                    {msg.message}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-tighter">
                    {msg.user_name}
                  </span>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium inline-block max-w-[90%] shadow-sm ${
                    msg.user_name === userName 
                      ? 'bg-navy text-white rounded-tr-none' 
                      : 'bg-white text-navy border border-gray-100 rounded-tl-none text-navy/80'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-50">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Escreva a sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full bg-gray-50 px-5 py-3 pr-14 rounded-xl border border-transparent focus:border-gold outline-none text-sm font-medium transition-all"
            maxLength={500}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="absolute right-2 p-2 bg-navy text-white rounded-lg hover:bg-navy/90 active:scale-90 transition-all disabled:opacity-20 disabled:hover:bg-navy"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
