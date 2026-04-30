"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Table as TableIcon,
  RefreshCw,
  Globe,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Visitor {
  id: string;
  name: string;
  phone: string;
  country: string;
  city: string;
  created_at: string;
}

export default function VisitorsAdminPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRange, setFilterRange] = useState('all'); // 'day', 'week', 'month', 'year', 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const [viewerCount, setViewerCount] = useState(0);

  async function fetchVisitors() {
    setLoading(true);
    try {
      let query = supabase
        .from('visitors')
        .select('*', { count: 'exact' });

      // Apply Search
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
      }

      // Apply Date Filter with fresh dates
      const now = new Date();
      if (filterRange === 'day') {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        query = query.gte('created_at', start.toISOString());
      } else if (filterRange === 'week') {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        query = query.gte('created_at', start.toISOString());
      } else if (filterRange === 'month') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        query = query.gte('created_at', start.toISOString());
      } else if (filterRange === 'year') {
        const start = new Date(now.getFullYear(), 0, 1);
        query = query.gte('created_at', start.toISOString());
      }

      // Apply Pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setVisitors(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error("Error fetching visitors:", err.message);
      toast.error("Erro ao carregar visitantes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVisitors();

    // 1. Sincronização em tempo real do contador de espectadores (Presence)
    const presenceChannel = supabase.channel('online-viewers', {
      config: { presence: { key: 'admin' } }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.presenceState();
        const total = Object.values(newState).flat().length;
        setViewerCount(total);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // O admin também conta como alguém a ver o estado da live
          await presenceChannel.track({ role: 'admin', at: new Date().toISOString() });
        }
      });

    // 2. Sincronização em tempo real da lista de visitantes (Novas entradas)
    const visitorsChannel = supabase
      .channel('realtime-visitors')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'visitors' }, () => {
        fetchVisitors(); // Recarregar a lista quando houver um novo visitante
      })
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
      supabase.removeChannel(visitorsChannel);
    };
  }, [currentPage, filterRange, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVisitors();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Visitantes - Christ Embassy Portugal", 14, 15);
    
    const tableData = visitors.map(v => [
      v.name,
      v.phone,
      v.country,
      v.city,
      v.created_at ? new Date(v.created_at).toLocaleDateString('pt-PT') : ''
    ]);

    doc.autoTable({
      head: [['Nome', 'Telefone', 'País', 'Cidade', 'Data']],
      body: tableData,
      startY: 20,
    });

    doc.save(`visitantes_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(visitors.map(v => ({
      Nome: v.name,
      Telefone: v.phone,
      País: v.country,
      Cidade: v.city,
      Data: v.created_at ? new Date(v.created_at).toLocaleString('pt-PT') : ''
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Visitantes");
    XLSX.writeFile(wb, `visitantes_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-8 pb-24 relative">
      {/* Cabeçalho Fixo com Filtros */}
      <div className="sticky top-0 lg:top-[-12px] z-30 bg-gray-50/95 backdrop-blur-sm pt-4 pb-6 space-y-8 -mx-4 px-4 lg:-mx-12 lg:px-12 transition-all border-b border-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-poppins font-bold text-navy">Visitantes</h1>
              <div className="flex items-center gap-2 bg-wine/10 text-wine px-3 py-1 rounded-full text-xs font-bold">
                <span className={`w-2 h-2 rounded-full ${viewerCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                {viewerCount} EM DIRETO
              </div>
            </div>
            <p className="text-gray-500">Total histórico: <span className="font-bold text-navy">{totalCount}</span> entradas registadas.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 bg-white text-navy px-5 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              <FileText size={18} className="text-wine" />
              Exportar PDF
            </button>
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-navy text-white px-5 py-3 rounded-xl font-bold hover:bg-wine transition-all shadow-lg active:scale-95"
            >
              <TableIcon size={18} className="text-gold" />
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Filters & Search - Now inside the sticky container */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-wine transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Pesquisar visitantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-off-white p-4 pl-12 rounded-2xl outline-none border-2 border-transparent focus:border-wine/20 transition-all"
            />
          </form>

          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 bg-off-white p-1 rounded-2xl">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'day', label: 'Hoje' },
                { id: 'week', label: 'Semana' },
                { id: 'month', label: 'Mês' },
                { id: 'year', label: 'Ano' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setFilterRange(r.id); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterRange === r.id 
                      ? 'bg-navy text-white shadow-md' 
                      : 'text-gray-400 hover:text-navy'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button 
              onClick={fetchVisitors}
              className="w-10 h-10 bg-off-white rounded-xl flex items-center justify-center text-gray-400 hover:text-navy transition-all"
              title="Recarregar dados"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy text-white text-xs uppercase tracking-widest">
                <th className="px-8 py-6 font-bold">Visitante</th>
                <th className="px-8 py-6 font-bold">Localização</th>
                <th className="px-8 py-6 font-bold">Contacto</th>
                <th className="px-8 py-6 font-bold">Data de Entrada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="w-8 h-8 border-4 border-navy/10 border-t-wine rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">A sincronizar dados...</p>
                  </td>
                </tr>
              ) : visitors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Users className="mx-auto mb-4 text-gray-100" size={48} />
                    <p className="text-gray-500 font-medium">Nenhum visitante encontrado para este período.</p>
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-off-white transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-wine/5 rounded-full flex items-center justify-center text-wine font-bold">
                          {v.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-navy group-hover:text-wine transition-colors">{v.name}</p>
                          <p className="text-xs text-gray-400">ID: {v.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-gray-300" />
                        <span className="text-gray-600 text-sm font-medium">{v.country}</span>
                        <span className="text-gray-300 text-xs">•</span>
                        <span className="text-gray-500 text-sm">{v.city}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-600 text-sm bg-off-white px-3 py-1.5 rounded-lg w-fit">
                        <Phone size={14} className="text-gold" />
                        {v.phone}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-navy font-bold text-sm">
                          {new Date(v.created_at).toLocaleDateString('pt-PT')}
                        </span>
                        <span className="text-xs text-gray-400">
                          às {new Date(v.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Total: <span className="text-navy">{totalCount}</span> visitantes
          </p>
          <div className="flex items-center gap-4">
            <button 
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(p => p - 1)}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:text-navy hover:border-navy transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold text-navy">Página {currentPage} de {totalPages || 1}</span>
            <button 
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(p => p + 1)}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:text-navy hover:border-navy transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
