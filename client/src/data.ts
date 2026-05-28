import { PersonaInfo, CustomHeroConfig } from './types';

export const PERSONAS: PersonaInfo[] = [
  {
    id: 'developer',
    name: 'The Developer',
    role: 'Hacker & Engineer',
    description: 'Command line terminal aesthetic, monospaced typography, and direct interactive code visualizations.',
    accentClass: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-500/30',
    themeLabel: 'Terminal Obsidian'
  },
  {
    id: 'designer',
    name: 'The Designer/Creator',
    role: 'Visualist & Artist',
    description: 'Vibrant gradients, organic glassmorphic widgets, and interactive color/shape layout canvas.',
    accentClass: 'from-fuchsia-500 to-violet-600',
    borderColor: 'border-fuchsia-500/30',
    themeLabel: 'Cyber Neon Glass'
  },
  {
    id: 'product-manager',
    name: 'The PM/Founder',
    role: 'Strategist & Builder',
    description: 'Polished charcoal luxury format, custom SVG chart switcher, and live interactive SaaS ROI calculator.',
    accentClass: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    themeLabel: 'Monolithic Corporate Slate'
  },
  {
    id: 'marketer',
    name: 'The Marketer',
    role: 'Growth & Optimization Specialist',
    description: 'Bold geometric shapes, dynamic pricing sliders, and custom conversion popups.',
    accentClass: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/30',
    themeLabel: 'High-Impact Conversion Bold'
  }
];

export const INITIAL_CONFIGS: CustomHeroConfig = {
  developer: {
    commandLine: 'cat ./core/platform/features.json',
    titleFirstPart: 'Full-Stack ',
    titleHighlight: 'Portfolio',
    titleLastPart: ' Platform',
    description: 'A modern, terminal-themed portfolio application with GitHub OAuth, local browser persistence, super admin status management, and real-time GitHub integration all built with TypeScript.',
    primaryCta: 'View My Portfolio',
    secondaryCta: 'Source Code',
    showFiles: true
  },
  designer: {
    badgeText: 'DESIGN CO-PILOT 2.0',
    titleHighlight: 'Interactive Canvas',
    titleNormal: ' for Creative Teams',
    description: 'Brainstorm, layout, and fine-tune your SaaS blueprints inside an ultra-responsive responsive editor. Tweak real-time styles and generate React code instantly.',
    primaryCta: 'Launch Workspace',
    secondaryCta: 'View Gallery',
    activeCanvasColor: '#8b5cf6',
    canvasShape: 'circle'
  },
  'product-manager': {
    metricBadge: 'PRODUCTIVITY HIGHLIGHT',
    titleHighlight: 'Metrics Dashboard',
    titleNormal: ' built for Elite Teams',
    description: 'Trace user retention rates, evaluate daily conversion anomalies, and generate high-fidelity pipeline forecasts on a single customizable screen.',
    primaryCta: 'Request Beta',
    secondaryCta: 'Watch Guided Tour',
    showRoiCalculator: true,
    initialTraffic: 12000,
    initialCvRate: 2.2
  },
  marketer: {
    topBadge: 'GROWTH HUDDLE',
    titleFirstPart: 'Turn Stale Leads into ',
    titleHighlight: 'Loyal Customers',
    titleLastPart: ' Instantly',
    description: 'Automated personalizations, smart split testing, and lightning-fast lazy image optimization designed to propel standard conversion metrics.',
    primaryCta: 'Start Scaling Today',
    secondaryCta: 'Read 20+ Case Studies',
    socialProofCount: '15,200+',
    pricingTier: 'pro'
  }
};
