import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, FileCode, Folder, FolderOpen, Play, CheckCircle, RefreshCw, Copy, ExternalLink } from 'lucide-react';

interface DeveloperHeroProps {
  config: {
    commandLine: string;
    titleFirstPart: string;
    titleHighlight: string;
    titleLastPart: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    showFiles: boolean;
  };
  onCtaClick: (btnText: string) => void;
}

const MOCK_FILES = [
  {
    name: 'features.json',
    language: 'json',
    content: `{
  "platform": "Full-stack Platform",
  "auth": "GitHub Oauth 2.0 Integration",
  "database": "IndexedDB Local Persistence",
  "admin": "Super Admin Status Checker",
  "speed": "Under 45ms time-to-interactive",
  "theme": "Terminal Dark Aesthetic"
}`
  },
  {
    name: 'App.tsx',
    language: 'typescript',
    content: `import React from 'react';
import { motion } from 'motion/react';

export default function Portfolio() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 text-amber-500 font-mono"
    >
      <h1>> Initializing connection...</h1>
      <p>Secure pipeline complete.</p>
    </motion.div>
  );
}
`
  },
  {
    name: 'server.ts',
    language: 'typescript',
    content: `import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/health', (req, res) => {
  res.json({
    status: 'active',
    databaseConnection: true,
    latency: '15ms',
    uptime: '100%'
  });
});
`
  }
];

