'use client'

import { useState, useEffect, useRef } from 'react'

// ── DATA ────────────────────────────────────────────────────────────────────

const ROLES = [
  'Software Engineer',
  'Backend Developer',
  'Full-Stack Developer',
  'Systems Builder',
  'Open Source Contributor',
]

const SKILLS = {
  Languages: [
    { name: 'Python', level: 95 },
    { name: 'JavaScript / TypeScript', level: 90 },
    { name: 'Java', level: 82 },
    { name: 'C / C++', level: 78 },
    { name: 'SQL', level: 88 },
    { name: 'Bash / Shell', level: 75 },
  ],
  'Frontend': [
    { name: 'React / Next.js', level: 92 },
    { name: 'HTML / CSS', level: 88 },
    { name: 'Tailwind CSS', level: 85 },
    { name: 'REST / GraphQL', level: 88 },
  ],
  'Backend & DB': [
    { name: 'Node.js / Express', level: 87 },
    { name: 'FastAPI / Flask', level: 90 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'MongoDB / Redis', level: 80 },
  ],
  'Cloud & DevOps': [
    { name: 'AWS (EC2, S3, Lambda)', level: 78 },
    { name: 'Docker / Kubernetes', level: 80 },
    { name: 'Git / GitHub Actions', level: 95 },
    { name: 'CI/CD Pipelines', level: 78 },
  ],
}

const PROJECTS = [
  {
    name: 'DistribuTrace',
    emoji: '🔭',
    description:
      'Distributed tracing system for microservices. Custom context-propagation protocol with sub-1ms overhead, handling 10k+ req/s. Includes a real-time flame-graph dashboard.',
    tech: ['Python', 'gRPC', 'Kafka', 'ClickHouse', 'Docker', 'React'],
    metrics: '10k+ req/s',
    github: 'https://github.com/patnia',
    demo: '#',
  },
  {
    name: 'NeuralMarket',
    emoji: '📈',
    description:
      'Algorithmic trading engine using LSTM + reinforcement learning for real-time signal generation. Full backtesting framework across 5+ years of market data.',
    tech: ['Python', 'PyTorch', 'FastAPI', 'Redis', 'WebSocket', 'Pandas'],
    metrics: '+23% backtest ROI',
    github: 'https://github.com/patnia',
    demo: '#',
  },
  {
    name: 'CollabFlow',
    emoji: '⚡',
    description:
      'Real-time collaborative code editor with live cursors, operational transforms for conflict resolution, syntax highlighting for 30+ languages, and session recording.',
    tech: ['Next.js', 'Node.js', 'Socket.io', 'MongoDB', 'AWS S3'],
    metrics: '500+ active users',
    github: 'https://github.com/patnia',
    demo: '#',
  },
  {
    name: 'APIForge',
    emoji: '🛠',
    description:
      'CLI + web tool auto-generating type-safe REST API clients, documentation, and mock servers from OpenAPI 3.x specs. Supports TypeScript, Python, Go output.',
    tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'OpenAPI'],
    metrics: '2k+ GitHub stars',
    github: 'https://github.com/patnia',
    demo: '#',
  },
]

