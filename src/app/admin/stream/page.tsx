"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Video, Save, AlertCircle, CheckCircle2, PlayCircle, ExternalLink, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { syncStreamWithMux } from './stream-actions';

export default function StreamControlPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [settings, setSettings] = useState({
    id: '',
    is_live: false,
    m3u8_url: '',
    mux_live_stream_id: '' // Added Mux ID field
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('stream_settings')
          .select('*')
          .single();

        if (error) throw error;
        if (data) setSettings(data);
      } catch (err: any) {
        toast.error("Falha ao carregar as definições do stream");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('stream_settings')
        .update({
          is_live: settings.is_live,
          m3u8_url: settings.m3u8_url,
          mux_live_stream_id: settings.mux_live_stream_id
        })
        .eq('id', settings.id);

      if (error) throw error;
      toast.success("Definições de stream atualizadas com sucesso!");
    } catch (err: any) {
      toast.error("Falha na atualização: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMuxSync = async () => {
    if (!settings.mux_live_stream_id) {
      toast.error("Por favor, insira primeiro o ID de Live Stream do Mux");
      return;
    }

    setSyncing(true);
    try {
      const result = await syncStreamWithMux(settings.id, settings.mux_live_stream_id);
      if (result.success) {
        toast.success(`Sincronizado com o Mux! Estado: ${result.status}`);
        // Refresh local state
        const { data } = await supabase
          .from('stream_settings')
          .select('*')
          .single();
        if (data) setSettings(data);
      } else {
        toast.error("Falha na sincronização do Mux: " + result.error);
      }
    } catch (err: any) {
      toast.error("Erro de sincronização: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-navy/10 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12 pb-24">
      <div>
        <h1 className="text-4xl font-poppins font-bold text-navy mb-2">Controlo de Stream</h1>
        <p className="text-gray-500">Gira o estado da sua transmissão em direto e as fontes do stream.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Mux Quick Sync Card */}
          <div className="bg-navy text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-navy">
                  <Zap size={20} fill="currentColor" />
                </div>
                <h2 className="text-xl font-bold font-poppins">Integração Mux</h2>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block ml-1">ID de Live Stream Mux</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={settings.mux_live_stream_id || ''}
                    onChange={(e) => setSettings({ ...settings, mux_live_stream_id: e.target.value })}
                    placeholder="Insira o ID de Live Stream Mux..."
                    className="flex-1 bg-white/10 border border-white/20 p-4 rounded-xl outline-none focus:border-gold transition-all font-mono text-sm text-white"
                  />
                  <button
                    onClick={handleMuxSync}
                    disabled={syncing || !settings.mux_live_stream_id}
                    className="bg-gold text-navy px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
                  >
                    {syncing ? <RefreshCw className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                    SINCRONIZAR ESTADO
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  A sincronização irá atualizar o "Estado em Direto" e o "URL M3U8" automaticamente com base no seu painel Mux.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center justify-between p-6 bg-off-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${settings.is_live ? 'bg-wine animate-pulse' : 'bg-gray-300'}`}>
                  <Video size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-navy">Estado em Direto</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">{settings.is_live ? 'A transmitir agora' : 'Stream está Offline'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, is_live: !settings.is_live })}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${settings.is_live
                    ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    : "bg-wine text-white shadow-lg active:scale-95"
                  }`}
              >
                {settings.is_live ? 'FICAR OFFLINE' : 'FICAR EM DIRETO'}
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-navy uppercase tracking-widest block ml-1">Fonte de Stream Manual (URL M3U8)</label>
              <input
                type="text"
                required
                value={settings.m3u8_url}
                onChange={(e) => setSettings({ ...settings, m3u8_url: e.target.value })}
                placeholder="https://stream.mux.com/SEU_PLAYBACK_ID.m3u8"
                className="w-full bg-off-white p-4 rounded-xl outline-none border-2 border-transparent focus:border-gold transition-all font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-2 italic">
                <AlertCircle size={14} />
                Sincronizar com o Mux irá substituir este campo.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-navy text-white p-5 rounded-2xl font-bold text-lg hover:bg-wine transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
            >
              {saving ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Guardar Alterações
                  <Save size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-poppins font-bold text-navy mb-4 flex items-center gap-2">
              <PlayCircle className="text-wine" />
              Pré-visualização
            </h3>
            <div className="aspect-video bg-navy rounded-2xl overflow-hidden mb-4 relative">
              {settings.is_live ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/20 text-xs font-bold tracking-[0.2em] uppercase text-center px-4">Sinal Ativo<br /><span className="text-[10px] lowercase tracking-normal">({settings.m3u8_url})</span></span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-navy/80 flex items-center justify-center text-white/30 text-xs font-bold uppercase tracking-widest">
                  Offline
                </div>
              )}
            </div>
            <Link
              href="/watch"
              target="_blank"
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2"
            >
              ABRIR VISTA PÚBLICA
              <ExternalLink size={14} />
            </Link>
          </div>

          <div className="bg-gold/5 border border-gold/10 p-6 rounded-3xl">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-gold shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-navy text-sm mb-1">Integração Mux Ativa</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  A utilizar o Mux Token ID do seu ambiente. Pode encontrar o seu ID de Live Stream no Painel Mux em "Live Streams".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
