import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Star, TrendingUp, CheckCircle, Shield, Award, Users } from 'lucide-react';

interface MarketerHeroProps {
  config: {
    topBadge: string;
    titleFirstPart: string;
    titleHighlight: string;
    titleLastPart: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    socialProofCount: string;
    pricingTier: 'starter' | 'pro' | 'enterprise';
  };
  onCtaClick: (btnText: string) => void;
}

const PRICING_PLANS = {
  starter: {
    title: 'Starter Pack',
    originalPrice: '$29',
    price: '$19',
    period: '/month',
    features: ['Up to 5 team members', 'Standard Lead Analytics', 'Google Sheets native callback', '45-day query retention'],
    badge: 'Popular for solo creators',
    color: '#06b6d4'
  },
  pro: {
    title: 'Pro Scale',
    originalPrice: '$89',
    price: '$59',
    period: '/month',
    features: ['Unlimited active seats', 'Full Real-time Funnel Analytics', 'Gemini AI copywriting suite', 'Unlimited historic data logs'],
    badge: 'Best value for growing companies',
    color: '#3b82f6'
  },
  enterprise: {
    title: 'Enterprise High-Gain',
    originalPrice: '$299',
    price: '$199',
    period: '/month',
    features: ['Dedicated database cluster', 'Custom API & Webhook webhooks', 'Dedicated CSM support manager', 'Custom SLA agreements'],
    badge: 'Engineered for fast scale',
    color: '#8b5cf6'
  }
};

