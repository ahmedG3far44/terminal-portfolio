import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brush, Palette, Sparkles, Move, Layers, Zap, Heart, Check } from 'lucide-react';

interface DesignerHeroProps {
  config: {
    badgeText: string;
    titleHighlight: string;
    titleNormal: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    activeCanvasColor: string;
    canvasShape: 'circle' | 'square' | 'triangle' | 'star';
  };
  onCtaClick: (btnText: string) => void;
}

const PALETTES = [
  { name: 'Violethaze', color: '#8b5cf6', secondary: '#ec4899', style: 'from-violet-500 to-pink-500' },
  { name: 'Neo Mint', color: '#10b981', secondary: '#06b6d4', style: 'from-emerald-400 to-cyan-500' },
  { name: 'Sun flare', color: '#f97316', secondary: '#ef4444', style: 'from-orange-500 to-red-500' },
  { name: 'Electric Indigo', color: '#3b82f6', secondary: '#6366f1', style: 'from-blue-500 to-indigo-500' }
];

export default function DesignerHero({ config, onCtaClick }: DesignerHeroProps) {
  const [selectedColor, setSelectedColor] = useState(PALETTES[0].color);
  const [selectedSecondary, setSelectedSecondary] = useState(PALETTES[0].secondary);
  const [activeShape, setActiveShape] = useState<'circle' | 'square' | 'triangle' | 'star'>(config.canvasShape);
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);

  const activePaletteObj = PALETTES.find(p => p.color === selectedColor) || PALETTES[0];

  // Helper render for selected shapes
  const renderShape = () => {
    switch (activeShape) {
      case 'square':
        return (
          <motion.div
            key="square"
            layoutId="designer-shape"
            className="w-32 h-32 rounded-2xl relative shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${selectedColor}, ${selectedSecondary})`,
              boxShadow: `0 20px 40px -10px ${selectedColor}60`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        );
      case 'triangle':
        return (
          <motion.div
            key="triangle"
            layoutId="designer-shape"
            className="w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[120px] relative filter drop-shadow-xl"
            style={{ 
              borderBottomColor: selectedColor,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            <div className="absolute top-[45px] left-[-20px] text-[10px] text-white/90 font-outfit uppercase font-semibold">Tri</div>
          </motion.div>
        );
      case 'star':
        return (
          <motion.div
            key="star"
            layoutId="designer-shape"
            className="w-32 h-32 flex items-center justify-center relative"
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full filter drop-shadow-lg" style={{ fill: `url(#starGrad)` }}>
              <defs>
                <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={selectedColor} />
                  <stop offset="100%" stopColor={selectedSecondary} />
                </linearGradient>
              </defs>
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L1.132 9.41l8.2-1.192z" />
            </svg>
          </motion.div>
        );
      case 'circle':
      default:
        return (
          <motion.div
            key="circle"
            layoutId="designer-shape"
            className="w-32 h-32 rounded-full relative shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${selectedColor}, ${selectedSecondary})`,
              boxShadow: `0 20px 40px -10px ${selectedColor}60`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        );
    }
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center bg-[#050505] px-4 md:px-8 py-20 overflow-hidden border-b border-neutral-800">
      
      {/* Background Neon Spotlights - Lowered opacity for high-contrast legible layout */}
      <div className="absolute top-[5%] right-[-10%] w-[450px] h-[450px] rounded-none bg-neutral-900/40 pointer-events-none" />

      {/* Grid structure overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370c_1px,transparent_1px),linear-gradient(to_bottom,#1f29370c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Designer layout spacing */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left side copy presentation */}
        <div className="lg:col-span-7 space-y-8 text-left max-w-2xl mx-auto lg:mx-0">
          
          {/* Sparkly Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-none text-xs font-mono font-black tracking-widest text-white uppercase"
          >
            <Sparkles size={12} className="text-white animate-spin" />
            <span>{config.badgeText}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter text-white leading-none uppercase"
            id="designer-hero-title"
          >
            Where{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 font-mono font-black">
              {config.titleHighlight}
            </span>
            {config.titleNormal}
          </motion.h1>

          {/* Body sub-text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-neutral-400 text-sm sm:text-base md:text-lg font-mono leading-relaxed text-left"
            id="designer-hero-description"
          >
            {config.description}
          </motion.p>

          {/* Designer customized palette list in copy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-3 pt-2"
          >
            <span className="text-xs font-black text-neutral-400 font-mono flex items-center gap-1.5 uppercase tracking-wider">
              <Palette size={13} /> BOARD Color SWATCHES:
            </span>
            <div className="flex gap-2">
              {PALETTES.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setSelectedColor(p.color);
                    setSelectedSecondary(p.secondary);
                  }}
                  className={`w-6 h-6 rounded-none border-2 transition-all duration-300 relative cursor-pointer ${
                    selectedColor === p.color
                      ? 'border-white scale-120 shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                      : 'border-transparent hover:scale-110'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${p.color}, ${p.secondary})` }}
                  title={p.name}
                >
                  {selectedColor === p.color && (
                    <span className="absolute inset-0 flex items-center justify-center text-white">
                      <Check size={10} className="stroke-[3]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Interactive CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={() => onCtaClick(config.primaryCta)}
              className="group relative px-8 py-4 rounded-none text-black bg-white hover:bg-neutral-200 font-mono font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer border-2 border-white"
              id="btn-designer-primary"
            >
              <Brush size={14} className="group-hover:rotate-12 transition-transform" />
              <span>{config.primaryCta}</span>
            </button>

            <button
               onClick={() => onCtaClick(config.secondaryCta)}
               className="px-8 py-4 rounded-none bg-black hover:bg-white/10 text-white font-mono font-black text-xs uppercase tracking-widest border-2 border-neutral-700 transition-all duration-300 active:scale-95 cursor-pointer"
               id="btn-designer-secondary"
            >
              <span>{config.secondaryCta}</span>
            </button>
          </motion.div>
        </div>

        {/* Right side interactive graphic workspace simulation canvas */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.4 }}
          className="lg:col-span-5 w-full flex justify-center items-center"
        >
          <div className="w-full max-w-md bg-[#121212] border-2 border-neutral-800 rounded-none shadow-3xl p-6 relative overflow-hidden" id="designer-canvas-box">
            
            {/* Top Bar decorative layers */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Workspace Canvas</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-1.5 rounded-none border transition-colors cursor-pointer ${
                    isLiked 
                      ? 'bg-white border-white text-black' 
                      : 'border-neutral-700 hover:border-white text-neutral-400 hover:text-white'
                  }`}
                  title="Bookmark Canvas config"
                >
                  <Heart size={10} className={isLiked ? 'fill-black' : ''} />
                </button>
                <span className="text-[9px] bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded-none text-neutral-400 font-mono">
                  1200 x 900
                </span>
              </div>
            </div>

            {/* Shape selection controls */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {(['circle', 'square', 'triangle', 'star'] as const).map((sh) => (
                <button
                  key={sh}
                  onClick={() => setActiveShape(sh)}
                  className={`py-2 px-1 rounded-none border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                    activeShape === sh
                      ? 'bg-white text-black border-white font-black'
                      : 'border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] font-mono uppercase tracking-wider">{sh}</span>
                </button>
              ))}
            </div>

            {/* Simulated Live Canvas */}
            <div className="h-56 w-full bg-black rounded-none flex items-center justify-center relative overflow-hidden border border-neutral-800">
              
              {/* Background dots styling */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

              {/* Render Selected Dynamic Shape */}
              <div className="relative z-10 scale-110">
                {renderShape()}
              </div>

              {/* Holographic glowing lines helper */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 text-[9px] font-mono text-neutral-500">
                <div>Y: 215.12</div>
                <div>X: 382.04</div>
                <div>Rot: 0.00°</div>
              </div>

              {/* Draggable element handle decoration using Framer Motion */}
              <motion.div
                drag
                dragConstraints={{ left: -100, right: 100, top: -70, bottom: 70 }}
                dragElastic={0.4}
                whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                className="absolute right-6 top-6 bg-neutral-900 hover:bg-neutral-800 backdrop-blur-md p-1.5 rounded-none border border-neutral-700 text-white select-none cursor-grab flex items-center gap-1 z-20"
                id="draggable-canvas-badge"
              >
                <Move size={10} />
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold">DRAG ME</span>
              </motion.div>
            </div>

            {/* Active layer selector checklist mockup */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono font-bold uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1"><Layers size={11} /> LAYERS:</span>
                <span className="text-neutral-500">3 levels active</span>
              </div>
              {[
                { name: 'Primary Vector Shape', desc: 'Active parameters', icon: Zap },
                { name: 'Ambient Radial Overlay', desc: '60% opacity blend', icon: Palette },
                { name: 'Wireframe Guidelines', desc: '1px responsive rules', icon: Brush }
              ].map((layer, index) => {
                const IconComp = layer.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveLayer(index)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-none border text-left transition-all cursor-pointer ${
                      activeLayer === index
                        ? 'bg-neutral-900 border-white text-white'
                        : 'border-neutral-800 bg-transparent text-neutral-400 hover:bg-neutral-950 hover:text-white'
                    }`}
                  >
                    <div 
                      className={`p-1.5 rounded-none ${
                        activeLayer === index ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      <IconComp size={11} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-wider font-black truncate">{layer.name}</div>
                      <div className="text-[9px] font-mono text-neutral-500 truncate">{layer.desc}</div>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-none border border-neutral-700 flex items-center justify-center">
                      {activeLayer === index && <div className="w-1.5 h-1.5 bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
