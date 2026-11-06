import { useEffect, useMemo, useState } from 'react';
import {
  PROFILE,
  RECORD,
  EXPERIENCE,
  EDUCATION,
  SKILLS,
  CERTIFICATIONS,
  ACTIVITIES,
} from './data/profile.js';
import { PROJECTS } from './data/projects.js';

const NAV = [
  ['work', 'Work'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
];

const FILTERS = [
  ['all', 'All'],
  ['security', 'Security'],
  ['web', 'Web'],
  ['app', 'Apps & tools'],
  ['public', 'Public code'],
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
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
      { rootMargin: '0px 0px -6% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 12L12 4M12 4H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Status({ status, compact }) {
  const label = status === 'public' ? (compact ? 'Public' : 'Public code') : compact ? 'Private' : 'Private, summary only';
  return (
    <span className={`status ${status}`}>
      <i aria-hidden="true" />
      {label}
    </span>
  );
}

function Work({ p, i }) {
  const showPoints = p.status === 'public' || p.showPoints;
  return (
    <article className="work reveal">
      <div className="work-idx mono">{String(i + 1).padStart(2, '0')}</div>
      <div className="work-main">
        <h3>{p.name}</h3>
        <p className="work-tag">{p.tagline}</p>
        {showPoints ? (
          <ul className="work-points">
            {p.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        ) : (
          <p className="work-glimpse">{p.glimpse}</p>
        )}
        <p className="stack mono">{p.stack.join(' / ')}</p>
        <div className="work-links">
          <Status status={p.status} />
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noreferrer">
              Code <Arrow />
            </a>
          )}
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer">
              Live site <Arrow />
            </a>
          )}
        </div>
      </div>
      {p.shot && (
        <a className="shot" href={p.live} target="_blank" rel="noreferrer" aria-label={`Open ${p.name} live site`}>
          <span className="shot-bar mono">{p.live.replace('https://', '')}</span>
          <img src={p.shot} alt={p.shotAlt} width="1280" height="800" loading="lazy" decoding="async" />
        </a>
      )}
    </article>
  );
}

