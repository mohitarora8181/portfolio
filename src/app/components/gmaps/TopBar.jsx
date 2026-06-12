import { useMemo, useRef, useState } from 'react'

export default function TopBar({ profile, sections, activeId, onSelect, onSurprise }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const chipsRef = useRef(null)

  // Search index: every section plus its keywords (projects, companies, skills…)
  const index = useMemo(() => {
    const entries = []
    for (const s of sections) {
      entries.push({ key: s.id, label: s.title, sub: s.category, icon: s.icon, section: s })
      for (const kw of s.keywords ?? []) {
        entries.push({ key: `${s.id}:${kw}`, label: kw, sub: `in ${s.title}`, icon: s.icon, section: s })
      }
    }
    return entries
  }, [sections])

  const q = query.trim().toLowerCase()
  const suggestions = q
    ? index.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 7)
    : []

  const choose = (entry) => {
    onSelect(entry.section)
    setQuery('')
  }

  const scrollChips = (dir) => {
    chipsRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' })
  }

  return (
    <header className="topbar">
      {/* Search pill */}
      <div className="search-pill">
        <input
          type="text"
          placeholder={`Search ${profile.firstName}'s portfolio`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && suggestions.length) choose(suggestions[0])
            if (e.key === 'Escape') setQuery('')
          }}
        />
        <button className="pill-btn" title="Search" aria-label="Search">
          <svg viewBox="0 0 24 24">
            <path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
          </svg>
        </button>
        <button
          className="pill-btn pill-btn-directions"
          title="Surprise me — fly somewhere random"
          onClick={onSurprise}
        >
          <svg viewBox="0 0 24 24">
            <path d="M21.7 11.3l-9-9c-.4-.4-1-.4-1.4 0l-9 9c-.4.4-.4 1 0 1.4l9 9c.4.4 1 .4 1.4 0l9-9c.4-.4.4-1 0-1.4zM13 14.5V12h-3v3H8v-4c0-.6.4-1 1-1h4V7.5l3.5 3.5-3.5 3.5z" />
          </svg>
        </button>

        {focused && suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((e) => (
              <li key={e.key}>
                <button onMouseDown={() => choose(e)}>
                  <span className="suggestion-icon">{e.icon}</span>
                  <span className="suggestion-label">{e.label}</span>
                  <span className="suggestion-sub">{e.sub}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Category chips */}
      <div className="chips-wrap">
        <div className="chips" ref={chipsRef}>
          {sections.map((s) => (
            <button
              key={s.id}
              className={`chip-btn ${activeId === s.id ? 'chip-active' : ''}`}
              onClick={() => onSelect(s)}
            >
              <span className="chip-icon">{s.icon}</span>
              {s.title}
            </button>
          ))}
        </div>
        <button className="chip-arrow" onClick={() => scrollChips(1)} title="More" aria-label="Scroll categories">
          <svg viewBox="0 0 24 24"><path d="M9.4 6L8 7.4l4.6 4.6L8 16.6 9.4 18l6-6z" /></svg>
        </button>
      </div>

      {/* Avatar → About */}
      <button
        className="topbar-avatar"
        title={`About ${profile.name}`}
        onClick={() => onSelect(sections.find((s) => s.id === 'about'))}
      >
        <img
          src={profile.avatar}
          alt={profile.name}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement.textContent = '👨‍💻'
          }}
        />
      </button>
    </header>
  )
}
