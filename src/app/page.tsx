import React from 'react';
import Hero from '@/components/home/Hero';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import VideoRecordings from '@/components/home/VideoRecordings';
import Testimonials from '@/components/home/Testimonials';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Live CTA Section */}
      <section className="bg-wine py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-white">
            <h2 className="text-2xl font-poppins font-bold mb-2 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
              </span>
              Não perca os nossos Cultos em Direto
            </h2>
            <p className="text-white/70">Junte-se a milhares de crentes em todo o mundo para um encontro de transformação de vida.</p>
          </div>
          <Link
            href="/watch"
            className="bg-white text-wine px-8 py-3 rounded-full font-bold hover:bg-gold hover:text-navy transition-all">
            Assistir Agora
          </Link>
        </div>
      </section>

      <UpcomingEvents />
      <VideoRecordings />
      <Testimonials />

      {/* Give Section CTA */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-gold text-sm font-bold uppercase tracking-widest mb-6">Torne-se nosso Parceiro</h2>
          <h3 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-8">Apoiando a Expansão do Evangelho</h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
            Cada semente que semeia contribui para a expansão do Evangelho de Jesus Cristo a milhões de pessoas em Portugal e em todo o mundo.
          </p>
          <Link href="/give" className="btn-gold px-12 py-4 text-lg">
            Dar a sua Oferta
          </Link>
        </div>
      </section>
    </div>
  );
}