export default function MarketerHero({ config, onCtaClick }: MarketerHeroProps) {
  const [activePlan, setActivePlan] = useState<'starter' | 'pro' | 'enterprise'>(config.pricingTier);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [leadsCaptured, setLeadsCaptured] = useState<number>(31482);
  const [emailInput, setEmailInput] = useState<string>('');
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'success'>('idle');

  const selectedPlanInfo = PRICING_PLANS[activePlan];

  const handleCaptureLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setCaptureStatus('success');
    setLeadsCaptured(prev => prev + 1);
    setEmailInput('');
    setTimeout(() => {
      setCaptureStatus('idle');
    }, 4000);
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center bg-[#050505] px-4 md:px-8 py-20 overflow-hidden border-b border-neutral-800">
      
      {/* Background Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370c_1px,transparent_1px),linear-gradient(to_bottom,#1f29370c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Marketer copy content */}
        <div className="lg:col-span-6 space-y-7 text-left max-w-2xl mx-auto lg:mx-0">
          
          {/* Top animated conversion badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1 bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-none text-xs font-mono font-black uppercase tracking-widest text-white"
          >
            <Sparkles size={11} className="text-white animate-spin" />
            <span>{config.topBadge}</span>
          </motion.div>

          {/* Heading with bold geometric impact */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter text-white leading-none uppercase"
            id="marketer-hero-title"
          >
            {config.titleFirstPart}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 font-mono font-black mr-2">
              {config.titleHighlight}
            </span>
            {config.titleLastPart}
          </motion.h1>

          {/* Body description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-neutral-400 text-sm sm:text-base md:text-lg font-mono leading-relaxed text-left"
            id="marketer-hero-description"
          >
            {config.description}
          </motion.p>

          {/* Client-side dynamic lead capture panel */}
          <div className="bg-[#121212] border-2 border-neutral-800 p-5 rounded-none shadow-lg relative max-w-lg">
            <div className="text-xs font-mono font-bold text-white mb-3 flex justify-between items-center uppercase tracking-wider">
              <span>🚀 INSTANT DEMO HUB</span>
              <span className="text-neutral-400 flex items-center gap-1"><Users size={11} /> {leadsCaptured.toLocaleString()} active demoers</span>
            </div>
            
            <form onSubmit={handleCaptureLead} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                placeholder="Enter work email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-none bg-black border border-neutral-800 text-white placeholder-neutral-600 text-xs font-mono focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-white hover:bg-neutral-200 text-black text-xs font-mono font-black uppercase tracking-widest px-6 py-3 rounded-none flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer border-2 border-white"
              >
                <span>Demo Access</span>
                <ArrowRight size={12} />
              </button>
            </form>

            <AnimatePresence>
              {captureStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 text-xs text-emerald-400 font-mono flex items-center gap-1.5"
                >
                  <CheckCircle size={12} className="text-emerald-400" />
                  <span>Interactive local counter updated inside sandbox.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic star rating feedback widget */}
          <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
            <span className="text-gray-400">Rate this configuration:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setRatingValue(star);
                    setHasRated(true);
                  }}
                  className="p-0.5 text-yellow-500 hover:scale-125 transition-transform"
                >
                  <Star size={14} className={star <= ratingValue ? 'fill-yellow-500' : 'text-gray-600'} />
                </button>
              ))}
            </div>
            {hasRated && (
              <span className="text-cyan-40s animate-pulse font-mono text-[10px] text-cyan-400">
                ⭐ Rated {ratingValue}/5! Thanks for participating
              </span>
            )}
          </div>
        </div>

        {/* Right side interactive live pricing tier switcher */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.4 }}
          className="lg:col-span-6 w-full flex justify-center items-center"
        >
          <div className="w-full max-w-sm bg-[#121212] border-2 border-neutral-800 rounded-none p-6 shadow-3xl relative overflow-hidden" id="marketer-pricing-box">
            
            {/* Widget top info tabs */}
            <div className="flex items-center justify-between mb-5 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-1 text-xs font-mono font-bold uppercase text-white">
                <TrendingUp size={13} className="text-white" />
                <span>ROI Pricing</span>
              </div>
              <div className="flex bg-black p-0.5 rounded-none border border-neutral-800">
                {(['starter', 'pro', 'enterprise'] as const).map((pn) => (
                  <button
                    key={pn}
                    onClick={() => setActivePlan(pn)}
                    className={`px-3 py-1 text-[9px] uppercase font-mono tracking-wider rounded-none transition-all cursor-pointer ${
                      activePlan === pn
                        ? 'bg-white text-black font-black'
                        : 'text-neutral-500 hover:text-neutral-200'
                    }`}
                  >
                    {pn}
                  </button>
                ))}
              </div>
            </div>

            {/* Price section card */}
            <div className="space-y-5">
              
              {/* Badge info */}
              <div className="inline-block bg-neutral-900 border border-neutral-700 text-white text-[10px] uppercase font-mono px-2.5 py-1 rounded-none">
                ⚡ {selectedPlanInfo.badge}
              </div>

              {/* Pricing highlight */}
              <div>
                <div className="text-xs text-neutral-500 font-mono line-through">{selectedPlanInfo.originalPrice} Standard</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black font-mono text-white">{selectedPlanInfo.price}</span>
                  <span className="text-xs text-neutral-400 font-mono">{selectedPlanInfo.period}</span>
                </div>
              </div>

              {/* CTA customized trigger */}
              <button
                onClick={() => onCtaClick(selectedPlanInfo.title + ' Deal')}
                className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-mono font-black text-xs uppercase tracking-widest rounded-none transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-2 border-white"
                id="btn-marketer-pricing-cta"
              >
                <span>Pick {selectedPlanInfo.title}</span>
                <ArrowRight size={12} />
              </button>

              {/* Features checklists */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider font-extrabold">Features included:</div>
                <div className="space-y-2">
                  {selectedPlanInfo.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-xs text-neutral-300 font-mono">
                      <CheckCircle size={13} className="text-white shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantees trust indicators */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800 text-[9px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                <div className="flex items-center gap-1">
                  <Shield size={10} className="text-neutral-500" />
                  <span>Secure SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award size={10} className="text-neutral-500" />
                  <span>30-Day Guarantee</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
