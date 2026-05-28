import { CustomHeroConfig } from '../types';

export function getDeveloperCode(config: CustomHeroConfig['developer']): string {
  return `import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, FileCode, FolderOpen, Play, CheckCircle, Copy } from 'lucide-react';

export default function HeroSection() {
  const [selectedFile, setSelectedFile] = useState('features.json');
  
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center bg-[#070b13] px-6 py-16 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-80 h-80 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      {/* Hero Header */}
      <div className="w-full max-w-4xl text-center mb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs md:text-sm font-mono text-orange-500/80 mb-6 bg-[#0d1527] px-4 py-2 rounded-full inline-block border border-orange-500/15"
        >
          { \`> ${config.commandLine}\` }
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
          ${config.titleFirstPart}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 font-mono">
            ${config.titleHighlight}
          </span>
          ${config.titleLastPart}
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          ${config.description}
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-mono text-sm px-6 py-3.5 rounded-lg font-medium hover:scale-105 transition-transform">
            &gt;_ ${config.primaryCta}
          </button>
          <button className="bg-[#090d16] text-gray-300 font-mono text-sm px-6 py-3.5 rounded-lg border border-gray-800 hover:text-white transition-colors">
            ${config.secondaryCta}
          </button>
        </div>
      </div>

      {/* Terminal View */}
      ${config.showFiles ? `
      <div className="w-full max-w-4xl bg-[#090e17] rounded-xl border border-gray-800 shadow-2xl overflow-hidden font-mono text-sm">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1421] border-b border-gray-900">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-xs text-gray-500 ml-2">dev@platform: ~/src</span>
        </div>
        <div className="grid grid-cols-4 min-h-[250px] bg-[#080d15] text-gray-300">
          <div className="p-4 bg-[#0b121e] border-r border-gray-900">
            <span className="text-xs text-gray-500 uppercase font-bold">Files</span>
            {/* Folder structures here */}
          </div>
          <div className="col-span-3 p-4">
            <pre className="text-xs">Selected file content displayed here...</pre>
          </div>
        </div>
      </div>` : '<!-- Code Sandbox option disabled -->'}
    </section>
  );
}`.trim();
}

export function getDesignerCode(config: CustomHeroConfig['designer']): string {
  return `import React from 'react';
import { motion } from 'motion/react';
import { Brush, Sparkles } from 'lucide-react';

export default function DesignerHero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center bg-[#070414] px-6 py-20 overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-[5%] right-[-10%] w-[450px] h-[450px] bg-violet-600/15 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] bg-pink-500/10 blur-[160px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-500/15 to-pink-500/15 border border-purple-500/25 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-purple-300 uppercase">
            <Sparkles size={12} className="text-pink-400" />
            <span>${config.badgeText}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500 font-bold">${config.titleHighlight}</span>${config.titleNormal}
          </h1>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            ${config.description}
          </p>

          <div className="flex gap-4">
            <button className="px-7 py-4 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-violet-500 to-pink-500 hover:shadow-lg transition-shadow">
              ${config.primaryCta}
            </button>
            <button className="px-7 py-4 rounded-xl bg-purple-950/20 text-purple-300 font-semibold text-sm border border-purple-500/25 hover:text-white transition-colors">
              ${config.secondaryCta}
            </button>
          </div>
        </div>

        {/* Live Canvas Mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-[#0e0a1f]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl relative">
            <div className="h-56 w-full bg-[#070411] rounded-xl flex items-center justify-center border border-purple-950/50">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}`.trim();
}

export function getProductManagerCode(config: CustomHeroConfig['product-manager']): string {
  return `import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, BarChart2 } from 'lucide-react';

export default function PMHero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center bg-[#090b0f] px-6 py-20 overflow-hidden">
      <div className="absolute top-[20%] left-[25%] w-80 h-80 bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-6 space-y-7 text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#121c17] border border-emerald-500/20 px-3 py-1 rounded-md text-xs font-mono font-medium text-emerald-400">
            <TrendingUp size={12} />
            <span>${config.metricBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">${config.titleHighlight}</span>${config.titleNormal}
          </h1>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            ${config.description}
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3.5 bg-emerald-500 text-[#090b0f] font-semibold text-sm rounded-lg hover:shadow-xl transition-all">
              ${config.primaryCta}
            </button>
            <button className="px-6 py-3.5 bg-[#141822] text-gray-300 font-medium text-sm rounded-lg border border-gray-800 hover:text-white transition-colors">
              ${config.secondaryCta}
            </button>
          </div>
        </div>

        {/* Widget and ROI calculator view */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#10141f] border border-gray-800 p-5 rounded-xl text-gray-400">
            <BarChart2 size={15} className="text-emerald-500 mb-2" />
            <span className="text-xs uppercase font-mono">Live Metrics Dashboard</span>
          </div>
        </div>
      </div>
    </section>
  );
}`.trim();
}

export function getMarketerCode(config: CustomHeroConfig['marketer']): string {
  return `import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function MarketerHero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center bg-[#030815] px-6 py-20 overflow-hidden">
      <div className="absolute top-[-10%] x-0 w-[550px] h-[550px] bg-cyan-500/10 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-7">
          <div className="inline-flex items-center gap-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-300">
            <Sparkles size={11} className="text-cyan-400" />
            <span>${config.topBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
            ${config.titleFirstPart}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              ${config.titleHighlight}
            </span>
            ${config.titleLastPart}
          </h1>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            ${config.description}
          </p>

          <div className="flex gap-4">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-6 py-3 rounded-lg hover:scale-105 transition-all">
              ${config.primaryCta}
            </button>
            <button className="bg-transparent border border-gray-800 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-colors text-xs">
              ${config.secondaryCta}
            </button>
          </div>
        </div>

        {/* Pricing Selection Widget */}
        <div className="lg:col-span-6 bg-[#0a1122]/90 border border-cyan-500/20 rounded-2xl p-6">
          <span className="text-xs font-mono text-cyan-400 uppercase">Conversion Value Card</span>
        </div>
      </div>
    </section>
  );
}`.trim();
}
