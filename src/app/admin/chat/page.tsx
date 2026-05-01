"use client";

import React from 'react';
import ChatAdmin from '@/components/admin/ChatAdmin';
import { MessageSquare } from 'lucide-react';

export default function AdminChatPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Chat em Direto</h1>
           <p className="text-gray-500">Acompanhe e interaja com os espectadores da transmissão em tempo real.</p>
        </div>
      </div>

      <ChatAdmin />
    </div>
  );
}