function Row({ p }) {
  return (
    <li className="row">
      <div className="r-name">
        {p.repo ? (
          <a href={p.repo} target="_blank" rel="noreferrer">
            {p.name} <Arrow />
          </a>
        ) : (
          p.name
        )}
      </div>
      <div className="r-tag">
        {p.tagline}
        {p.glimpse && <span className="r-glimpse">{p.glimpse}</span>}
      </div>
      <div className="r-stack mono">{p.stack.slice(0, 4).join(', ')}</div>
      <div className="r-vis">
        <Status status={p.status} compact />
      </div>
    </li>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
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

  const featured = PROJECTS.filter((p) => p.featured);
  const more = PROJECTS.filter((p) => !p.featured);
  const shown = useMemo(
    () => more.filter((p) => (filter === 'all' ? true : filter === 'public' ? p.status === 'public' : p.category === filter)),
    [more, filter],
  );
  const counts = useMemo(
    () => ({
      pub: PROJECTS.filter((p) => p.status === 'public').length,
      priv: PROJECTS.filter((p) => p.status === 'private').length,
    }),
    [],
  );

  useReveal();

  return (
    <>
      <a className="skip" href="#work">Skip to content</a>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap nav-in">
          <a href="#top" className="brand">
            <span className="brand-name">Jerry Rao</span>
            <span className="brand-handle mono">@{PROFILE.handle}</span>
          </a>
          <nav aria-label="Primary">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="nav-link">{label}</a>
            ))}
            <a className="nav-cta" href={PROFILE.resume} target="_blank" rel="noreferrer">Résumé</a>
            <button
              className="icon-btn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero wrap">
          <div className="hero-main">
            <p className="eyebrow mono">
              <span className="pulse" aria-hidden="true" /> Open to Security Operations roles
            </p>
            <h1>
              I build security tools, and I&rsquo;ve worked the <em>alert queue</em>.
            </h1>
            <p className="hero-sub">
              Final-year Cybersecurity student at MMU. I write vulnerability scanners and security automation, and spent
              a 24/7 service-operations internship monitoring infrastructure, escalating alerts and handling incidents.
            </p>
            <div className="cta">
              <a className="btn primary" href={PROFILE.resume} target="_blank" rel="noreferrer">
                Résumé (PDF) <Arrow />
              </a>
              <a className="btn" href="#work">See the work</a>
            </div>
            <p className="hero-links">
              <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
              <a href={`mailto:${PROFILE.email}`}>Email <Arrow /></a>
            </p>
          </div>
          <aside className="record" aria-label="At a glance">
            <p className="record-h mono">At a glance</p>
            <dl>
              {RECORD.map(([k, v]) => (
                <div key={k}>
                  <dt className="mono">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <section id="work" className="wrap block">
          <header className="sec-head reveal">
            <p className="label mono">01 / Selected work</p>
            <h2>Things I&rsquo;ve built.</h2>
            <p className="sec-sub">
              {counts.pub} projects have public code and {counts.priv} are private. Private ones are summarised only;
              their code isn&rsquo;t published.
            </p>
          </header>
          <div className="works">
            {featured.map((p, i) => (
              <Work key={p.name} p={p} i={i} />
            ))}
          </div>
        </section>

        <section id="projects" className="wrap block">
          <header className="sec-head reveal">
            <p className="label mono">02 / More projects</p>
            <h2>Everything else.</h2>
          </header>
          <div className="filters reveal" role="group" aria-label="Filter projects">
            {FILTERS.map(([key, label]) => (
              <button key={key} className={`pill${filter === key ? ' on' : ''}`} aria-pressed={filter === key} onClick={() => setFilter(key)}>
                {label}
              </button>
            ))}
            <span className="pill-count mono" aria-live="polite">{shown.length} shown</span>
          </div>
          <ul className="rows">
            {shown.map((p) => (
              <Row key={p.name} p={p} />
            ))}
          </ul>
        </section>

        <section id="experience" className="wrap block">
          <header className="sec-head reveal">
            <p className="label mono">03 / Experience and education</p>
            <h2>Where I&rsquo;ve worked and studied.</h2>
          </header>
          <div className="duo">
            {EXPERIENCE.map((e) => (
              <article key={e.role} className="entry reveal">
                <p className="when mono">{e.period}</p>
                <h3>{e.role}</h3>
                <p className="org">{e.org}</p>
                <ul>
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </article>
            ))}
            <article className="entry reveal">
              <p className="when mono">{EDUCATION.period}</p>
              <h3>{EDUCATION.degree}</h3>
              <p className="org">{EDUCATION.school} &middot; CGPA {EDUCATION.cgpa}</p>
              <ul>
                {EDUCATION.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="skills" className="wrap block">
          <header className="sec-head reveal">
            <p className="label mono">04 / Skills and credentials</p>
            <h2>What I work with.</h2>
          </header>
          <dl className="skills reveal">
            {SKILLS.map(([label, value]) => (
              <div key={label}>
                <dt className="mono">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="duo lists">
            <div className="reveal">
              <h3 className="mini">Certifications and courses</h3>
              <ul className="plain">
                {CERTIFICATIONS.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="reveal">
              <h3 className="mini">Community</h3>
              <ul className="plain">
                {ACTIVITIES.map((a) => (
                  <li key={a.title + a.when}>
                    <b>{a.title}</b> <span className="when mono">{a.when}</span>
                    <br />
                    {a.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="wrap block contact">
          <div className="reveal">
            <p className="label mono">05 / Contact</p>
            <h2>Let&rsquo;s talk.</h2>
            <p className="sec-sub">
              I&rsquo;m looking for Security Operations and cybersecurity analyst roles. Email is the fastest way to
              reach me.
            </p>
            <a className="mail" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <p className="hero-links">
              <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
              <a href={PROFILE.resume} target="_blank" rel="noreferrer">Résumé <Arrow /></a>
            </p>
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
