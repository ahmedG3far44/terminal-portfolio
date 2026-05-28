import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Users, DollarSign, ChevronRight, Calculator, PieChart, BarChart2, ShieldAlert } from 'lucide-react';

interface ProductManagerHeroProps {
  config: {
    metricBadge: string;
    titleHighlight: string;
    titleNormal: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    showRoiCalculator: boolean;
    initialTraffic: number;
    initialCvRate: number;
  };
  onCtaClick: (btnText: string) => void;
}

// Custom data points for the dynamic SVG chart
const CHART_METRICS = {
  revenue: {
    label: 'Monthly Recurring Revenue (MRR)',
    value: '$43,200',
    change: '+14.2%',
    points: '20,40 80,120 140,80 200,160 260,110 320,180 380,240',
    gridLines: [80, 120, 160],
    color: '#10b981' // emerald
  },
  users: {
    label: 'Monthly Active Users (MAU)',
    value: '22,480',
    change: '+22.5%',
    points: '20,150 80,80 140,160 200,110 260,190 320,130 380,260',
    gridLines: [110, 150, 190],
    color: '#06b6d4' // cyan
  },
  conversion: {
    label: 'In-app Conversion Goal Rate',
    value: '3.42%',
    change: '+1.8% overall',
    points: '20,90 80,140 140,110 200,190 260,150 320,240 380,220',
    gridLines: [110, 150, 190],
    color: '#f97316' // orange
  }
};

export default function ProductManagerHero({ config, onCtaClick }: ProductManagerHeroProps) {
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'users' | 'conversion'>('revenue');
  const [traffic, setTraffic] = useState(config.initialTraffic);
  const [cvRate, setCvRate] = useState(config.initialCvRate);
  const [leadValue] = useState(45); // standard mock dollar value per lead

  const metricInfo = CHART_METRICS[activeMetric];

  // Live ROI Calculations
  const calculatedLeads = Math.round(traffic * (cvRate / 100));
  const estimatedRevenue = calculatedLeads * leadValue;

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center bg-[#050505] px-4 md:px-8 py-20 overflow-hidden border-b border-neutral-800">
      
      {/* Background Tech Grids & Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370c_1px,transparent_1px),linear-gradient(to_bottom,#1f29370c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center relative z-10">
        
        {/* PM Copy Layout */}
        <div className="lg:col-span-6 space-y-7 text-left max-w-2xl mx-auto lg:mx-0">
          
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-none text-xs font-mono font-black tracking-widest text-white uppercase"
          >
            <TrendingUp size={12} className="text-white" />
            <span>{config.metricBadge}</span>
          </motion.div>

          {/* Heading with corporate weight */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter text-white leading-none uppercase"
            id="pm-hero-title"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600 font-mono font-black mr-2">
              {config.titleHighlight}
            </span>
            {config.titleNormal}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-neutral-400 text-sm sm:text-base md:text-lg font-mono leading-relaxed text-left"
            id="pm-hero-description"
          >
            {config.description}
          </motion.p>

          {/* Quick core benefits checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-neutral-400 uppercase tracking-wider"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white" /> NO API LIMITS SETUP
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white" /> HIPAA & SOC2 SECURE
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white" /> LOCAL BROWSER SYNC
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white" /> EXPORT CONFIGS STATIC
            </span>
          </motion.div>

          {/* Premium styled primary buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4 pt-3"
          >
            <button
              onClick={() => onCtaClick(config.primaryCta)}
              className="group relative px-8 py-4 bg-white hover:bg-neutral-200 text-black font-mono font-black text-xs uppercase tracking-widest rounded-none transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 cursor-pointer border-2 border-white"
              id="btn-pm-primary"
            >
              <span>{config.primaryCta}</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onCtaClick(config.secondaryCta)}
              className="px-8 py-4 bg-black hover:bg-white/10 text-white font-mono font-black text-xs uppercase tracking-widest border-2 border-neutral-700 rounded-none transition-colors active:scale-95 cursor-pointer"
              id="btn-pm-secondary"
            >
              <span>{config.secondaryCta}</span>
            </button>
          </motion.div>
        </div>

        {/* Right side widgets: Live SaaS metrics or ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.35 }}
          className="lg:col-span-6 w-full space-y-6"
        >
          {/* Metric Dashboard Box */}
          <div className="bg-[#121212] border-2 border-neutral-800 rounded-none p-5 shadow-2xl relative overflow-hidden" id="pm-dashboard-box">
            
            {/* Widget top info tabs */}
            <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-1.5">
                <BarChart2 size={13} className="text-white" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Live Metrics</span>
              </div>
              <div className="flex bg-black p-1 rounded-none border border-neutral-800">
                {(['revenue', 'users', 'conversion'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMetric(m)}
                    className={`px-3 py-1 text-[10px] uppercase font-mono tracking-wider rounded-none transition-all cursor-pointer ${
                      activeMetric === m
                        ? 'bg-white text-black font-black'
                        : 'text-neutral-500 hover:text-neutral-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Display active metrics and chart line */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMetric}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wide">{metricInfo.label}</div>
                    <div className="text-2xl font-black font-mono text-white mt-1">{metricInfo.value}</div>
                  </div>
                  <div className="bg-neutral-900 text-white text-xs px-2.5 py-1 rounded-none font-mono font-bold border border-neutral-700">
                    {metricInfo.change}
                  </div>
                </div>

                {/* SVG Polyline custom drawing line */}
                <div className="h-28 w-full bg-black rounded-none border border-neutral-800 flex justify-center items-end relative overflow-hidden px-4">
                  <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                    {/* Grid Guideline limits */}
                    {metricInfo.gridLines.map((y, i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={y}
                        x2="400"
                        y2={y}
                        stroke="#262626"
                        strokeDasharray="4,4"
                        strokeWidth="1"
                      />
                    ))}
                    {/* Polyline Path */}
                    <polyline
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      points={metricInfo.points}
                    />
                  </svg>
                  <span className="absolute bottom-2 left-2 text-[9px] font-mono text-neutral-500">Day 1</span>
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-neutral-500">Day 30</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive ROI Calculator Widget */}
          <AnimatePresence>
            {config.showRoiCalculator && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
                className="bg-[#121212] border-2 border-neutral-800 rounded-none p-5 shadow-xl"
                id="pm-calculator-box"
              >
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-extrabold text-white mb-4 pb-2 border-b border-neutral-800">
                  <Calculator size={13} />
                  <span>Conversion ROI Calculator</span>
                </div>

                <div className="space-y-4">
                  {/* Traffic slider limit */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-400">Monthly Traffic Volume</span>
                      <span className="text-white font-mono font-bold">{traffic.toLocaleString()} Users</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={traffic}
                      onChange={(e) => setTraffic(Number(e.target.value))}
                      className="w-full accent-white h-1.5 bg-black rounded-none appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Conversion rate slider limit */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-400">Simulated Conversion</span>
                      <span className="text-white font-mono font-bold">{cvRate.toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={cvRate}
                      onChange={(e) => setCvRate(Number(e.target.value))}
                      className="w-full accent-white h-1.5 bg-black rounded-none appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Dynamic calculation results */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-black p-3 rounded-none border border-neutral-800">
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Leads Secured</div>
                      <div className="text-xl font-black text-white mt-1 font-mono">{calculatedLeads}</div>
                    </div>
                    <div className="bg-black p-3 rounded-none border border-neutral-800">
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Est. Value</div>
                      <div className="text-xl font-black text-white mt-1 font-mono">${estimatedRevenue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </section>
  );
}
