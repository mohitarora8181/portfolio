import { period } from './sections.js'

function Stars({ rating }) {
  return (
    <span className="stars">
      <span className="stars-num">{rating.toFixed(1)}</span>
      <span className="stars-icons">
        {'★'.repeat(Math.round(rating))}
        {'☆'.repeat(5 - Math.round(rating))}
      </span>
    </span>
  )
}

const hideOnError = (e) => { e.currentTarget.style.display = 'none' }

function ImageStrip({ images }) {
  if (!images?.length) return null
  return (
    <div className="image-strip">
      {images.map((img) => (
        <figure key={img.url}>
          <img src={img.url} alt={img.alt} loading="lazy" onError={hideOnError} />
          <figcaption>{img.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function Chips({ items }) {
  return (
    <span className="chips-inline">
      {items.map((t) => <span className="chip" key={t}>{t}</span>)}
    </span>
  )
}

// Small "show on map" button for sub-items that have their own pin
function FlyBtn({ onFlyTo, coords, label }) {
  return (
    <button
      className="fly-btn"
      title={`Directions to ${label}`}
      aria-label={`Directions to ${label}`}
      onClick={() => onFlyTo(coords, 16, label)}
    >
      <svg viewBox="0 0 24 24">
        <path d="M21.7 11.3l-9-9c-.4-.4-1-.4-1.4 0l-9 9c-.4.4-.4 1 0 1.4l9 9c.4.4 1 .4 1.4 0l9-9c.4-.4.4-1 0-1.4zM13 14.5V12h-3v3H8v-4c0-.6.4-1 1-1h4V7.5l3.5 3.5-3.5 3.5z" />
      </svg>
    </button>
  )
}

/* ---------- About ---------- */
function AboutBody({ content }) {
  return (
    <>
      <div className="about-card">
        <img className="about-avatar" src={content.avatar} alt={content.name} onError={hideOnError} />
        <div>
          <h3>{content.name}</h3>
          <p>{content.tagline}</p>
        </div>
      </div>
      <ul className="fact-list">
        <li><span className="fact-icon">✉️</span>{content.email}</li>
        <li><span className="fact-icon">📞</span>{content.phone}</li>
        <li><span className="fact-icon">📍</span>New Delhi, India</li>
      </ul>
      <a className="action-btn action-primary resume-btn" href={content.resume_url} target="_blank" rel="noreferrer">
        📄 View resume
      </a>
    </>
  )
}

/* ---------- Experience ---------- */
function ExperienceBody({ content, onFlyTo }) {
  return (
    <div className="exp-list">
      {content.map((exp) => (
        <article className="exp-card" key={exp.id}>
          <button
            className="exp-head"
            onClick={() => onFlyTo(exp.coords, 13, `${exp.company}, ${exp.place}`)}
            title={`Fly to ${exp.place}`}
          >
            {exp.company_logo && (
              <img className="exp-logo" src={exp.company_logo} alt={exp.company} onError={hideOnError} />
            )}
            <span className="exp-head-text">
              <span className="exp-role">{exp.role}{exp.current && <span className="badge badge-open">Current</span>}</span>
              <span className="exp-company">{exp.company} · {period(exp.start_date, exp.end_date)}</span>
              <span className="exp-place">📍 {exp.place}</span>
            </span>
          </button>
          {exp.progression.map((p) => (
            <div className="exp-progression" key={p.role}>
              ↳ {p.role} · {period(p.start_date, p.end_date)}
            </div>
          ))}
          <Chips items={exp.tech_stack} />
          <ul className="bullet-list">
            {exp.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
          <ImageStrip images={exp.images} />
        </article>
      ))}
      <p className="panel-hint">Tip: click a company to fly there — the route is drawn on the map.</p>
    </div>
  )
}

/* ---------- Projects ---------- */
const LINK_LABELS = { github: '🐙 GitHub', live: '🔗 Live', npm: '📦 npm', demo_video: '🎬 Demo' }

function ProjectsBody({ content, onFlyTo }) {
  return (
    <div className="project-list">
      {content.map((p) => (
        <article className="project-card" key={p.id}>
          <div className="project-top">
            <span className="project-name">
              {p.name}
              {p.featured && <span className="badge badge-featured">★ Featured</span>}
            </span>
            <span className="project-date">{p.date} · {p.status}</span>
            <FlyBtn onFlyTo={onFlyTo} coords={p.coords} label={p.name} />
          </div>
          <p className="project-desc">{p.tagline}</p>
          <Chips items={p.tech_stack} />
          <div className="link-row">
            {Object.entries(p.links).filter(([, url]) => url).map(([kind, url]) => (
              <a key={kind} href={url} target="_blank" rel="noreferrer">{LINK_LABELS[kind] ?? kind}</a>
            ))}
          </div>
          <ImageStrip images={p.images} />
        </article>
      ))}
    </div>
  )
}

/* ---------- Open source ---------- */
function OpenSourceBody({ content, onFlyTo }) {
  return (
    <ul className="oss-list">
      {content.map((o) => (
        <li key={o.id} className="oss-item">
          <div className="oss-main">
            {o.repo_url ? (
              <a href={o.repo_url} target="_blank" rel="noreferrer">
                <span className="oss-name">🐙 {o.name}</span>
                <span className="oss-role">{o.role}</span>
              </a>
            ) : (
              <span className="oss-static">
                <span className="oss-name">🐙 {o.name}</span>
                <span className="oss-role">{o.role}</span>
              </span>
            )}
            <ImageStrip images={o.images} />
          </div>
          <FlyBtn onFlyTo={onFlyTo} coords={o.coords} label={o.name} />
        </li>
      ))}
    </ul>
  )
}

/* ---------- Skills ---------- */
function SkillsBody({ content, onFlyTo }) {
  return (
    <div className="skill-groups">
      {content.map((g) => (
        <div className="skill-group" key={g.id}>
          <h3>
            {g.label}
            <FlyBtn onFlyTo={onFlyTo} coords={g.coords} label={g.label} />
          </h3>
          <div className="chips-inline">
            {g.items.map((item) => <span className="chip" key={item}>{item}</span>)}
          </div>
          <ImageStrip images={g.images} />
        </div>
      ))}
    </div>
  )
}

/* ---------- Education ---------- */
function EducationBody({ content }) {
  return (
    <div className="school-list">
      {content.map((e) => (
        <div className="school" key={e.id}>
          {e.logo && <img className="school-logo" src={e.logo} alt={e.institution} onError={hideOnError} />}
          <div>
            <span className="school-degree">{e.degree}</span>
            <span className="school-name">{e.institution}</span>
            <span className="school-meta">{e.start_year} — {e.end_year} · CGPA {e.cgpa}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- Achievements ---------- */
function AchievementsBody({ content, onFlyTo }) {
  return (
    <div className="ach-list">
      {content.map((a) => (
        <article className="ach-card" key={a.id}>
          <img src={a.image} alt={a.title} loading="lazy" onError={hideOnError} />
          <div className="ach-body">
            <span className="ach-title">
              🏆 {a.title}
              <FlyBtn onFlyTo={onFlyTo} coords={a.coords} label={a.title} />
            </span>
            <span className="ach-meta">{a.issuer} · {a.year}</span>
            {a.description && <p>{a.description}</p>}
          </div>
        </article>
      ))}
    </div>
  )
}

/* ---------- Contact ---------- */
function ContactBody({ content }) {
  const channels = [
    { icon: '✉️', label: content.email, href: `mailto:${content.email}` },
    { icon: '📞', label: content.phone, href: `tel:${content.phone.replace(/\s/g, '')}` },
    { icon: '💼', label: 'LinkedIn', href: content.links.linkedin },
    { icon: '🐙', label: 'GitHub', href: content.links.github },
    { icon: '🧩', label: 'LeetCode', href: content.links.leetcode },
    { icon: '🧠', label: 'GeeksforGeeks', href: content.links.geeksforgeeks },
    { icon: '🌐', label: 'Portfolio', href: content.links.portfolio },
    { icon: '📄', label: 'Resume', href: content.resume_url },
  ]
  return (
    <ul className="contact-list">
      {channels.map((c) => (
        <li key={c.label}>
          <a href={c.href} target="_blank" rel="noreferrer">
            <span className="contact-icon">{c.icon}</span>
            {c.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

const BODIES = {
  about: AboutBody,
  experience: ExperienceBody,
  projects: ProjectsBody,
  open_source: OpenSourceBody,
  skills: SkillsBody,
  education: EducationBody,
  achievements: AchievementsBody,
  contact: ContactBody,
}

export default function DetailPanel({ section, onBack, onFlyTo }) {
  const Body = BODIES[section.type] ?? AboutBody

  return (
    <div className="panel" key={section.id}>
      <div className="detail-hero" style={{ background: `linear-gradient(135deg, ${section.color}, #202124)` }}>
        <button className="back-btn" onClick={onBack} title="Close" aria-label="Close">
          <svg viewBox="0 0 24 24"><path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4L13.4 12z" /></svg>
        </button>
        <div className="detail-hero-emoji">{section.icon}</div>
      </div>

      <div className="detail-head">
        <h2>{section.title}</h2>
        <div className="detail-rating">
          <Stars rating={section.rating} />
          <span className="section-reviews">({section.reviews} reviews)</span>
        </div>
        <div className="detail-sub">
          {section.category} · 📍 {section.location.place}
        </div>
      </div>

      <div className="detail-actions">
        <button
          className="action-btn action-primary"
          onClick={() => onFlyTo(section.location.coords, section.location.zoom, section.location.place)}
        >
          <svg viewBox="0 0 24 24"><path d="M21.7 11.3l-9-9c-.4-.4-1-.4-1.4 0l-9 9c-.4.4-.4 1 0 1.4l9 9c.4.4 1 .4 1.4 0l9-9c.4-.4.4-1 0-1.4zM13 14.5V12h-3v3H8v-4c0-.6.4-1 1-1h4V7.5l3.5 3.5-3.5 3.5z" /></svg>
          Directions
        </button>
      </div>

      <div className="detail-body">
        <Body content={section.content} onFlyTo={onFlyTo} />
      </div>
    </div>
  )
}
