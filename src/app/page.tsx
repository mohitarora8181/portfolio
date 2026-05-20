import Link from "next/link";
import {
  getAppShowcases,
  getExperiencePeriod,
  getFeaturedProjects,
  getPortfolioData,
  getProjectDate,
  getSkillGroups,
} from "@/src/services/portfolioData";

const data = getPortfolioData();
const skillGroups = getSkillGroups();
const appShowcases = getAppShowcases();
const featuredProjects = getFeaturedProjects();
const education = data.education[0];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#171717]">
      <section className="border-b border-black/10 bg-[#fafaf7]">
        <div className="mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col justify-between px-5 py-6 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src={data.meta.avatar}
                alt={data.meta.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-black/10"
              />
              <span className="text-sm font-semibold tracking-wide">{data.meta.name}</span>
            </Link>
            <div className="hidden items-center gap-2 text-sm font-medium text-black/60 sm:flex">
              <a href={data.meta.links.github} target="_blank" className="rounded-full px-3 py-2 hover:bg-black hover:text-white">
                GitHub
              </a>
              <a href={data.meta.links.linkedin} target="_blank" className="rounded-full px-3 py-2 hover:bg-black hover:text-white">
                LinkedIn
              </a>
              <a href={data.meta.resume_url} target="_blank" className="rounded-full px-3 py-2 hover:bg-black hover:text-white">
                Resume
              </a>
            </div>
          </nav>

          <div className="grid items-end gap-10 py-12 lg:grid-cols-[1fr_460px]">
            <div>
              <p className="mb-5 w-fit rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black/70">
                Portfolio data rendered through daily-use app interfaces
              </p>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] sm:text-7xl lg:text-8xl">
                {data.meta.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold text-black/80">{data.meta.tagline}</p>
              <p className="mt-6 max-w-2xl text-base leading-7 text-black/65 sm:text-lg">
                This portfolio uses one structured JSON profile as the source of truth. The same data becomes a
                LinkedIn feed, WhatsApp conversations, Spotify playlists, YouTube cards, and a Google Meet room.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#apps" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/80">
                  Explore app clones
                </a>
                <a href={`mailto:${data.meta.email}`} className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold hover:border-black">
                  {data.meta.email}
                </a>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[8px] border border-black/10 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                  <img src={data.meta.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold">{data.meta.name}</p>
                    <p className="text-sm text-black/55">{education.degree}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                  <span className="rounded-[8px] bg-[#f4f2ee] p-3">
                    <b className="block text-xl">{data.experience.length}</b>
                    roles
                  </span>
                  <span className="rounded-[8px] bg-black p-3 text-white">
                    <b className="block text-xl">{data.projects.length}</b>
                    projects
                  </span>
                  <span className="rounded-[8px] bg-[#e8f0fe] p-3">
                    <b className="block text-xl">{education.cgpa}</b>
                    CGPA
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[8px] bg-[#00a884] p-4 text-white">
                  <p className="text-sm font-semibold">{data.meta.phone}</p>
                  <p className="mt-10 text-sm font-semibold">Contact-ready profile</p>
                </div>
                <div className="rounded-[8px] bg-[#121212] p-4 text-white">
                  <p className="text-sm font-semibold">{skillGroups.length} skill groups</p>
                  <p className="mt-10 text-sm font-semibold">Mapped into app UIs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="apps" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">UI clone lab</p>
            <h2 className="mt-2 text-3xl font-black sm:text-5xl">One JSON, five app metaphors</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-black/60">
            Every clone reads the same profile structure through the portfolio data service.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {appShowcases.map((app) => (
            <Link
              key={app.name}
              href={app.href}
              className="group flex min-h-[320px] flex-col justify-between rounded-[8px] border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                <div className={`mb-5 h-24 rounded-[8px] ${app.theme} p-3`}>
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-white/90" />
                    <span className="h-3 w-3 rounded-full bg-white/60" />
                    <span className="h-3 w-3 rounded-full bg-white/40" />
                  </div>
                  <div className="mt-8 h-2 w-2/3 rounded-full bg-white/80" />
                  <div className="mt-2 h-2 w-1/2 rounded-full bg-white/50" />
                </div>
                <h3 className="text-xl font-black">{app.name}</h3>
                <p className="mt-3 text-sm leading-6 text-black/62">{app.description}</p>
              </div>
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {app.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-black/[0.06] px-3 py-1 text-xs font-semibold text-black/65">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm font-bold text-black group-hover:underline">Open {app.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Stack</p>
            <h2 className="mt-2 text-3xl font-black sm:text-5xl">Skills from the JSON structure</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.label} className="rounded-[8px] border border-black/10 bg-[#fafaf7] p-5">
                <h3 className="font-black">{group.label}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span key={skill} className="rounded-full bg-white px-3 py-1 text-sm text-black/70 ring-1 ring-black/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Experience</p>
          <div className="mt-5 grid gap-3">
            {data.experience.map((item) => (
              <article key={item.id} className="rounded-[8px] border border-black/10 bg-white p-5">
                <p className="text-sm font-semibold text-black/50">{getExperiencePeriod(item)}</p>
                <h3 className="mt-1 text-xl font-black">{item.role}</h3>
                <p className="text-sm font-semibold text-black/65">{item.company}</p>
                <p className="mt-3 text-sm leading-6 text-black/60">{item.highlights[0]}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Featured Projects</p>
          <div className="mt-5 grid gap-3">
            {featuredProjects.map((project) => (
              <article key={project.id} className="rounded-[8px] border border-black/10 bg-[#171717] p-5 text-white">
                <p className="text-sm font-semibold text-white/45">{getProjectDate(project)} | {project.status}</p>
                <h3 className="mt-1 text-xl font-black">{project.name}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{project.tagline}</p>
              </article>
            ))}
            <div className="rounded-[8px] border border-black/10 bg-[#e8f0fe] p-5">
              <h3 className="text-xl font-black">Achievements</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.achievements.map((item) => (
                  <span key={item.id} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-black/70">
                    {item.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
