"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([formData]);

      if (error) throw error;

      toast.success("Message sent successfully!", {
        description: "We will get back to you shortly."
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message", {
        description: err.message || "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-off-white pb-24">
      {/* Header */}
      <section className="bg-navy py-24 relative overflow-hidden text-center text-white mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-wine/5 via-transparent to-transparent z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-wine/20 rounded-full flex items-center justify-center text-wine mx-auto mb-6"
          >
            <MessageSquare size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-poppins font-bold mb-6"
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Have a question, a testimony, or just want to say hello? 
            We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-poppins font-bold text-navy mb-6">Contact Information</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Reach out to us through any of these channels or visit us during our service times. 
                Our team is always ready to assist you.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: 'Our Location', detail: 'Lisbon, Portugal', sub: 'Main Ministry Center' },
                  { icon: Phone, title: 'Call Us', detail: '+351 000 000 000', sub: 'Mon-Fri, 9am - 5pm' },
                  { icon: Mail, title: 'Email Us', detail: 'contact@ceportugal.pt', sub: 'General Enquiries' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy text-sm uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-xl font-poppins font-bold text-navy mb-1">{item.detail}</p>
                      <p className="text-sm text-gray-400">{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-video bg-gray-200 rounded-3xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
               <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col gap-2">
                  <MapPin size={48} />
                  <span className="font-bold tracking-widest uppercase text-xs">Interactive Map Data</span>
               </div>
               <img 
                 src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                 className="w-full h-full object-cover opacity-50"
                 alt="Map Placeholder"
               />
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 relative"
          >
            {submitted ? (
              <div className="py-20 text-center space-y-6">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                 </div>
                 <h3 className="text-3xl font-poppins font-bold text-navy">Thank You!</h3>
                 <p className="text-gray-500">Your message has been successfully delivered. We will respond to you shortly via email.</p>
                 <button 
                   onClick={() => setSubmitted(false)}
                   className="btn-primary mt-8"
                 >
                   Send Another Message
                 </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-poppins font-bold text-navy mb-8">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 transition-all border-2 border-transparent focus:border-wine"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 transition-all border-2 border-transparent focus:border-wine"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+351 000 000 000"
                      className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 transition-all border-2 border-transparent focus:border-wine"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">How can we help you?</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Write your message here..."
                      className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-wine/20 transition-all border-2 border-transparent focus:border-wine resize-none"
                    ></textarea>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-navy text-white p-5 rounded-2xl font-bold text-lg hover:bg-wine transition-all flex items-center justify-center gap-3 shadow-lg group disabled:opacity-50"
                  >
                    {loading ? (
                       <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
