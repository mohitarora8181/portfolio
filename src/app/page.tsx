import Link from "next/link";
import data from "@/myData.json";

const appShowcases = [
  {
    name: "YouTube",
    href: "/youtube",
    theme: "bg-[#ff0033]",
    description: "Responsive media dashboard with sidebar navigation, search, content grid, and hover states.",
    skills: ["Layout systems", "Responsive nav", "Motion"],
  },
  {
    name: "WhatsApp",
    href: "/whatsapp",
    theme: "bg-[#00a884]",
    description: "Chat product UI with split panes, mobile view switching, contact lists, and active chat state.",
    skills: ["Stateful UI", "Mobile flows", "Messaging UX"],
  },
  {
    name: "Spotify",
    href: "/spotify",
    theme: "bg-[#1ed760]",
    description: "Music app shell with library panels, playback controls, playlist cards, and dark interface polish.",
    skills: ["Dark UI", "Cards", "Microinteractions"],
  },
  {
    name: "LinkedIn",
    href: "/linkedin",
    theme: "bg-[#0a66c2]",
    description: "Professional feed clone with profile widgets, composer, feed cards, and sticky messaging.",
    skills: ["Feed UI", "Profile data", "Desktop density"],
  },
  {
    name: "Google Meet",
    href: "/gmeet",
    theme: "bg-[#fbbc04]",
    description: "Meeting interface with call controls, participant panel, audio detection, and video tile states.",
    skills: ["Realtime APIs", "Controls", "Panels"],
  },
];

const skillGroups = [
  ["Frontend", data.skills.webDevelopment],
  ["Mobile", data.skills.androidDevelopment],
  ["Backend & Data", data.skills.databases],
  ["Cloud & Tools", data.skills.cloudServices],
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#171717]">
      <section className="border-b border-black/10 bg-[#fafaf7]">
        <div className="mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col justify-between px-5 py-6 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src={data.profileImage}
                alt={data.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-black/10"
              />
              <span className="text-sm font-semibold tracking-wide">{data.name}</span>
            </Link>
            <div className="hidden items-center gap-2 text-sm font-medium text-black/60 sm:flex">
              <a href={data.links.github} target="_blank" className="rounded-full px-3 py-2 hover:bg-black hover:text-white">
                GitHub
              </a>
              <a href={data.links.linkedin} target="_blank" className="rounded-full px-3 py-2 hover:bg-black hover:text-white">
                LinkedIn
              </a>
              <a href={`mailto:${data.email}`} className="rounded-full px-3 py-2 hover:bg-black hover:text-white">
                Contact
              </a>
            </div>
          </nav>

          <div className="grid items-end gap-10 py-12 lg:grid-cols-[1fr_460px]">
            <div>
              <p className="mb-5 w-fit rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black/70">
                Frontend portfolio as daily-use web app UI studies
              </p>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] sm:text-7xl lg:text-8xl">
                I rebuild the apps people already know.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-black/65 sm:text-lg">
                This portfolio is a collection of familiar product interfaces, rebuilt in Next.js to show layout judgement,
                responsive behavior, component thinking, animation, and attention to real product details.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#apps" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/80">
                  Explore app clones
                </a>
                <a
                  href={data.links.leetcode}
                  target="_blank"
                  className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold hover:border-black"
                >
                  LeetCode profile
                </a>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[8px] border border-black/10 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#00a884] text-lg font-bold text-white">MA</div>
                  <div>
                    <p className="font-bold">{data.name}</p>
                    <p className="text-sm text-black/55">{data.education.degree}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                  <span className="rounded-[8px] bg-[#f4f2ee] p-3">
                    <b className="block text-xl">{data.experience.length}</b>
                    roles
                  </span>
                  <span className="rounded-[8px] bg-black p-3 text-white">
                    <b className="block text-xl">{appShowcases.length}</b>
                    clones
                  </span>
                  <span className="rounded-[8px] bg-[#e8f0fe] p-3">
                    <b className="block text-xl">{data.education.cgpa}</b>
                    CGPA
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[8px] bg-[#ff0033] p-4 text-white">
                  <div className="mb-10 h-2 w-16 rounded-full bg-white/80" />
                  <p className="text-sm font-semibold">Video grid, nav, search</p>
                </div>
                <div className="rounded-[8px] bg-[#121212] p-4 text-white">
                  <div className="mb-10 h-12 w-12 rounded-[8px] bg-[#1ed760]" />
                  <p className="text-sm font-semibold">Music shell and player</p>
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
            <h2 className="mt-2 text-3xl font-black sm:text-5xl">Daily app interfaces</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-black/60">
            Each route is a hands-on proof of how closely I can study and recreate production-grade interfaces.
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
            <h2 className="mt-2 text-3xl font-black sm:text-5xl">Skills behind the pixels</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {skillGroups.map(([title, skills]) => (
              <div key={title} className="rounded-[8px] border border-black/10 bg-[#fafaf7] p-5">
                <h3 className="font-black">{title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
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
              <article key={`${item.company}-${item.title}`} className="rounded-[8px] border border-black/10 bg-white p-5">
                <p className="text-sm font-semibold text-black/50">{item.duration}</p>
                <h3 className="mt-1 text-xl font-black">{item.title}</h3>
                <p className="text-sm font-semibold text-black/65">{item.company}</p>
                <p className="mt-3 text-sm leading-6 text-black/60">{item.responsibilities[0]}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Projects</p>
          <div className="mt-5 grid gap-3">
            {data.projects.slice(0, 3).map((project) => (
              <article key={project.name} className="rounded-[8px] border border-black/10 bg-[#171717] p-5 text-white">
                <h3 className="text-xl font-black">{project.name}</h3>
                {project.description?.[0] && (
                  <p className="mt-3 text-sm leading-6 text-white/65">{project.description[0]}</p>
                )}
              </article>
            ))}
            <div className="rounded-[8px] border border-black/10 bg-[#e8f0fe] p-5">
              <h3 className="text-xl font-black">Highlights</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.leadershipAndAchievements.map((item) => (
                  <span key={item} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-black/70">
                    {item}
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
