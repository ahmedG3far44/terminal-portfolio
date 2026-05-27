import { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Github,
  ArrowRight,
  Globe,
  Menu,
  X,
  ChevronDown,
  Zap,
  Lock,
  Layers,
} from "lucide-react";

const THEMES = [
  { id: "zinc", name: "Monochrome", color: "#e4e4e7", accent: "rgba(228,228,231,0.12)" },
  { id: "green", name: "Matrix", color: "#22c55e", accent: "rgba(34,197,94,0.12)" },
  { id: "purple", name: "Amethyst", color: "#a855f7", accent: "rgba(168,85,247,0.12)" },
  { id: "amber", name: "Retro", color: "#f59e0b", accent: "rgba(245,158,11,0.12)" },
  { id: "cyan", name: "Cyber", color: "#06b6d4", accent: "rgba(6,182,212,0.12)" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

const COMMANDS = [
  { cmd: "help", output: ["Available commands:", "  themes     - Browse available presets", "  sync       - Pull latest GitHub data", "  export     - Generate portfolio link", "  clear      - Clear terminal"] },
  { cmd: "themes", output: ["Available theme presets:", "  monochrome - Clean zinc minimal", "  matrix     - Classic green terminal", "  amethyst   - Purple neon glow", "  retro      - Amber CRT warmth", "  cyber      - Cyan digital console"] },
  { cmd: "sync", output: ["Authenticating with GitHub...", "Fetching repositories...", "Syncing contributions...", "Done. 42 repos, 1,420 contributions synced."] },
  { cmd: "export", output: ["Generating your portfolio link...", "https://ahmed.portfolio.io"] },
  { cmd: "clear", output: [] },
];

const NAV_LINKS = ["features", "showcase", "faq"];

const STEPS = [
  { num: "01", title: "Connect GitHub", desc: "Authorize with OAuth. Your repos, contributions, and READMEs sync automatically.", icon: Github },
  { num: "02", title: "Choose a Theme", desc: "Pick from terminal-inspired presets. Dynamic accent colors applied across every surface.", icon: Terminal },
  { num: "03", title: "Share Your Link", desc: "Your portfolio lives at a custom subdomain, showing your live GitHub presence in real time.", icon: Globe },
];

const FEATURES = [
  { title: "GitHub Sync", desc: "Repos, contributions, READMEs pulled from GitHub automatically. Zero manual updates.", icon: Zap },
  { title: "Bilingual RTL", desc: "Full Arabic and English support with proper RTL layout flipping without breaking.", icon: Globe },
  { title: "Multi-Theme Engine", desc: "Dynamic accent colors stored in MongoDB. Ten presets included. Fully extensible.", icon: Layers },
  { title: "Cloudinary Media", desc: "Drag-and-drop uploads with automatic optimization. Images and video supported.", icon: Lock },
];

const FAQS = [
  { q: "How does GitHub authentication work?", a: "We use GitHub OAuth with read-only scopes. We never store your password. Your repos and contributions are synced securely via our server proxy." },
  { q: "Can I customize the look beyond themes?", a: "Yes. Super admins can create and manage custom themes through the admin panel. Every visual token is stored in the database, not hardcoded." },
  { q: "Does it support Arabic and RTL?", a: "Yes. The entire layout supports both English and Arabic with proper RTL direction. Language toggle is built into the control panel." },
  { q: "Is it mobile responsive?", a: "Every layout adapts to mobile viewports. The terminal widget collapses to a scrollable container, navigation becomes a hamburger menu." },
  { q: "Can I use my own domain?", a: "Yes. The platform supports custom DNS configuration for your portfolio subdomain." },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("zinc");
  const [cmdInput, setCmdInput] = useState("");
  const [logs, setLogs] = useState<{ text: string; type: "in" | "out" | "ok" | "warn" }[]>([
    { text: "ssh dev@portfolio.io", type: "in" },
    { text: "Connected to Terminal Portfolio", type: "out" },
    { text: "Type 'help' to see available commands", type: "out" },
  ]);
  const [typing, setTyping] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    const texts = ["npm create terminal-portfolio", "npx portfolio init ahmed", "gh repo sync portfolio"];
    let i = 0, ci = 0, del = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const full = texts[i];
      if (del) { setTyping(full.substring(0, ci - 1)); ci--; }
      else { setTyping(full.substring(0, ci + 1)); ci++; }
      let speed = del ? 40 : 100;
      if (!del && ci === full.length) { speed = 2000; del = true; }
      else if (del && ci === 0) { del = false; i = (i + 1) % texts.length; speed = 600; }
      t = setTimeout(tick, speed);
    };
    t = setTimeout(tick, 1000);
    return () => clearTimeout(t);
  }, []);

  const exec = (cmd: string) => {
    const c = cmd.trim().toLowerCase();
    if (!c) return;
    if (c === "clear") {
      setLogs([{ text: "Terminal cleared.", type: "out" }]);
      setCmdInput("");
      return;
    }
    const nl = [...logs, { text: `dev@portfolio.io ~$ ${c}`, type: "in" as const }];
    const found = COMMANDS.find((x) => x.cmd === c);
    if (found) {
      found.output.forEach((o) => nl.push({ text: o, type: (o.startsWith("Done") || o.startsWith("https")) ? "ok" as const : "out" as const }));
    } else if (THEMES.map((t) => t.id).includes(c as ThemeId)) {
      setTheme(c as ThemeId);
      nl.push({ text: `Theme set to ${c}`, type: "ok" as const });
    } else {
      nl.push({ text: `Unknown: '${c}'. Try 'help'.`, type: "warn" as const });
    }
    setLogs(nl);
    setCmdInput("");
  };

  const current = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="relative min-h-screen mx-auto bg-[#0a0a0b] text-zinc-100 font-sans overflow-x-hidden selection:bg-white selection:text-zinc-950">
      {/* Grid background */}
      <div
        className="fixed z-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Theme glow orb */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-3xl h-[500px] rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at top, ${current.accent} 0%, transparent 65%)`,
          filter: "blur(40px)",
        }}
      />

      {/* ── NAV ────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(10,10,11,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          padding: scrolled ? "12px 0" : "20px 0",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 font-mono text-sm font-semibold text-zinc-300 hover:text-white transition-colors shrink-0">
            <Terminal className="w-4 h-4 text-zinc-500 shrink-0" />
            <span className="text-zinc-600">~/</span>
            <span>portfolio</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-500">
            {NAV_LINKS.map((link) => (
              <a key={link} href={`#${link}`} className="hover:text-zinc-200 transition-colors capitalize tracking-wide">
                {link}
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="#cta"
              className="px-4 py-2 text-xs font-mono font-semibold bg-white text-zinc-950 hover:bg-zinc-100 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-800/60 bg-[#0a0a0b]/95 backdrop-blur-xl">
            <div className="px-4 py-6 flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-zinc-400 hover:text-white transition-colors capitalize text-base py-1"
                >
                  {link}
                </a>
              ))}
              <div className="h-px bg-zinc-800 my-1" />
              <a
                href="https://github.com"
                className="flex items-center gap-2 px-4 py-3 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
              >
                <Github className="w-4 h-4" /> GitHub Source
              </a>
              <a
                href="#cta"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3.5 bg-white text-zinc-950 text-center font-mono font-semibold text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-center">

            {/* Left: copy */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-7">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-500 font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                v3.0 — GitHub-native
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight text-white leading-[1.06]">
                A portfolio that reads like a{" "}
                <span className="relative inline-block">
                  <span style={{ color: current.color }} className="transition-colors duration-500">terminal.</span>
                </span>
              </h1>

              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-md">
                Connect your GitHub. Pick a theme. Share your link. Terminal Portfolio turns your code into a living, themed showcase.
              </p>

              {/* Typewriter */}
              <div className="font-mono text-sm text-zinc-500 flex items-center gap-2 h-6">
                <span className="text-zinc-600">$</span>
                <span className="text-zinc-300">{typing}</span>
                <span className="w-2 h-4 bg-zinc-300 animate-pulse" />
              </div>

              {/* CTAs */}
              <div className="flex flex-col xs:flex-row sm:flex-row gap-3 mt-1">
                <a
                  href="#cta"
                  className="px-6 py-3 bg-white text-zinc-950 font-semibold text-center rounded-lg hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#showcase"
                  className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-center rounded-lg hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider"
                >
                  View Themes
                </a>
              </div>
            </div>

            {/* Right: terminal widget */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              <div
                className="w-full max-w-xl lg:max-w-full bg-[#0d0d0f] border border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-500"
                style={{ boxShadow: `0 0 80px -20px ${current.accent}, 0 0 0 1px rgba(255,255,255,0.03)` }}
              >
                {/* Terminal titlebar */}
                <div className="bg-zinc-900/80 px-4 py-3 flex items-center justify-between border-b border-zinc-800/50 gap-3">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-rose-500/70" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="text-xs font-mono text-zinc-600 bg-[#0d0d0f] px-3 py-1 rounded flex-1 text-center truncate">
                    ahmed.portfolio.io
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`w-3 h-3 rounded-full border transition-all cursor-pointer ${
                          theme === t.id ? "scale-125 border-zinc-300 ring-1 ring-zinc-500" : "border-zinc-700 hover:border-zinc-500"
                        }`}
                        style={{ backgroundColor: t.color }}
                        title={t.name}
                        aria-label={`Set ${t.name} theme`}
                      />
                    ))}
                  </div>
                </div>

                {/* Terminal body */}
                <div className="p-4 sm:p-5 font-mono text-sm h-[280px] sm:h-[320px] overflow-y-auto bg-[#0d0d0f] flex flex-col gap-3">
                  <div className="flex-1 space-y-1.5">
                    {logs.map((log, i) => (
                      <div key={i} className="leading-relaxed text-xs break-words">
                        {log.type === "in" ? (
                          <>
                            <span className="text-zinc-600">dev@portfolio.io ~$ </span>
                            <span className="text-zinc-200">{log.text.replace("dev@portfolio.io ~$ ", "")}</span>
                          </>
                        ) : log.type === "ok" ? (
                          <span className="text-emerald-400">✔ {log.text}</span>
                        ) : log.type === "warn" ? (
                          <span className="text-amber-400">⚠ {log.text}</span>
                        ) : (
                          <span className="text-zinc-500">{log.text}</span>
                        )}
                      </div>
                    ))}
                    <div ref={logEnd} />
                  </div>

                  {/* Input */}
                  <form
                    onSubmit={(e) => { e.preventDefault(); exec(cmdInput); }}
                    className="border-t border-zinc-800/60 pt-3 flex items-center gap-2 text-xs"
                  >
                    <span className="text-zinc-600 shrink-0">~$</span>
                    <input
                      type="text"
                      value={cmdInput}
                      onChange={(e) => setCmdInput(e.target.value)}
                      placeholder="Try 'help', 'themes', 'sync'..."
                      className="bg-transparent border-none text-zinc-200 placeholder-zinc-700 outline-none flex-1 font-mono text-xs min-w-0"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 hover:text-white transition-colors text-[11px] shrink-0 cursor-pointer"
                    >
                      enter
                    </button>
                  </form>
                </div>

                {/* Terminal statusbar */}
                <div className="bg-zinc-900/50 px-4 py-2 border-t border-zinc-800/50 flex items-center justify-between text-[11px] font-mono text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full transition-colors duration-300" style={{ backgroundColor: current.color }} />
                    <span>Active: <span className="text-zinc-400">{current.name}</span></span>
                  </div>
                  <span className="hidden sm:inline">Interactive Terminal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES / HOW IT WORKS ────────────────────────────────── */}
      <section id="features" className="relative z-10 py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-lg mx-auto mb-16 sm:mb-20">
            <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Three steps to deploy.</h2>
            <p className="text-zinc-500 mt-4 text-sm leading-relaxed">
              Connect, customize, share. No template editing, no hosting setup, no domain configuration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 lg:gap-12 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden sm:block absolute top-8 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent pointer-events-none" />

            {STEPS.map((step) => (
              <div key={step.num} className="flex flex-col gap-4 group relative">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-zinc-800/50 tracking-tight font-mono group-hover:text-zinc-700 transition-colors duration-500">
                    {step.num}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-center shrink-0 group-hover:border-zinc-700 transition-all duration-300"
                    style={{ boxShadow: `0 0 20px -8px ${current.accent}` }}
                  >
                    <step.icon className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="text-zinc-500 text-sm mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE ───────────────────────────────────────────────── */}
      <section id="showcase" className="relative z-10 py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-lg mx-auto mb-12 sm:mb-16">
            <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">Theme preview</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">One codebase. Every aesthetic.</h2>
            <p className="text-zinc-500 mt-4 text-sm leading-relaxed">
              Switch between theme presets instantly. Accent color propagates through borders, glow effects, and UI highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* Theme list */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              <span className="hidden lg:block text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Choose a preset</span>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex-shrink-0 w-40 lg:w-full px-4 py-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    theme === t.id
                      ? "bg-zinc-900/80 border-zinc-700"
                      : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-600 font-mono block">theme/{t.id}</span>
                    <span className="text-sm text-white font-medium truncate block">{t.name}</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200" style={{ backgroundColor: t.color, transform: theme === t.id ? "scale(1.3)" : "scale(1)" }} />
                </button>
              ))}
            </div>

            {/* Preview card */}
            <div className="lg:col-span-8">
              <div
                className="p-5 sm:p-7 lg:p-8 rounded-2xl bg-[#0d0d0f] border border-zinc-800/60 transition-all duration-500 relative overflow-hidden"
                style={{ boxShadow: `0 0 60px -15px ${current.accent}` }}
              >
                {/* Corner glow */}
                <div
                  className="absolute -top-8 -right-8 w-48 h-48 rounded-full blur-[60px] pointer-events-none opacity-30 transition-all duration-500"
                  style={{ background: current.color }}
                />

                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-6 font-mono relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full transition-colors duration-300" style={{ backgroundColor: current.color }} />
                    <span className="text-white text-xs font-semibold">ahmed.io/~</span>
                  </div>
                  <span className="text-[10px] text-zinc-600">Bilingual / RTL Ready</span>
                </div>

                <div className="font-mono space-y-5 relative z-10">
                  <div>
                    <span className="text-zinc-600 text-xs block mb-1.5">~/profile</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Ahmed Jaafar</h3>
                    <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed max-w-lg">
                      Full-stack engineer. Building developer tools and terminal-inspired interfaces.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["TypeScript", "React", "Node.js", "Go", "MongoDB"].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[11px] rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-zinc-900 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500">
                    <span>42 repos synced</span>
                    <span>1,420 contributions</span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE GRID ───────────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-lg mx-auto mb-12 sm:mb-16">
            <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Built for how developers work.</h2>
            <p className="text-zinc-500 mt-4 text-sm leading-relaxed">
              Every feature is informed by the tools and workflows developers already use.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="p-5 sm:p-6 rounded-xl bg-[#0d0d0f] border border-zinc-900 hover:border-zinc-800 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 flex items-center justify-center shrink-0 group-hover:border-zinc-700 transition-colors"
                  >
                    <feat.icon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1.5">{feat.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="relative z-10 py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Questions.</h2>
            <p className="text-zinc-500 mt-4 text-sm leading-relaxed">
              Everything you need to know about Terminal Portfolio.
            </p>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, i) => {
              const open = faqOpen === i;
              return (
                <div
                  key={i}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    open ? "border-zinc-700/60 bg-zinc-900/30" : "border-zinc-900 bg-[#0d0d0f]/60 hover:border-zinc-800"
                  }`}
                >
                  <button
                    onClick={() => setFaqOpen(open ? null : i)}
                    className="w-full px-5 py-4 sm:py-5 text-left flex items-center justify-between gap-4 text-white font-medium hover:bg-zinc-900/20 transition-colors cursor-pointer"
                  >
                    <span className="text-sm leading-snug">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-zinc-800/60 px-5 py-4 text-zinc-400 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section id="cta" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative rounded-2xl border border-zinc-800/50 bg-[#0d0d0f]/90 overflow-hidden px-6 py-14 sm:px-10 sm:py-16 md:px-16 md:py-20 text-center"
            style={{ boxShadow: `0 0 100px -30px ${current.accent}` }}
          >
            {/* Subtle interior glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 transition-all duration-500"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${current.color} 0%, transparent 60%)`,
                filter: "blur(40px)",
              }}
            />

            <div className="max-w-lg mx-auto space-y-5 relative z-10">
              <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Ready to ship?</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Deploy your portfolio in minutes.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                No templates. No hosting. Just your GitHub and a terminal aesthetic.
              </p>
              <div className="flex flex-col xs:flex-row sm:flex-row gap-3 justify-center pt-2">
                <a
                  href="https://github.com/login/oauth/authorize"
                  className="px-6 py-3 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold rounded-lg hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Github className="w-4 h-4" /> View Source
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-zinc-900 px-4 sm:px-6 lg:px-8 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">

            {/* Brand */}
            <div className="col-span-2 sm:col-span-1 space-y-4">
              <a href="#" className="flex items-center gap-2 font-mono text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
                <Terminal className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>~/portfolio</span>
              </a>
              <p className="text-zinc-600 leading-relaxed text-xs max-w-xs">
                A terminal-themed portfolio platform. Sync your GitHub presence and deploy in minutes.
              </p>
              <p className="text-zinc-700 font-mono text-[10px]">&copy; 2026 Terminal Portfolio</p>
            </div>

            {/* Footer link columns */}
            {[
              { title: "Product", links: ["Features", "Themes", "FAQ"] },
              { title: "Resources", links: ["Documentation", "GitHub", "API"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security"] },
            ].map((col) => (
              <div key={col.title} className="space-y-3">
                <span className="font-mono text-zinc-500 block tracking-wider font-medium text-[11px] uppercase">
                  {col.title}
                </span>
                <ul className="space-y-2.5 text-xs text-zinc-600">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href={link === "GitHub" ? "https://github.com" : "#"}
                        className="hover:text-zinc-300 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}