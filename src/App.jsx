import { useEffect, useState } from 'react';
import {
  PROFILE,
  EXPERIENCE,
  EDUCATION,
  SKILLS,
  CERTIFICATIONS,
  ACTIVITIES,
  LANGUAGES,
} from './data/profile.js';
import { PROJECTS } from './data/projects.js';
import { SKILL_ICONS, iconUrl } from './data/icons.js';

const NAV = [
  ['about', 'About'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
];

const ROLES = ['Security Operations', 'Vulnerability Assessment', 'Security Automation', 'Cloud & Infra Ops'];

const STATS = [
  ['3.47', 'CGPA, MMU'],
  ['3x', "Dean's List"],
  ['Winner', 'Best Project Award (Cybersecurity)'],
  ['24/7', 'Service ops internship'],
];

const FILTERS = [
  ['all', 'All'],
  ['security', 'Security'],
  ['web', 'Web / Full-stack'],
  ['app', 'Apps & Tools'],
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="role" key={i}>
      {ROLES[i]}
    </span>
  );
}

function spotlight(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 12L12 4M12 4H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SkillChip({ name, icons }) {
  const entry = SKILL_ICONS[name];
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!entry) return undefined;
    const img = new Image();
    img.onload = () => setOk(true);
    img.onerror = () => setOk(false);
    img.src = iconUrl(entry[0]);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [entry]);

  if (!icons) return <span className="chip">{name}</span>;
  return (
    <span className="chip withico">
      {entry && ok ? (
        <i
          className="ico"
          style={{
            background: entry[1] ? `#${entry[1]}` : 'var(--text)',
            WebkitMaskImage: `url(${iconUrl(entry[0])})`,
            maskImage: `url(${iconUrl(entry[0])})`,
          }}
        />
      ) : (
        <i className="ico letter">{name[0]}</i>
      )}
      {name}
    </span>
  );
}

function ProjectCard({ p, big }) {
  const Tag = p.url ? 'a' : 'div';
  const link = p.url ? { href: p.url, target: '_blank', rel: 'noreferrer' } : {};
  return (
    <Tag className={`pcard reveal${big ? ' big' : ''}`} onMouseMove={spotlight} {...link}>
      <div className="pcard-top">
        <h3>{p.name}</h3>
        {p.url ? (
          <span className="ext">
            Code <Arrow />
          </span>
        ) : (
          <span className="ext dim">Private</span>
        )}
      </div>
      <p className="tagline">{p.tagline}</p>
      <ul>
        {(big ? p.points : p.points.slice(0, 1)).map((pt) => (
          <li key={pt}>{pt}</li>
        ))}
      </ul>
      <div className="chips">
        {p.stack.map((s) => (
          <span key={s} className="chip">{s}</span>
        ))}
      </div>
    </Tag>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  const [filter, setFilter] = useState('all');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useReveal();

  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured && (filter === 'all' || p.category === filter));

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap nav-in">
          <a href="#top" className="brand">
            <span className="logo">J</span> Jerry Rao
          </a>
          <nav>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
            <button
              className="icon-btn"
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero wrap">
          <div className="glow" aria-hidden="true" />
          <p className="eyebrow">
            <span className="dot" /> Open to Security Operations roles
          </p>
          <h1>
            Hi, I'm Jerry.
            <br />
            I build &amp; break things for <span className="grad">security</span>.
          </h1>
          <p className="sub">
            Final-year Cybersecurity student at MMU. Currently focused on <RotatingRole />
          </p>
          <div className="cta">
            <a className="btn primary" href={PROFILE.resume} target="_blank" rel="noreferrer">
              View resume <Arrow />
            </a>
            <a className="btn" href="#projects">See projects</a>
            <a className="btn ghost" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
            <a className="btn ghost" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <div className="stats">
            {STATS.map(([n, l]) => (
              <div key={l} className="stat">
                <b>{n}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="wrap block">
          <h2 className="reveal"><span>01</span> About</h2>
          <div className="about reveal">
            <p>{PROFILE.summary}</p>
            <div className="facts">
              <div><span>Location</span>{PROFILE.location}</div>
              <div><span>Languages</span>{LANGUAGES.replaceAll(' | ', ', ')}</div>
              <div><span>Education</span>{EDUCATION.degree}, {EDUCATION.school}</div>
            </div>
          </div>
        </section>

        <section id="experience" className="wrap block">
          <h2 className="reveal"><span>02</span> Experience &amp; Education</h2>
          <div className="timeline">
            {EXPERIENCE.map((e) => (
              <article key={e.role} className="tl reveal">
                <div className="tl-head">
                  <h3>{e.role}</h3>
                  <span className="when">{e.period}</span>
                </div>
                <p className="org">{e.org}</p>
                <ul>
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </article>
            ))}
            <article className="tl reveal">
              <div className="tl-head">
                <h3>{EDUCATION.degree}</h3>
                <span className="when">{EDUCATION.period}</span>
              </div>
              <p className="org">{EDUCATION.school} &middot; CGPA {EDUCATION.cgpa}</p>
              <ul>
                {EDUCATION.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="projects" className="wrap block">
          <h2 className="reveal"><span>03</span> Projects</h2>
          <p className="lead reveal">Featured work, then everything else I've built.</p>
          <div className="bento">
            {featured.map((p) => (
              <ProjectCard key={p.name} p={p} big />
            ))}
          </div>

          <div className="filters reveal">
            {FILTERS.map(([key, label]) => (
              <button
                key={key}
                className={`pill${filter === key ? ' on' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid3">
            {rest.map((p) => (
              <ProjectCard key={p.name} p={p} />
            ))}
          </div>
        </section>

        <section id="skills" className="wrap block">
          <h2 className="reveal"><span>04</span> Skills &amp; Credentials</h2>
          <div className="skills">
            {SKILLS.map(([label, value]) => (
              <div key={label} className="skill reveal">
                <h4>{label}</h4>
                <div className="chips">
                  {value.split(', ').map((s) => (
                    <SkillChip key={s} name={s} icons={label !== 'Security domains'} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="two">
            <div className="panel reveal">
              <h4>Certifications &amp; courses</h4>
              <ul>
                {CERTIFICATIONS.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="panel reveal">
              <h4>Community</h4>
              <ul>
                {ACTIVITIES.map((a) => (
                  <li key={a.title + a.when}>
                    <b>{a.title}</b> <span className="when">{a.when}</span>
                    <br />
                    {a.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="wrap block">
          <div className="contact reveal">
            <h2>Let's talk.</h2>
            <p>
              I'm looking for Security Operations and cybersecurity analyst opportunities. The fastest way to reach me
              is email.
            </p>
            <a className="btn primary lg" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <div className="links">
              <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
              <a href={PROFILE.resume} target="_blank" rel="noreferrer">Resume <Arrow /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot wrap">
        <span>&copy; {new Date().getFullYear()} {PROFILE.name}</span>
        <span>{PROFILE.location}</span>
      </footer>
    </>
  );
}