const EXPERIENCE = [
  {
    role: 'Software Engineering Intern',
    company: 'Palo Alto Networks',
    date: 'Jun 2024 – Sep 2024',
    location: 'Santa Clara, CA',
    bullets: [
      'Built Python microservices processing 1M+ security events/day using FastAPI and Kafka',
      'Reduced P99 API latency by 42% via query optimization, connection pooling, and Redis caching',
      'Shipped CI/CD pipeline with GitHub Actions + Docker that cut deploy cycle from 45 min → 8 min',
      'Implemented distributed rate-limiting middleware adopted across 4 internal teams',
    ],
    tech: ['Python', 'FastAPI', 'Kafka', 'Redis', 'Docker', 'PostgreSQL'],
  },
  {
    role: 'Full-Stack Developer Intern',
    company: 'Stealth Startup',
    date: 'Jan 2024 – May 2024',
    location: 'Remote',
    bullets: [
      'Built React dashboard achieving 97 Lighthouse performance score with dynamic data virtualization',
      'Designed Node.js REST API with JWT auth, RBAC, and rate limiting — 99.98% uptime',
      'Integrated Stripe and Plaid APIs powering $80k+ in monthly transaction volume',
      'Wrote comprehensive test suite (Jest + Cypress) raising coverage from 34% → 91%',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe', 'Cypress'],
  },
  {
    role: 'Undergraduate Research Assistant',
    company: 'UCSB HCI Lab',
    date: 'Sep 2023 – Dec 2023',
    location: 'Santa Barbara, CA',
    bullets: [
      'Built data collection pipeline aggregating 500k+ user interaction events for HCI research',
      'Developed visualizations in D3.js for research paper published in CHI 2024',
      "Maintained lab's open-source toolkit with 800+ GitHub stars",
    ],
    tech: ['Python', 'JavaScript', 'D3.js', 'PostgreSQL', 'React'],
  },
]

// ── BOOT SEQUENCE ───────────────────────────────────────────────────────────

const BOOT = [
  '> Initializing portfolio.exe...',
  '> Loading experience modules... [OK]',
  '> Mounting skill trees......... [OK]',
  '> Connecting to project repo... [OK]',
  '> All systems operational.',
  '',
  "  Welcome to Aadi Patni's portfolio.",
]

// ── COMPONENT ───────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [typedRole, setTypedRole] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [skillsVisible, setSkillsVisible] = useState(false)
  const [activeSkillCat, setActiveSkillCat] = useState('Languages')
  const [openProject, setOpenProject] = useState<number | null>(null)
  const [bootLines, setBootLines] = useState<string[]>([BOOT[0]])
  const [bootDone, setBootDone] = useState(false)
  const skillsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let i = 1
    const interval = setInterval(() => {
      if (i < BOOT.length) {
        setBootLines(prev => [...prev, BOOT[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setBootDone(true), 600)
      }
    }, 220)
    return () => clearInterval(interval)
  }, [])

  // Typewriter for roles
  useEffect(() => {
    if (!bootDone) return
    const currentRole = ROLES[roleIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedRole(currentRole.slice(0, charIndex + 1))
        if (charIndex + 1 === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2000)
          return
        }
        setCharIndex(c => c + 1)
      } else {
        setTypedRole(currentRole.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setIsDeleting(false)
          setRoleIndex(r => (r + 1) % ROLES.length)
        }
        setCharIndex(c => c - 1)
      }
    }, isDeleting ? 45 : 95)
    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, roleIndex, bootDone])

  // Intersection observer for skill bars
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setSkillsVisible(true) },
      { threshold: 0.15 }
    )
    if (skillsRef.current) observer.observe(skillsRef.current)
    return () => observer.disconnect()
  }, [])

  const NAV_ITEMS = ['about', 'skills', 'experience', 'projects', 'contact']

  if (!bootDone) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-6">
        <div className="max-w-xl w-full">
          <div className="border border-green-900 bg-black/50 p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-green-900 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-green-800 text-xs ml-2">terminal — portfolio.exe</span>
            </div>
            {bootLines.map((line, i) => (
              <div
                key={i}
                className={`text-sm leading-8 ${
                  line.includes('[OK]') ? 'text-green-400' :
                  line.includes('Welcome') ? 'text-white font-bold text-base' :
                  'text-green-500'
                }`}
              >
                {line}
              </div>
            ))}
            <span className="cursor" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] grid-bg">

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full bg-[#030712]/95 backdrop-blur-sm border-b border-green-950 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-green-400 font-bold text-sm glow">
            <span className="text-green-700">AP</span>@portfolio<span className="text-green-700">:~$</span>
            <span className="cursor ml-1" />
          </span>
          <div className="hidden md:flex gap-8 text-xs">
            {NAV_ITEMS.map(s => (
              <a
                key={s}
                href={`#${s}`}
                className="text-green-700 hover:text-green-400 transition-colors uppercase tracking-widest hover:glow"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-16 relative">
        {/* Corner brackets */}
        <div className="absolute top-24 left-8 text-green-900 text-xs hidden lg:block">
          <div>╔══════════════════╗</div>
          <div>║  SYSTEM ONLINE  ║</div>
          <div>╚══════════════════╝</div>
        </div>

        <div className="text-center fade-in-up">
          <div className="text-green-700 text-xs mb-6 tracking-[0.3em] uppercase">
            {'// Loading user profile...'}
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-2 glitch">
            <span className="text-white">Aadi</span>{' '}
            <span className="text-green-400 glow">Patni</span>
          </h1>
          <div className="text-xl md:text-2xl text-green-300 mb-3 h-9 flex items-center justify-center gap-1">
            <span className="text-green-700">{'>'}</span>
            <span>{typedRole}</span>
            <span className="cursor" />
          </div>
          <p className="text-green-700 text-sm max-w-md mx-auto mb-10 leading-relaxed">
            CS @ UC Santa Barbara · Building systems that scale · Open source enthusiast
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#projects"
              className="border border-green-500 text-green-400 px-8 py-3 text-xs tracking-widest uppercase
                         hover:bg-green-400 hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
            >
              ./view-projects
            </a>
            <a
              href="#contact"
              className="bg-green-400 text-black px-8 py-3 text-xs font-bold tracking-widest uppercase
                         hover:bg-green-300 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
            >
              ping --me
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-green-800 text-xs animate-bounce">
            ▼ scroll
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 px-6 border-t border-green-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-green-600 text-sm mb-8">
            <span className="text-green-400">$</span> cat whoami.txt
          </div>
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-3">
              <div className="border border-green-900 bg-black/30 p-6 rounded-sm mb-6">
                <div className="flex items-center gap-2 mb-4 text-xs text-green-800 border-b border-green-950 pb-3">
                  <span className="text-green-600">whoami.txt</span>
                  <span className="ml-auto">UTF-8</span>
                </div>
                <p className="text-green-300 leading-8 text-sm mb-4">
                  I'm a Computer Science student at <span className="text-green-400">UC Santa Barbara</span> obsessed with
                  building software that performs at scale. My focus is backend engineering, distributed systems,
                  and developer tooling — the invisible infrastructure that makes great products possible.
                </p>
                <p className="text-green-300 leading-8 text-sm">
                  I think deeply about system design, write tests obsessively, and believe the best code
                  is the code you never have to debug at 2 AM. Currently looking for
                  <span className="text-green-400"> Summer 2025 SWE internships</span>.
                </p>
              </div>
              <div className="text-green-700 text-xs">
                <span className="text-green-500">education:</span> UC Santa Barbara · B.S. Computer Science · Expected 2027<br />
                <span className="text-green-500">gpa:</span> 3.8/4.0 · Dean's List<br />
                <span className="text-green-500">interests:</span> distributed systems · compilers · open source · hackathons
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              {[
                { v: '10+', l: 'Projects', icon: '🛠' },
                { v: '3', l: 'Internships', icon: '💼' },
                { v: '15+', l: 'Technologies', icon: '⚡' },
                { v: '2k+', l: 'GitHub Stars', icon: '⭐' },
              ].map(s => (
                <div
                  key={s.l}
                  className="border border-green-900 bg-black/40 p-5 text-center terminal-card hover:border-green-700"
                >
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-3xl font-black text-green-400 glow">{s.v}</div>
                  <div className="text-green-800 text-xs mt-1 tracking-widest uppercase">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="py-24 px-6 border-t border-green-950" ref={skillsRef}>
        <div className="max-w-5xl mx-auto">
          <div className="text-green-600 text-sm mb-8">
            <span className="text-green-400">$</span> ls -la skills/ | sort
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(SKILLS).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveSkillCat(cat)}
                className={`text-xs px-4 py-2 border tracking-widest uppercase transition-all ${
                  activeSkillCat === cat
                    ? 'border-green-400 text-green-400 bg-green-400/10'
                    : 'border-green-900 text-green-700 hover:border-green-700 hover:text-green-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="border border-green-900 bg-black/40 p-6 rounded-sm">
            <div className="text-green-800 text-xs mb-6 border-b border-green-950 pb-4">
              {'// '}{activeSkillCat} — proficiency levels
            </div>
            {SKILLS[activeSkillCat as keyof typeof SKILLS].map(skill => (
              <div key={skill.name} className="mb-5 last:mb-0">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-green-300">{skill.name}</span>
                  <span className="text-green-700">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-green-950 rounded-full overflow-hidden">
                  <div
                    className="skill-bar h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full shadow-[0_0_6px_rgba(0,255,65,0.4)]"
                    style={{ width: skillsVisible ? `${skill.level}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tech bubbles */}
          <div className="mt-8 flex flex-wrap gap-2">
            {['React', 'Next.js', 'Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Kafka', 'gRPC', 'Git', 'Linux'].map(t => (
              <span
                key={t}
                className="text-xs border border-green-900 text-green-700 px-3 py-1
                           hover:border-green-600 hover:text-green-400 transition-all cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="py-24 px-6 border-t border-green-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-green-600 text-sm mb-8">
            <span className="text-green-400">$</span> cat experience.log
          </div>

          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-green-400 via-green-800 to-transparent" />

            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="relative pl-12 mb-8 last:mb-0">
                <div className="absolute left-2 top-5 w-4 h-4 border-2 border-green-400 bg-[#030712] rotate-45 shadow-[0_0_8px_rgba(0,255,65,0.5)]" />

                <div className="terminal-card border border-green-900 bg-black/40 p-6 rounded-sm hover:border-green-700">
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-bold text-base">{exp.role}</h3>
                      <p className="text-green-400 text-sm">{exp.company}</p>
                      <p className="text-green-800 text-xs">{exp.location}</p>
                    </div>
                    <span className="text-green-800 text-xs border border-green-950 px-3 py-1.5 mt-1">
                      {exp.date}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-green-600 text-sm flex gap-3 leading-relaxed">
                        <span className="text-green-500 flex-shrink-0 mt-0.5">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-green-950">
                    {exp.tech.map(t => (
                      <span key={t} className="text-xs border border-green-950 text-green-800 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="py-24 px-6 border-t border-green-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-green-600 text-sm mb-8">
            <span className="text-green-400">$</span> ls projects/ --sort=impact
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {PROJECTS.map((p, i) => (
              <div
                key={i}
                className="terminal-card border border-green-900 bg-black/40 p-6 rounded-sm cursor-pointer"
                onClick={() => setOpenProject(openProject === i ? null : i)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.emoji}</span>
                    <h3 className="text-white font-bold text-base">{p.name}</h3>
                  </div>
                  <span className="text-green-400 text-xs border border-green-800 bg-green-400/5 px-2 py-1 font-bold whitespace-nowrap">
                    {p.metrics}
                  </span>
                </div>

                <p className="text-green-700 text-xs leading-relaxed mb-4">{p.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tech.map(t => (
                    <span key={t} className="text-xs bg-green-950/50 text-green-600 px-2 py-0.5 border border-green-950">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-green-950">
                  <div className="flex gap-4 text-xs">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-green-700 hover:text-green-400 transition-colors"
                    >
                      [ GitHub ]
                    </a>
                    <a
                      href={p.demo}
                      onClick={e => e.stopPropagation()}
                      className="text-green-700 hover:text-green-400 transition-colors"
                    >
                      [ Live Demo ]
                    </a>
                  </div>
                  <span className="text-green-900 text-xs">
                    {openProject === i ? '▲ less' : '▼ more'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-6 border-t border-green-950">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-green-600 text-sm mb-8">
            <span className="text-green-400">$</span> ping aadi --wait
          </div>

          <div className="border border-green-900 bg-black/40 p-10 rounded-sm">
            <div className="text-green-700 text-xs mb-6 text-left">
              <div>{'// Establishing connection...'}</div>
              <div>{'// Status: OPEN FOR OPPORTUNITIES'}</div>
            </div>

            <h2 className="text-3xl font-black text-white mb-3 glow">Let's Build Something</h2>
            <p className="text-green-700 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
              Open to SWE internships (Summer 2025), research collabs, and interesting systems problems.
              Response time: &lt; 24h.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'GitHub', href: 'https://github.com/patnia', icon: '⌥' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/patniaadi', icon: '⌘' },
                { label: 'Email', href: 'mailto:apatni@ucsb.edu', icon: '→' },
                { label: 'Resume', href: '#', icon: '↓' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-green-800 text-green-500 px-6 py-3 text-xs tracking-widest uppercase
                             hover:border-green-400 hover:text-green-400 hover:bg-green-400/5
                             transition-all duration-300 flex items-center gap-2"
                >
                  <span className="text-green-700">{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-green-950 py-6 text-center">
        <p className="text-green-900 text-xs">
          Aadi Patni © 2025 · Built with Next.js + Tailwind · Deployed on Vercel
        </p>
      </footer>
    </div>
  )
}
