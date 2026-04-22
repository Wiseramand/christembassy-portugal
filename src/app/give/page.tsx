"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, CreditCard, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

const amounts = [5, 10, 20, 50];

export default function GivePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const handleGive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setLoading(true);
    // Mock Stripe flow
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    toast.success("Thank you for your generous donation!", {
      description: "A confirmation receipt has been sent to your email.",
    });
    setStep(3);
  };

  const finalAmount = customAmount ? parseFloat(customAmount) : (selectedAmount || 0);

  return (
    <div className="pt-24 min-h-screen bg-off-white pb-24">
      {/* Header */}
      <section className="bg-wine py-24 relative overflow-hidden text-center text-white mb-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=2000')] opacity-20 bg-cover bg-center" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center text-gold mx-auto mb-6"
          >
            <Heart size={40} fill="currentColor" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-poppins font-bold mb-6"
          >
            Sow into the Gospel
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 max-w-2xl mx-auto text-lg"
          >
            "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." - 2 Corinthians 9:7
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            layout
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          >
            {/* Progress Bar */}
            <div className="h-1 bg-gray-100 w-full flex">
              <div 
                className="h-full bg-gold transition-all duration-500" 
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="text-2xl font-poppins font-bold text-navy mb-2">Select Amount</h2>
                      <p className="text-gray-500">Choose how much you want to donate today.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {amounts.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                          className={`py-4 rounded-2xl font-bold text-xl transition-all ${
                            selectedAmount === amt && !customAmount
                              ? "bg-navy text-white shadow-lg scale-105 border-navy"
                              : "bg-off-white text-navy hover:bg-gray-100 border-transparent"
                          } border-2`}
                        >
                          €{amt}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-bold text-navy uppercase tracking-widest block">Or enter custom amount</label>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">€</span>
                         <input 
                            type="number" 
                            placeholder="0.00"
                            value={customAmount}
                            onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                            className="w-full bg-off-white border-2 border-transparent focus:border-gold focus:bg-white p-4 pl-10 rounded-2xl text-2xl font-bold text-navy outline-none transition-all"
                         />
                      </div>
                    </div>

                    <button 
                      onClick={() => setStep(2)}
                      disabled={!finalAmount || finalAmount <= 0}
                      className="w-full bg-wine text-white py-5 rounded-2xl font-bold text-lg hover:bg-wine/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="text-2xl font-poppins font-bold text-navy mb-2">Details & Payment</h2>
                      <p className="text-gray-500">You are giving <span className="font-bold text-wine">€{finalAmount}</span></p>
                    </div>

                    <form onSubmit={handleGive} className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-navy uppercase tracking-widest block">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          value={form.name}
                          onChange={(e) => setForm({...form, name: e.target.value})}
                          className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-gold/20"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-navy uppercase tracking-widest block">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={(e) => setForm({...form, email: e.target.value})}
                          className="w-full bg-off-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-gold/20"
                        />
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                         <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-gray-500 uppercase">Secure Payment</span>
                            <Lock size={16} className="text-gray-400" />
                         </div>
                         <div className="flex items-center gap-4 text-navy">
                            <CreditCard size={24} />
                            <span className="font-medium">Stripe Payment Gateway (Test Mode)</span>
                         </div>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          type="button"
                          onClick={() => setStep(1)}
                          className="w-1/3 py-5 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                        >
                          Back
                        </button>
                        <button 
                          type="submit"
                          disabled={loading}
                          className="w-2/3 bg-gold text-navy py-5 rounded-2xl font-bold text-lg hover:bg-gold/90 transition-all flex items-center justify-center gap-2 group shadow-lg"
                        >
                          {loading ? (
                            <div className="w-6 h-6 border-3 border-navy/20 border-t-navy rounded-full animate-spin" />
                          ) : (
                            <>
                              Complete Donation
                              <Heart size={20} className="group-hover:scale-110 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-4xl font-poppins font-bold text-navy mb-4">God Bless You!</h2>
                    <p className="text-gray-500 mb-10 max-w-sm mx-auto">
                      Your gift of <span className="font-bold text-wine">€{finalAmount}</span> has been received. 
                      Thank you for partnering with us to spread the Gospel across Portugal.
                    </p>
                    <button 
                      onClick={() => { setStep(1); setCustomAmount(""); setForm({name: "", email: ""}); }}
                      className="btn-primary"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="mt-12 flex items-center justify-center gap-8 text-gray-400">
             <div className="flex items-center gap-2">
                <Lock size={16} />
                <span className="text-sm font-medium">SSL Encrypted</span>
             </div>
             <div className="w-px h-4 bg-gray-200" />
             <div className="text-sm font-bold tracking-widest uppercase">Safe & Secure</div>
          </div>
        </div>
      </div>
    </div>
  );
}