export default function DeveloperHero({ config, onCtaClick }: DeveloperHeroProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [shownCode, setShownCode] = useState('');
  const [showCopied, setShowCopied] = useState(false);

  // Simple typing effect for terminal code preview or executed commands
  useEffect(() => {
    const fullCode = MOCK_FILES[selectedFileIndex].content;
    setShownCode(fullCode);
  }, [selectedFileIndex]);

  const handleRunCommand = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setCommandOutput(prev => [...prev, `运行中: $ ${config.commandLine}`]);
    
    setTimeout(() => {
      setCommandOutput(prev => [
        ...prev,
        `[INFO] Querying active workspace modules...`,
        `[SUCCESS] 4 features initialized successfully.`,
        `[STATUS] Listening on port 3000.`
      ]);
      setIsExecuting(false);
    }, 1200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(MOCK_FILES[selectedFileIndex].content);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center items-center bg-[#050505] px-4 md:px-8 py-20 overflow-hidden select-none border-b border-neutral-800">
      
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_105%,transparent_105%)] pointer-events-none" />

      {/* Terminal Command executed floating at top */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xs md:text-sm font-mono text-white mb-6 flex items-center gap-2 bg-[#121212] px-4 py-2 rounded-none border border-neutral-800"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse"></span>
        <span>{`> LOG: CAT ./FEATURES.BIN`}</span>
      </motion.div>

      {/* Main Copy / Titles */}
      <div className="w-full max-w-5xl text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter text-white leading-none uppercase"
          id="developer-hero-title"
        >
          {config.titleFirstPart}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 font-mono font-black select-text ml-2">
            {config.titleHighlight}
          </span>
          {config.titleLastPart}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-neutral-400 font-mono max-w-3xl mx-auto leading-relaxed"
          id="developer-hero-description"
        >
          {config.description}
        </motion.p>

        {/* Call to Actions (inspired by terminal controls) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center items-center gap-4"
        >
          <button
            onClick={() => onCtaClick(config.primaryCta)}
            className="group relative flex items-center gap-2 bg-white text-black font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-none font-black transition-all duration-300 hover:bg-neutral-200 hover:scale-[1.02] active:scale-95 border-2 border-white cursor-pointer"
            id="btn-developer-primary"
          >
            <Terminal size={14} className="text-black group-hover:rotate-12 transition-transform" />
            <span>{config.primaryCta}</span>
          </button>

          <button
            onClick={() => onCtaClick(config.secondaryCta)}
            className="flex items-center gap-2 bg-black hover:bg-white/10 text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-none font-black border-2 border-neutral-700 transition-all duration-200 active:scale-95 cursor-pointer"
            id="btn-developer-secondary"
          >
            <FileCode size={14} className="text-neutral-400" />
            <span>{config.secondaryCta}</span>
          </button>
        </motion.div>
      </div>

      {/* Interactive Integrated File Explorer & Code Terminal Mockup */}
      <AnimatePresence>
        {config.showFiles && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-4xl bg-[#121212] rounded-none border-2 border-neutral-800 shadow-2xl overflow-hidden"
            id="developer-terminal-box"
          >
            {/* Window bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black border-b-2 border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-none bg-neutral-700" />
                <div className="w-2.5 h-2.5 rounded-none bg-neutral-600" />
                <div className="w-2.5 h-2.5 rounded-none bg-neutral-500" />
                <span className="ml-2 text-[10px] font-mono text-neutral-400 flex items-center gap-1.5 bg-[#1a1a1a] px-2.5 py-0.5 rounded-none border border-neutral-800">
                  <Terminal size={11} className="text-neutral-500" /> dev@showcase:~/src
                </span>
              </div>
              <div className="text-[10px] font-mono text-neutral-500 hidden sm:block uppercase tracking-wider">
                Active Session
              </div>
            </div>

            {/* Split code screen layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 min-h-[300px] text-sm font-mono">
              
              {/* Sidebar File Explorer */}
              <div className="bg-black border-r-2 border-neutral-800 p-4 md:col-span-1">
                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-4">
                  File Tree
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-bold uppercase">
                    <FolderOpen size={12} className="text-white" />
                    <span>SRC /</span>
                  </div>
                  {MOCK_FILES.map((file, idx) => (
                    <button
                      key={file.name}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`flex items-center gap-2 w-full text-left px-2 py-2 rounded-none transition-all text-xs font-mono uppercase tracking-wide ${
                        selectedFileIndex === idx
                          ? 'bg-neutral-800 text-white font-black border-l-2 border-white pl-1.5'
                          : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      <FileCode size={12} className={selectedFileIndex === idx ? 'text-white' : 'text-neutral-600'} />
                      <span>{file.name}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-neutral-800 mt-6 pt-4 space-y-2">
                  <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-3">
                    Trigger Event
                  </div>
                  <button
                    onClick={handleRunCommand}
                    disabled={isExecuting}
                    className="flex items-center gap-1.5 w-full bg-[#1a1a1a] hover:bg-white text-white hover:text-black px-3 py-2.5 rounded-none text-xs uppercase font-mono tracking-wider border border-neutral-700 hover:border-white transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Play size={10} className={isExecuting ? 'animate-spin' : ''} />
                    <span>Run CLI Script</span>
                  </button>
                </div>
              </div>

              {/* Main Code View Area */}
              <div className="p-4 md:col-span-3 flex flex-col justify-between bg-[#191919] relative">
                
                {/* Floating buttons in code view */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="p-1 px-3.5 rounded-none bg-black border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Copy code"
                  >
                    {showCopied ? <CheckCircle size={10} className="text-green-500" /> : <Copy size={10} />}
                    <span>{showCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[220px] scrollbar-thin">
                  <pre className="text-xs text-neutral-200 leading-relaxed font-mono whitespace-pre bg-transparent p-0">
                    <code>{shownCode}</code>
                  </pre>
                </div>

                {/* Sub Terminal Exec Output Logs screen */}
                <div className="mt-4 pt-4 border-t border-neutral-800 font-mono text-[11px]">
                  <div className="text-neutral-500 mb-1.5 flex items-center gap-1.5 uppercase font-bold tracking-wider">
                    <span>⚡ Quick Terminal Session Logs:</span>
                    {isExecuting && (
                      <span className="flex items-center gap-1 text-[10px] text-white animate-pulse">
                        <RefreshCw size={8} className="animate-spin" /> executing...
                      </span>
                    )}
                  </div>
                  <div className="bg-black p-3 rounded-none border border-neutral-800 text-neutral-400 space-y-1.5 max-h-[90px] overflow-y-auto font-mono text-[11px]">
                    {commandOutput.length === 0 ? (
                      <div className="text-neutral-600 italic">Enter command simulation above or press 'Execute CLI Script' to query...</div>
                    ) : (
                      commandOutput.map((log, i) => (
                        <div
                          key={i}
                          className={`${
                            log.startsWith('运行中') || log.startsWith('[SUCCESS]')
                              ? 'text-orange-400 font-medium'
                              : 'text-gray-400'
                          }`}
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Console Bottom command text decoration mock */}
      <div className="mt-10 font-mono text-xs text-gray-600 hover:text-orange-500/50 transition-colors pointer-events-none">
        <span>&gt; ls ./features_directory --sorted-by=importance</span>
      </div>
    </section>
  );
}
