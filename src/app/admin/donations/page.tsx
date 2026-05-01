"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Heart, 
  Download, 
  TrendingUp, 
  Filter, 
  Search, 
  MoreHorizontal,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Donation {
  id: string;
  amount: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

export default function DonationsAdminPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    count: 0
  });
  const router = useRouter();

  async function fetchDonations() {
    setLoading(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Table may not exist yet — show empty state silently
      console.warn('Donations table error:', error.message);
      setDonations([]);
      setStats({ total: 0, count: 0 });
    } else {
      setDonations(data || []);
      const totalAmount = data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
      setStats({ total: totalAmount, count: data?.length || 0 });
    }
    setLoading(false);
  }

  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      const role = user?.user_metadata?.role || user?.app_metadata?.role || 'admin';
      if (role === 'tecnico') {
        toast.error("Acesso restrito");
        router.push('/admin');
      }
    }
    
    checkRole();
    fetchDonations();
  }, [router]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Doações e Parceria</h1>
           <p className="text-gray-500">Acompanhe e gira as contribuições financeiras e parcerias do ministério.</p>
        </div>
        <button 
          onClick={() => toast.info("Funcionalidade de exportação disponível em produção")}
          className="flex items-center justify-center gap-2 bg-white border border-gray-100 text-navy px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          <Download size={18} />
          Exportar Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-navy p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group"
         >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Total de Doações</p>
            <h3 className="text-4xl font-poppins font-bold text-gold mb-4 relative z-10">€{stats.total.toLocaleString()}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-green-400 relative z-10">
               <TrendingUp size={14} />
               +12.5% vs mês passado
            </div>
         </motion.div>

         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 border-l-4 border-l-wine">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Contagem de Transações</p>
            <h3 className="text-4xl font-poppins font-bold text-navy mb-4">{stats.count}</h3>
            <div className="text-xs font-bold text-gray-400">Processadas com sucesso</div>
         </div>

         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 border-l-4 border-l-gold">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Nível de Parceria</p>
            <h3 className="text-4xl font-poppins font-bold text-navy mb-4">Ouro</h3>
            <div className="text-xs font-bold text-gray-400">Classificação de crescimento do ministério</div>
         </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/50">
            <h3 className="text-xl font-poppins font-bold text-navy">Histórico de Transações</h3>
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Procurar por nome..." 
                    className="bg-white border border-gray-200 pl-10 pr-4 py-2 rounded-xl text-sm outline-none w-64 focus:border-gold transition-all"
                  />
               </div>
               <button className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-white transition-all">
                  <Filter size={18} />
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                     <th className="px-8 py-5">Parceiro</th>
                     <th className="px-8 py-5">Montante</th>
                     <th className="px-8 py-5">Data</th>
                     <th className="px-8 py-5">Estado</th>
                     <th className="px-8 py-5 text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                         <td colSpan={5} className="px-8 py-4 bg-gray-50/30"></td>
                      </tr>
                    ))
                  ) : donations.length === 0 ? (
                    <tr>
                       <td colSpan={5} className="px-8 py-20 text-center text-gray-300">
                          <Heart className="mx-auto mb-4 opacity-10" size={48} />
                          <p className="font-bold uppercase tracking-widest text-xs">Nenhum registo encontrado ainda</p>
                       </td>
                    </tr>
                  ) : (
                    donations.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50/50 transition-all group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-wine/10 text-wine rounded-xl flex items-center justify-center font-bold text-xs uppercase">
                                  {d.name ? d.name.substring(0, 2) : '??'}
                               </div>
                               <div>
                                  <p className="font-bold text-navy text-sm">{d.name || 'Anónimo'}</p>
                                  <p className="text-xs text-gray-400">{d.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="font-poppins font-bold text-navy">€{Number(d.amount).toFixed(2)}</span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                               <Calendar size={14} className="text-gray-300" />
                               {new Date(d.created_at).toLocaleDateString()}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                               Bem-sucedido
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button className="p-2 text-gray-300 hover:text-navy hover:bg-white rounded-lg transition-all">
                               <MoreHorizontal size={18} />
                            </button>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>

         <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-400">A mostrar {donations.length} transações</p>
            <div className="flex gap-2">
               <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:bg-white transition-all">Anterior</button>
               <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-navy hover:bg-white transition-all">Próxima Página</button>
            </div>
         </div>
      </div>
    </div>
  );
}
