"use client";

import type {
  CSSProperties,
  FormEvent,
  ReactNode,
  RefObject,
} from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getAppShowcases,
  getExperiencePeriod,
  getPortfolioData,
  getSkillGroups,
} from "@/src/services/portfolioData";

type RouteItem = {
  name: string;
  path: string;
  type: string;
  icon: string;
};

type Project = {
  name: string;
  label: string;
  href: string;
  linkLabel: string;
  description: string;
  image: string;
  imageAlt: string;
  tags: string[];
  tone: "green" | "blue" | "gold" | "coral" | "violet" | "mint";
};

type TimelineItem = {
  date: string;
  title: string;
  body: string;
};

type CommandAction = {
  title: string;
  detail: string;
  href: string;
  keywords: string;
};

type JourneyPanel = {
  id: string;
  code: string;
  label: string;
};

const data = getPortfolioData();
const skillGroups = getSkillGroups();
const appShowcases = getAppShowcases();
const toneSequence: Project["tone"][] = ["green", "blue", "gold", "coral", "violet", "mint"];

const appIcons: Record<string, string> = {
  YouTube: "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
  WhatsApp: "https://upload.wikimedia.org/wikipedia/commons/4/4c/WhatsApp_Logo_green.svg",
  Spotify: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
  LinkedIn: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=128",
  "Google Meet": "https://www.google.com/s2/favicons?domain=meet.google.com&sz=128",
  "Google Maps": "https://www.google.com/s2/favicons?domain=maps.google.com&sz=128",
};

const firstImage = (item: { images?: { url: string; alt?: string }[] }) => item.images?.find((image) => image.url);
const firstProjectLink = (links: Partial<Record<string, string>>): [string, string] => {
  const entry = Object.entries(links).find((entry): entry is [string, string] => Boolean(entry[1]));
  return entry ?? ["details", "#projects"];
};

const routes: RouteItem[] = appShowcases.map((app) => ({
  name: app.name,
  path: app.href,
  type: "Clone",
  icon: appIcons[app.name] ?? data.meta.avatar,
}));

const projects: Project[] = data.projects.map((project, index) => {
  const image = firstImage(project);
  const [linkLabel, href] = firstProjectLink(project.links);

  return {
    name: project.name,
    label: project.type.replace(/_/g, " "),
    href,
    linkLabel: linkLabel.replace(/_/g, " "),
    description: project.description || project.tagline,
    image: image?.url ?? data.meta.avatar,
    imageAlt: image?.alt ?? project.name,
    tags: project.tech_stack,
    tone: toneSequence[index % toneSequence.length],
  };
});

const stackGroups: [string, string[]][] = skillGroups.map((group) => [group.label, group.items]);

const timeline: TimelineItem[] = [
  ...data.experience.map((experience) => ({
    date: experience.current ? "Current" : getExperiencePeriod(experience),
    title: `${experience.role} at ${experience.company}`,
    body: experience.highlights?.[0] ?? `${experience.type.replace(/_/g, " ")} role in ${experience.location}.`,
  })),
  ...data.education.map((education) => ({
    date: `${education.start_year} - ${education.end_year}`,
    title: education.institution,
    body: `${education.degree}. CGPA ${education.cgpa}.`,
  })),
  ...data.achievements.map((achievement) => ({
    date: String(achievement.year),
    title: achievement.title,
    body: achievement.description || `${achievement.type} recognition from ${achievement.issuer}.`,
  })),
  ...data.research.map((paper) => ({
    date: paper.status,
    title: paper.title,
    body: paper.highlights?.[0] ?? `${paper.role} at ${paper.venue || 'research lab'}.`,
  })),
];

const facts = [
  [String(data.projects.length), "projects"],
  [String(data.experience.length), "roles"],
  [String(data.research.length), "papers"],
  [String(skillGroups.reduce((total, group) => total + group.items.length, 0)), "skills"],
  [data.education[0]?.institution.split(",")[0] ?? "Education", data.education[0]?.degree ?? "Education"],
];

const journeyPanels: JourneyPanel[] = [
  { id: "top", code: "00", label: "Identity" },
  { id: "projects", code: "01", label: "Builds" },
  { id: "stack", code: "02", label: "Stack" },
  { id: "journey", code: "03", label: "Path" },
  { id: "contact", code: "04", label: "Contact" },
];

export default function PortfolioHomePage() {
  const [commandsOpen, setCommandsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  useMotionVariables(rootRef);
  useJourneyNavigation(setActivePanel);

  const goToPanel = (index: number) => {
    scrollToJourneyPanel(index);
    setActivePanel(clampJourneyIndex(index));
  };

  const actions = useMemo<CommandAction[]>(() => {
    return [
      {
        title: "Projects",
        detail: "Jump to selected work",
        href: "#projects",
        keywords: "work apps portfolio",
      },
      {
        title: "Stack",
        detail: "View technical toolkit",
        href: "#stack",
        keywords: "skills tools languages",
      },
      {
        title: "Journey",
        detail: "Read profile timeline",
        href: "#journey",
        keywords: "experience education roles",
      },
      {
        title: "Contact",
        detail: "Email and profiles",
        href: "#contact",
        keywords: "hire email linkedin",
      },
      {
        title: "GitHub",
        detail: `Open ${data.meta.name}'s GitHub`,
        href: data.meta.links.github,
        keywords: "code repos",
      },
      {
        title: "LinkedIn",
        detail: "Open professional profile",
        href: data.meta.links.linkedin,
        keywords: "social role",
      },
      {
        title: "Resume",
        detail: "Open resume file",
        href: data.meta.resume_url,
        keywords: "cv",
      },
      ...routes.map((route) => ({
        title: route.name,
        detail: `Open ${route.path}`,
        href: route.path,
        keywords: `${route.type} route clone app`,
      })),
      ...projects.map((project) => ({
        title: project.name,
        detail: project.description,
        href: project.href,
        keywords: project.tags.join(" "),
      })),
    ];
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="pf-root" ref={rootRef}>
      <style>{portfolioStyles}</style>
      <div className="pf-scrollProgress" aria-hidden="true" />
      <CursorTrail />
      <JourneyControls activeIndex={activePanel} onNavigate={goToPanel} />

      <header className="pf-header">
        <nav className="pf-nav" aria-label="Primary">
          <a className="pf-brand" href="#top" aria-label={`${data.meta.name} home`}>
            <span className="pf-brandMark">{data.meta.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}</span>
            <span>
              {data.meta.name}
              <small>{data.meta.links.portfolio || data.meta.email}</small>
            </span>
          </a>

          <div className="pf-navLinks">
            <a className="pf-navLink" href="#projects">
              Projects
            </a>
            <a className="pf-navLink" href="#stack">
              Stack
            </a>
            <a className="pf-navLink" href="#journey">
              Journey
            </a>
            <a className="pf-navLink" href="#contact">
              Contact
            </a>
            <IconButton label="Open command menu" onClick={() => setCommandsOpen(true)}>
              <MenuIcon />
            </IconButton>
            <a
              className="pf-textButton pf-textButtonDark"
              href={data.meta.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon />
              <span>GitHub</span>
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="pf-hero pf-journeyPanel" id="top" aria-labelledby="hero-title">
          <MansionScene />
          <SignalCanvas />
          <HeroMotionRails />
          <HauntedBackdrop />
          <MansionRelics />
          <MansionHud />

          <div className="pf-heroContent">
            <div className="pf-statusStrip" aria-label="Current focus">
              <span>{data.projects.length} projects</span>
              <span>{data.experience.length} roles</span>
              <span>{data.research.length} papers</span>
              <span>{skillGroups.length} skill groups</span>
              <span>{data.achievements.length} achievements</span>
            </div>
            <div className="pf-superLabel" aria-hidden="true">
              <span>{data.meta.tagline}</span>
              <b>{data.meta.email}</b>
            </div>
            <p className="pf-eyebrow">{data.meta.tagline}</p>
            <h1 id="hero-title" data-text={data.meta.name}>
              {data.meta.name.split(" ").map((part) => (
                <span key={part}>{part}</span>
              ))}
            </h1>
            <p className="pf-lede">
              Explore {data.meta.name}&apos;s projects, stack, experience, and contact
              details from the same source data that powers the clone routes.
            </p>

            <div className="pf-heroActions" aria-label="Main actions">
              <a className="pf-primaryButton" href="#projects">
                Start Journey
                <ArrowRightIcon />
              </a>
              <a
                className="pf-secondaryButton"
                href={data.meta.resume_url}
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </a>
              <a
                className="pf-secondaryButton"
                href={data.meta.links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>

            <PortfolioSearch actions={actions} />

            <div className="pf-facts" aria-label="Highlights">
              {facts.map(([value, label]) => (
                <span className="pf-fact" key={label}>
                  <b>{value}</b> {label}
                </span>
              ))}
            </div>

            <div className="pf-miniConsole" aria-label="Build status">
              <span>~/portfolio</span>
              <strong>{data.meta.links.portfolio || data.meta.email}</strong>
              <i>{data.experience[0]?.current ? "current" : "ready"}</i>
            </div>

            <div className="pf-vibeStrip" aria-label="Portfolio modes">
              {skillGroups.slice(0, 3).map((group) => (
                <span key={group.label}>{group.label}</span>
              ))}
            </div>
          </div>
        </section>

        <Ticker />

        <section className="pf-section pf-sectionAlt pf-journeyPanel" id="projects" aria-labelledby="projects-title">
          <div className="pf-container">
            <SectionHead
              kicker="Checkpoint 01"
              title={`${data.projects.length} builds from myData.json.`}
              copy="Projects and clone routes are generated from the structured portfolio source instead of hardcoded launch-page content."
            />

            <div className="pf-routeGrid">
              {routes.map((route, index) => (
                <RouteTile key={route.path} route={route} index={index} />
              ))}
            </div>

            <div className="pf-projectGrid">
              {projects.map((project, index) => (
                <ProjectCard key={project.name} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="pf-section pf-journeyPanel" id="stack" aria-labelledby="stack-title">
          <div className="pf-container">
            <SectionHead
              kicker="Checkpoint 02"
              title="Stack mapped from the skills section."
              copy={`${skillGroups.length} skill groups are read directly from myData.json and rendered as the launch toolkit.`}
            />

            <div className="pf-stackLayout">
              <div className="pf-terminal">
                <header>
                <span>red_alert_toolbox.json</span>
                  <WindowDots />
                </header>
                <pre>{`{
${stackGroups.slice(0, 5).map(([title, items]) => `  "${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}": [${items.slice(0, 4).map((item) => `"${item}"`).join(", ")}]`).join(",\n")},
  "system_state": "synced_from_myData"
}`}</pre>
              </div>

              <div className="pf-stackList">
                {stackGroups.map(([title, items], index) => (
                  <article
                    className="pf-stackCard"
                    key={title}
                    style={{ "--delay": `${index * 70}ms` } as CSSProperties}
                  >
                    <h3>{title}</h3>
                    <ChipList items={items} />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pf-section pf-sectionAlt pf-journeyPanel" id="journey" aria-labelledby="journey-title">
          <div className="pf-container">
            <SectionHead
              kicker="Checkpoint 03"
              title="Experience, research, education, and achievements."
              copy="Timeline entries are built from experience, research, education, and achievement arrays in myData.json."
            />

            <div className="pf-timeline">
              {timeline.map((item, index) => (
                <article
                  className="pf-timelineItem"
                  key={`${item.date}-${item.title}`}
                  style={{ "--delay": `${index * 90}ms` } as CSSProperties}
                >
                  <time>{item.date}</time>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pf-section pf-journeyPanel" id="contact" aria-labelledby="contact-title">
          <div className="pf-container">
            <div className="pf-contact">
              <div>
                <p className="pf-sectionKicker">Checkpoint 04</p>
                <h2 id="contact-title">
                  Final checkpoint: open the channel.
                </h2>
              </div>
              <div className="pf-contactActions">
                <a className="pf-primaryButton" href={`mailto:${data.meta.email}`}>
                  Email
                </a>
                <a
                  className="pf-secondaryButton"
                  href={data.meta.links.leetcode}
                  target="_blank"
                  rel="noreferrer"
                >
                  LeetCode
                </a>
                <a
                  className="pf-secondaryButton"
                  href={data.meta.links.geeksforgeeks}
                  target="_blank"
                  rel="noreferrer"
                >
                  GFG
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pf-footer">
        <div className="pf-container">
          <span>{data.meta.name} / {data.meta.email}</span>
          <span>{data.meta.tagline}</span>
        </div>
      </footer>

      <CommandDialog
        actions={actions}
        open={commandsOpen}
        onOpenChange={setCommandsOpen}
      />
    </div>
  );
}

function useMotionVariables(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let raf = 0;

    const update = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const scroll = window.scrollY;
      const progress = scroll / maxScroll;
      const x = pointerX / Math.max(window.innerWidth, 1);
      const y = pointerY / Math.max(window.innerHeight, 1);

      root.style.setProperty("--mx", `${pointerX}px`);
      root.style.setProperty("--my", `${pointerY}px`);
      root.style.setProperty("--px", x.toFixed(4));
      root.style.setProperty("--py", y.toFixed(4));
      root.style.setProperty("--scroll", `${scroll.toFixed(1)}`);
      root.style.setProperty("--progress", `${progress.toFixed(4)}`);
      root.style.setProperty("--tilt-x", `${((x - 0.5) * 12).toFixed(2)}deg`);
      root.style.setProperty("--tilt-y", `${((0.5 - y) * 10).toFixed(2)}deg`);
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    const handlePointer = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!reduced) schedule();
    };

    const items = Array.from(root.querySelectorAll(".pf-reveal"));
    const reveal = () => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.86) {
          item.classList.add("is-visible");
        }
      });
    };

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );
    }

    observer?.takeRecords();
    items.forEach((item) => observer?.observe(item));

    update();
    reveal();
    const delayedReveal = window.setTimeout(reveal, 420);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("hashchange", reveal);
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("hashchange", reveal);
      window.removeEventListener("resize", schedule);
      window.clearTimeout(delayedReveal);
      observer?.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, [rootRef]);
}

function useJourneyNavigation(onActiveChange: (index: number) => void) {
  useEffect(() => {
    const panels = journeyPanels
      .map((panel, index) => ({
        element: document.getElementById(panel.id),
        index,
      }))
      .filter((panel): panel is { element: HTMLElement; index: number } => Boolean(panel.element));

    if (!panels.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!active) return;
        const next = panels.find((panel) => panel.element === active.target);
        if (next) onActiveChange(next.index);
      },
      { threshold: [0.35, 0.5, 0.7], rootMargin: "-16% 0px -28% 0px" }
    );

    panels.forEach((panel) => observer.observe(panel.element));

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        scrollToJourneyPanel(getCurrentJourneyIndex() + 1);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        scrollToJourneyPanel(getCurrentJourneyIndex() - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onActiveChange]);
}

function CursorTrail() {
  return (
    <div className="pf-cursor" aria-hidden="true">
      <span />
      <span />
    </div>
  );
}

function JourneyControls({
  activeIndex,
  onNavigate,
}: {
  activeIndex: number;
  onNavigate: (index: number) => void;
}) {
  const active = journeyPanels[activeIndex] ?? journeyPanels[0];

  return (
    <aside className="pf-journeyControls" aria-label="Journey navigation">
      <button
        className="pf-journeyArrow"
        type="button"
        aria-label="Previous checkpoint"
        disabled={activeIndex === 0}
        onClick={() => onNavigate(activeIndex - 1)}
      >
        <ChevronUpIcon />
      </button>

      <div className="pf-journeyReadout" aria-live="polite">
        <b>{active.code}</b>
        <span>{active.label}</span>
      </div>

      <div className="pf-journeyDots" aria-label="Jump to checkpoint">
        {journeyPanels.map((panel, index) => (
          <button
            className={index === activeIndex ? "isActive" : ""}
            type="button"
            key={panel.id}
            aria-label={`Go to ${panel.label}`}
            aria-current={index === activeIndex ? "step" : undefined}
            onClick={() => onNavigate(index)}
          >
            <span>{panel.code}</span>
          </button>
        ))}
      </div>

      <button
        className="pf-journeyArrow"
        type="button"
        aria-label="Next checkpoint"
        disabled={activeIndex === journeyPanels.length - 1}
        onClick={() => onNavigate(activeIndex + 1)}
      >
        <ChevronDownIcon />
      </button>
    </aside>
  );
}

function MansionScene() {
  return (
    <div className="pf-mansionScene" aria-hidden="true">
      <img src="https://thumbs.dreamstime.com/b/haunted-house-crows-spooky-atmosphere-dark-horror-scene-81253070.jpg" alt="" />
      <span />
      <span />
      <span />
    </div>
  );
}

function MansionRelics() {
  return (
    <div className="pf-mansionRelics" aria-hidden="true">
      <div className="pf-driftShape pf-driftOne" />
      <div className="pf-driftShape pf-driftTwo" />
      <div className="pf-pumpkin pf-pumpkinOne">
        <span />
      </div>
      <div className="pf-pumpkin pf-pumpkinTwo">
        <span />
      </div>
      <div className="pf-candleTrail">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="pf-sigil">
        <b>8181</b>
      </div>
    </div>
  );
}

function MansionHud() {
  return (
    <aside className="pf-curseHud" aria-label="Red alert portfolio status">
      <div className="pf-hudTop">
        <span>threat level</span>
        <b>redline</b>
      </div>
      <div className="pf-hudMeter">
        <span />
      </div>
      <div className="pf-hudGrid">
        <span>
          <b>8181</b>
          signal
        </span>
        <span>
          <b>06</b>
          rooms
        </span>
        <span>
          <b>AI</b>
          core
        </span>
      </div>
      <p>all checkpoints armed for review</p>
    </aside>
  );
}

function HauntedBackdrop() {
  return (
    <div className="pf-hauntedBackdrop" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <i />
      <i />
      <i />
      <i />
      <div className="pf-webNet" />
      <div className="pf-branchFrame" />
      <div className="pf-floorGrid" />
    </div>
  );
}

function HeroMotionRails() {
  return (
    <div className="pf-motionRails" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <i />
      <i />
      <i />
    </div>
  );
}

function Ticker() {
  const items = [
    "RED ALERT",
    "React Systems",
    "Next.js Route",
    "Node Core",
    "AI Automation",
    "C++ Logic",
    "Kotlin Mobile",
    "Project Lock",
    "Ship Signal",
    "Final Checkpoint",
  ];
  const row = [...items, ...items];

  return (
    <section className="pf-ticker" aria-label="Technology focus">
      <div>
        {row.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
      <div aria-hidden="true">
        {[...row].reverse().map((item, index) => (
          <span key={`reverse-${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function SectionHead({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="pf-sectionHead">
      <div>
        <p className="pf-sectionKicker">{kicker}</p>
        <h2>{title}</h2>
      </div>
      <p>{copy}</p>
    </div>
  );
}

function RouteTile({ route, index }: { route: RouteItem; index: number }) {
  return (
    <a
      className="pf-routeTile pf-reveal"
      href={route.path}
      style={{ "--delay": `${index * 55}ms` } as CSSProperties}
    >
      <img src={route.icon} alt="" loading="lazy" />
      <span>{route.type}</span>
      <strong>{route.name}</strong>
    </a>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const external = isExternal(project.href);

  return (
    <a
      className={`pf-projectCard pf-reveal pf-tone-${project.tone}`}
      href={project.href}
      target={external && project.href !== "#projects" ? "_blank" : undefined}
      rel={external && project.href !== "#projects" ? "noreferrer" : undefined}
      data-index={`0${index + 1}`}
      style={{ "--delay": `${index * 80}ms` } as CSSProperties}
    >
      <div className="pf-projectVisual">
        <img src={project.image} alt={project.imageAlt} loading="lazy" />
      </div>
      <div className="pf-projectBody">
        <div className="pf-projectMeta">
          <span>{project.label}</span>
          <span>{project.linkLabel}</span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <ChipList items={project.tags} />
      </div>
    </a>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="pf-chips">
      {items.map((item) => (
        <span className="pf-chip" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

function PortfolioSearch({ actions }: { actions: CommandAction[] }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const matches = useMemo(() => filterActions(actions, query), [actions, query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openAction(matches[0]);
  };

  return (
    <div className="pf-searchShell">
      <form className="pf-searchBox" onSubmit={handleSubmit}>
        <SearchIcon />
        <input
          type="search"
          value={query}
          onBlur={() => window.setTimeout(() => setFocused(false), 140)}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search clues"
          aria-label="Search portfolio"
        />
        <button className="pf-searchSubmit" type="submit" aria-label="Open selected result">
          <ArrowRightIcon />
        </button>
      </form>

      <div className={`pf-results ${focused || query ? "isOpen" : ""}`} role="listbox">
        {matches.length ? (
          matches.map((action) => <CommandLink key={`${action.title}-${action.href}`} action={action} />)
        ) : (
          <div className="pf-commandItem">
            <span>
              <strong>No result</strong>
              <span>Try projects, stack, GitHub, or an escape route.</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function CommandDialog({
  actions,
  open,
  onOpenChange,
}: {
  actions: CommandAction[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const matches = useMemo(() => filterActions(actions, query), [actions, query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onOpenChange(false);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onOpenChange]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openAction(matches[0]);
    onOpenChange(false);
  };

  return (
    <dialog
      ref={dialogRef}
      className="pf-commandDialog"
      aria-label="Command menu"
      onClick={(event) => {
        if (event.target === dialogRef.current) onOpenChange(false);
      }}
    >
      <form className="pf-dialogHead" onSubmit={handleSubmit}>
        <SearchIcon />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search portfolio clues"
        />
        <IconButton label="Close command menu" onClick={() => onOpenChange(false)}>
          <CloseIcon />
        </IconButton>
      </form>

      <div className="pf-dialogList">
        {matches.length ? (
          matches.map((action) => <CommandLink key={`${action.title}-${action.href}`} action={action} />)
        ) : (
          <div className="pf-commandItem">
            <span>
              <strong>No result</strong>
              <span>Try projects, stack, GitHub, or an escape route.</span>
            </span>
          </div>
        )}
      </div>
    </dialog>
  );
}

function CommandLink({ action }: { action: CommandAction }) {
  const external = isExternal(action.href);

  return (
    <a
      className="pf-commandItem"
      href={action.href}
      target={external && !action.href.startsWith("mailto:") ? "_blank" : undefined}
      rel={external && !action.href.startsWith("mailto:") ? "noreferrer" : undefined}
    >
      <span>
        <strong>{action.title}</strong>
        <span>{action.detail}</span>
      </span>
      <ArrowRightIcon />
    </a>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button className="pf-iconButton" type="button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

function WindowDots() {
  return (
    <span className="pf-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function SignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let frame = 0;
    let width = 0;
    let height = 0;

    const nodes = Array.from({ length: 34 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      phase: index * 0.37,
      speed: 0.002 + Math.random() * 0.004,
    }));

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      const points = nodes.map((node) => {
        const drift = reduced ? 0 : Math.sin(frame * node.speed + node.phase) * 18;
        return {
          x: node.x * width + drift,
          y: node.y * height + Math.cos(frame * node.speed + node.phase) * 12,
        };
      });

      points.forEach((point, index) => {
        for (let next = index + 1; next < points.length; next += 1) {
          const other = points[next];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);

          if (distance < 155) {
            context.strokeStyle = `rgba(255, 24, 56, ${0.22 - distance / 1350})`;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      });

      points.forEach((point, index) => {
        const colors = ["#ff1838", "#ff4fd8", "#55f7ff", "#d7ff45", "#ffb02e"];
        context.fillStyle = colors[index % colors.length];
        context.beginPath();
        context.arc(point.x, point.y, index % 3 === 0 ? 3 : 2, 0, Math.PI * 2);
        context.fill();
      });

      frame += 1;
      if (!reduced) animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="pf-signalCanvas" aria-hidden="true" />;
}

function filterActions(actions: CommandAction[], query: string) {
  const q = query.trim().toLowerCase();

  return actions
    .filter((action) => {
      const haystack = `${action.title} ${action.detail} ${action.keywords}`.toLowerCase();
      return !q || haystack.includes(q);
    })
    .slice(0, 8);
}

function isExternal(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:");
}

function openAction(action: CommandAction | undefined) {
  if (!action) return;

  if (action.href.startsWith("http")) {
    window.open(action.href, "_blank", "noopener,noreferrer");
    return;
  }

  window.location.href = action.href;
}

function clampJourneyIndex(index: number) {
  return Math.min(Math.max(index, 0), journeyPanels.length - 1);
}

function getCurrentJourneyIndex() {
  const middle = window.scrollY + window.innerHeight * 0.44;
  const distances = journeyPanels.map((panel, index) => {
    const element = document.getElementById(panel.id);
    if (!element) return { index, distance: Number.POSITIVE_INFINITY };
    const top = element.offsetTop;
    const bottom = top + element.offsetHeight;
    const center = top + (bottom - top) / 2;
    return { index, distance: Math.abs(center - middle) };
  });

  return distances.sort((a, b) => a.distance - b.distance)[0]?.index ?? 0;
}

function scrollToJourneyPanel(index: number) {
  const next = clampJourneyIndex(index);
  const panel = document.getElementById(journeyPanels[next].id);
  panel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ArrowRightIcon() {
  return (
    <svg className="pf-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="pf-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="pf-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.1-1.5 6.1-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.8 12.8 0 0 0-6.7 0C6.7.3 5.6.6 5.6.6a4.8 4.8 0 0 0-.1 3.6A5.2 5.2 0 0 0 4.1 8.8c0 5.2 3.1 6.4 6.1 6.7a3.4 3.4 0 0 0-.9 2.6V22" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="pf-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="pf-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg className="pf-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="pf-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const portfolioStyles = `
html,
body {
  margin: 0;
  min-height: 100%;
  background: #070101;
  scroll-behavior: smooth;
  scroll-snap-type: y proximity;
}

body {
  overflow-x: hidden;
}

.pf-root {
  --pf-bg: #070101;
  --pf-bg-2: #120304;
  --pf-panel: rgba(20, 5, 7, 0.84);
  --pf-panel-solid: #150507;
  --pf-panel-2: rgba(31, 7, 10, 0.9);
  --pf-ink: #fff1e8;
  --pf-muted: #c9aaa2;
  --pf-line: rgba(255, 51, 74, 0.2);
  --pf-green: #ff334a;
  --pf-coral: #ff143d;
  --pf-blue: #55f7ff;
  --pf-gold: #ffb02e;
  --pf-violet: #9a7cff;
  --pf-mint: #b7ffc9;
  --pf-acid: #d7ff45;
  --pf-pink: #ff4fd8;
  --pf-cyan: #55f7ff;
  --pf-red: #ff1838;
  --pf-red-hot: #ff4b2f;
  --pf-shadow: 0 26px 80px rgba(0, 0, 0, 0.44);
  --pf-radius: 8px;
  --pf-radius-lg: 14px;
  --mx: 50vw;
  --my: 50vh;
  --px: 0.5;
  --py: 0.5;
  --scroll: 0;
  --progress: 0;
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  position: relative;
  min-height: 100vh;
  overflow-x: clip;
  background:
    repeating-linear-gradient(90deg, rgba(255, 24, 56, 0.055) 0 1px, transparent 1px 62px),
    repeating-linear-gradient(0deg, rgba(255, 75, 47, 0.038) 0 1px, transparent 1px 36px),
    linear-gradient(115deg, rgba(255, 20, 61, 0.22), transparent 24%, rgba(215, 255, 69, 0.08) 47%, transparent 67%, rgba(85, 247, 255, 0.08)),
    var(--pf-bg);
  background-size: auto, auto, auto, auto;
  color: var(--pf-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
}

.pf-root::before,
.pf-root::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.pf-root::before {
  background:
    linear-gradient(96deg, transparent 0 12%, rgba(255, 241, 232, 0.05) 13%, transparent 19% 42%, rgba(255, 24, 56, 0.08) 48%, transparent 58%),
    repeating-linear-gradient(90deg, transparent 0 88px, rgba(255, 75, 47, 0.06) 88px 90px, transparent 90px 176px),
    repeating-linear-gradient(0deg, transparent 0 46px, rgba(255, 24, 56, 0.05) 46px 47px, transparent 47px 94px);
  transform: translate3d(calc(var(--px) * -16px), calc(var(--scroll) * -0.035px), 0);
  animation: pfFogDrift 11s ease-in-out infinite alternate;
}

.pf-root::after {
  background:
    linear-gradient(115deg, transparent 0 23%, rgba(255, 24, 56, 0.16) 23% 24%, transparent 24% 51%, rgba(215, 255, 69, 0.09) 51% 52%, transparent 52%),
    linear-gradient(180deg, transparent 0 42%, rgba(255, 24, 56, 0.12) 43%, transparent 44%),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0 1px, transparent 1px 9px);
  mix-blend-mode: screen;
  opacity: 0.46;
  transform: translate3d(calc(var(--px) * 22px), calc(var(--scroll) * -0.06px), 0);
  animation: pfStaticJolt 7s steps(1) infinite;
}

.pf-root *,
.pf-root *::before,
.pf-root *::after {
  box-sizing: border-box;
}

.pf-root a {
  color: inherit;
  text-decoration: none;
}

.pf-root img {
  display: block;
  max-width: 100%;
}

.pf-root button,
.pf-root input {
  font: inherit;
}

.pf-root button {
  border: 0;
}

.pf-root :focus-visible {
  outline: 3px solid rgba(255, 24, 56, 0.58);
  outline-offset: 3px;
}

.pf-scrollProgress {
  position: fixed;
  inset: 0 auto auto 0;
  z-index: 70;
  width: calc(var(--progress) * 100%);
  height: 3px;
  background: linear-gradient(90deg, var(--pf-green), var(--pf-gold), var(--pf-coral), var(--pf-blue));
  box-shadow: 0 0 18px rgba(255, 24, 56, 0.75);
  pointer-events: none;
}

.pf-cursor {
  position: fixed;
  inset: 0;
  z-index: 68;
  pointer-events: none;
}

.pf-cursor::before {
  content: "";
  position: fixed;
  left: var(--mx);
  top: var(--my);
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 24, 56, 0.24) 0 12%, rgba(215, 255, 69, 0.13) 22%, transparent 64%);
  filter: blur(9px);
  mix-blend-mode: screen;
  opacity: 0.85;
  transform: translate(-50%, -50%);
  animation: pfLanternBreath 2.4s ease-in-out infinite alternate;
}

.pf-cursor span {
  position: fixed;
  left: var(--mx);
  top: var(--my);
  border: 1px solid rgba(255, 24, 56, 0.62);
  transform: translate(-50%, -50%);
  transition: width 160ms ease, height 160ms ease, opacity 160ms ease;
  animation: pfCursorPulse 1.8s ease-in-out infinite alternate;
}

.pf-cursor span:first-child {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  box-shadow:
    inset 0 0 18px rgba(255, 24, 56, 0.18),
    0 0 20px rgba(255, 24, 56, 0.2);
}

.pf-cursor span:last-child {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--pf-gold);
  border-color: var(--pf-gold);
}

.pf-journeyPanel {
  min-height: 100svh;
  scroll-snap-align: start;
  scroll-margin-top: 0;
}

.pf-section.pf-journeyPanel {
  display: flex;
  align-items: center;
}

.pf-journeyControls {
  position: fixed;
  right: max(14px, env(safe-area-inset-right));
  top: 50%;
  z-index: 90;
  display: grid;
  gap: 0.55rem;
  width: 74px;
  transform: translateY(-50%);
  pointer-events: auto;
}

.pf-journeyArrow,
.pf-journeyDots button {
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 24, 56, 0.4);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(135deg, rgba(255, 24, 56, 0.18), rgba(215, 255, 69, 0.08)),
    rgba(10, 2, 3, 0.72);
  color: var(--pf-ink);
  box-shadow:
    inset 0 0 18px rgba(255, 24, 56, 0.12),
    0 12px 30px rgba(0, 0, 0, 0.26);
  backdrop-filter: blur(12px);
  cursor: pointer;
}

.pf-journeyArrow {
  width: 54px;
  height: 54px;
  justify-self: center;
}

.pf-journeyArrow:not(:disabled):hover,
.pf-journeyDots button:hover,
.pf-journeyDots .isActive {
  border-color: rgba(215, 255, 69, 0.74);
  color: var(--pf-acid);
  box-shadow:
    inset 0 0 18px rgba(215, 255, 69, 0.13),
    0 0 28px rgba(255, 24, 56, 0.18);
}

.pf-journeyArrow:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.pf-journeyReadout {
  display: grid;
  min-height: 74px;
  place-items: center;
  border: 1px solid rgba(255, 24, 56, 0.34);
  border-radius: var(--pf-radius);
  background:
    repeating-linear-gradient(0deg, rgba(255, 24, 56, 0.11) 0 2px, transparent 2px 8px),
    rgba(9, 2, 3, 0.78);
  color: var(--pf-muted);
  text-align: center;
  text-transform: uppercase;
  box-shadow: 0 0 30px rgba(255, 24, 56, 0.14);
  backdrop-filter: blur(12px);
}

.pf-journeyReadout b {
  color: var(--pf-red-hot);
  font-size: 1.35rem;
  line-height: 1;
  text-shadow: 0 0 18px rgba(255, 24, 56, 0.5);
}

.pf-journeyReadout span {
  color: var(--pf-acid);
  font-size: 0.66rem;
  font-weight: 950;
}

.pf-journeyDots {
  display: grid;
  gap: 0.35rem;
}

.pf-journeyDots button {
  width: 38px;
  height: 30px;
  justify-self: center;
  padding: 0;
}

.pf-journeyDots span {
  font-size: 0.68rem;
  font-weight: 950;
}

.pf-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--pf-line);
  background: rgba(5, 6, 6, 0.72);
  backdrop-filter: blur(18px) saturate(1.3);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.28);
}

.pf-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: min(1180px, calc(100% - 32px));
  min-height: 68px;
  margin: 0 auto;
}

.pf-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
  font-weight: 950;
  letter-spacing: 0;
}

.pf-brandMark {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgba(255, 24, 56, 0.48);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(135deg, rgba(255, 24, 56, 0.26), rgba(215, 255, 69, 0.1)),
    rgba(18, 3, 4, 0.94);
  color: var(--pf-ink);
  font-size: 0.86rem;
  box-shadow: 0 0 22px rgba(255, 24, 56, 0.28);
  animation: pfFlicker 3.6s steps(1) infinite;
}

.pf-brand small {
  display: block;
  color: var(--pf-muted);
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.pf-navLinks {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pf-navLink,
.pf-iconButton,
.pf-textButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  border-radius: var(--pf-radius);
  color: var(--pf-ink);
  font-weight: 850;
}

.pf-navLink {
  position: relative;
  padding: 0 0.75rem;
  color: var(--pf-muted);
  font-size: 0.92rem;
  overflow: hidden;
}

.pf-navLink::after {
  content: "";
  position: absolute;
  inset: auto 0 7px;
  width: 0;
  height: 2px;
  margin: auto;
  background: var(--pf-green);
  transition: width 180ms ease;
}

.pf-navLink:hover {
  color: var(--pf-ink);
}

.pf-navLink:hover::after {
  width: calc(100% - 22px);
}

.pf-iconButton {
  width: 42px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  color: var(--pf-ink);
}

.pf-iconButton:hover,
.pf-textButton:hover {
  background: rgba(255, 24, 56, 0.14);
  color: var(--pf-green);
}

.pf-icon {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.pf-textButton {
  gap: 0.45rem;
  min-height: 44px;
  padding: 0 0.95rem;
  border: 1px solid rgba(255, 24, 56, 0.38);
  white-space: nowrap;
}

.pf-root .pf-textButtonDark {
  background:
    linear-gradient(135deg, rgba(215, 255, 69, 0.14), rgba(255, 79, 216, 0.1)),
    rgba(255, 255, 255, 0.05);
  color: white;
}

.pf-root .pf-textButtonDark:hover {
  border-color: rgba(214, 168, 79, 0.74);
  color: var(--pf-gold);
}

.pf-hero {
  position: relative;
  isolation: isolate;
  min-height: 92svh;
  overflow: hidden;
  border-bottom: 1px solid var(--pf-line);
  background: #020607;
}

.pf-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(2, 6, 7, 0.94) 0 7%, rgba(2, 6, 7, 0.76) 21%, rgba(2, 6, 7, 0.34) 54%, rgba(2, 6, 7, 0.08) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.3), transparent 34%, rgba(0, 0, 0, 0.52));
  pointer-events: none;
}

.pf-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 78% 45%, rgba(214, 168, 79, 0.24), transparent 18%),
    radial-gradient(circle at 67% 20%, rgba(255, 79, 216, 0.11), transparent 16%),
    radial-gradient(circle at 44% 52%, rgba(85, 247, 255, 0.11), transparent 18%),
    radial-gradient(circle at 88% 81%, rgba(241, 95, 35, 0.2), transparent 16%),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 13px);
  mix-blend-mode: screen;
  opacity: 0.58;
  animation: pfStaticJolt 5.2s steps(1) infinite;
  pointer-events: none;
}

.pf-mansionScene {
  position: absolute;
  inset: 0;
  z-index: -4;
  overflow: hidden;
  pointer-events: none;
}

.pf-mansionScene img {
  width: 106%;
  height: 106%;
  max-width: none;
  object-fit: cover;
  object-position: center center;
  filter: saturate(1.08) contrast(1.1) brightness(0.78);
  transform:
    translate3d(calc(var(--px) * -30px - 3%), calc(var(--scroll) * -0.06px - 3%), 0)
    scale(1.04);
  transform-origin: center;
  animation: pfMansionBreathe 8s ease-in-out infinite alternate;
}

.pf-mansionScene::before,
.pf-mansionScene::after,
.pf-mansionScene span {
  content: "";
  position: absolute;
  pointer-events: none;
}

.pf-mansionScene::before {
  inset: 0;
  background:
    linear-gradient(90deg, rgba(2, 5, 6, 0.84) 0 10%, rgba(2, 5, 6, 0.58) 27%, rgba(2, 5, 6, 0.18) 57%, rgba(2, 5, 6, 0.24) 100%),
    radial-gradient(circle at 72% 42%, transparent 0 20%, rgba(0, 0, 0, 0.18) 44%, rgba(0, 0, 0, 0.56) 100%);
}

.pf-mansionScene::after {
  inset: auto -6vw -7vh -6vw;
  height: 34vh;
  background:
    radial-gradient(ellipse at 30% 52%, rgba(187, 226, 221, 0.28), transparent 46%),
    radial-gradient(ellipse at 77% 45%, rgba(187, 226, 221, 0.22), transparent 42%),
    linear-gradient(180deg, transparent, rgba(187, 226, 221, 0.22));
  filter: blur(16px);
  opacity: 0.74;
  transform: translate3d(calc(var(--px) * -20px), calc(var(--scroll) * -0.045px), 0);
  animation: pfFogDrift 9s ease-in-out infinite alternate;
}

.pf-mansionScene span:nth-child(2),
.pf-mansionScene span:nth-child(3),
.pf-mansionScene span:nth-child(4) {
  left: -8vw;
  right: -8vw;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(230, 247, 244, 0.3), transparent);
  opacity: 0.48;
  transform-origin: center;
  animation: pfWebStrand 5s ease-in-out infinite alternate;
}

.pf-mansionScene span:nth-child(2) {
  top: 10%;
  transform: rotate(-13deg) translate3d(calc(var(--px) * 18px), 0, 0);
}

.pf-mansionScene span:nth-child(3) {
  top: 23%;
  transform: rotate(7deg) translate3d(calc(var(--px) * -24px), 0, 0);
  animation-delay: -2s;
}

.pf-mansionScene span:nth-child(4) {
  bottom: 18%;
  transform: rotate(-4deg) translate3d(calc(var(--px) * 12px), 0, 0);
  animation-delay: -3.4s;
}

.pf-signalCanvas {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  mix-blend-mode: screen;
}

.pf-motionRails {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.pf-motionRails span,
.pf-motionRails i {
  position: absolute;
  display: block;
  border: 1px solid rgba(242, 240, 223, 0.12);
  transform-style: preserve-3d;
}

.pf-motionRails span {
  width: 52vw;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(231, 247, 241, 0.55), transparent);
  border: 0;
  animation: pfRailFlow 5s linear infinite, pfWebStrand 4.2s ease-in-out infinite alternate;
}

.pf-motionRails span:nth-child(1) {
  left: -8vw;
  top: 24%;
  animation-delay: -1.2s;
  transform: translate3d(calc(var(--px) * 38px), calc(var(--scroll) * -0.08px), 0) rotate(-11deg);
}

.pf-motionRails span:nth-child(2) {
  right: -18vw;
  top: 34%;
  animation-delay: -3s;
  background: linear-gradient(90deg, transparent, rgba(214, 168, 79, 0.58), transparent);
  transform: translate3d(calc(var(--px) * -42px), calc(var(--scroll) * -0.12px), 0) rotate(14deg);
}

.pf-motionRails span:nth-child(3) {
  left: 16vw;
  bottom: 22%;
  animation-delay: -2.1s;
  background: linear-gradient(90deg, transparent, rgba(231, 247, 241, 0.46), transparent);
  transform: translate3d(calc(var(--px) * 24px), calc(var(--scroll) * -0.18px), 0) rotate(5deg);
}

.pf-motionRails span:nth-child(4) {
  right: 6vw;
  bottom: 12%;
  animation-delay: -4.4s;
  background: linear-gradient(90deg, transparent, rgba(139, 182, 255, 0.48), transparent);
  transform: translate3d(calc(var(--px) * -32px), calc(var(--scroll) * -0.07px), 0) rotate(-6deg);
}

.pf-motionRails i {
  width: 210px;
  height: 210px;
  border-radius: var(--pf-radius);
  opacity: 0.42;
  animation: pfWireDrift 8s ease-in-out infinite alternate, pfCrackBlink 3.8s steps(1) infinite;
  clip-path: polygon(0 0, 100% 0, 100% 18%, 74% 18%, 74% 100%, 0 100%);
}

.pf-motionRails i:nth-of-type(1) {
  left: 7%;
  top: 12%;
  border-color: rgba(255, 24, 56, 0.18);
}

.pf-motionRails i:nth-of-type(2) {
  right: 8%;
  top: 18%;
  border-color: rgba(214, 168, 79, 0.18);
  animation-delay: -2s;
}

.pf-motionRails i:nth-of-type(3) {
  right: 31%;
  bottom: 7%;
  border-color: rgba(255, 79, 216, 0.18);
  animation-delay: -4s;
}

.pf-hauntedBackdrop {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.pf-hauntedBackdrop > span {
  position: absolute;
  display: block;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 42%, rgba(255, 221, 145, 0.92) 0 14%, rgba(247, 133, 42, 0.52) 22%, rgba(247, 133, 42, 0.14) 43%, transparent 68%);
  filter: blur(2px);
  mix-blend-mode: screen;
  animation: pfFlicker 2.6s steps(1) infinite;
}

.pf-hauntedBackdrop > span:nth-of-type(1) {
  right: 24%;
  top: 41%;
  width: 92px;
  height: 92px;
}

.pf-hauntedBackdrop > span:nth-of-type(2) {
  right: 8%;
  bottom: 15%;
  width: 150px;
  height: 150px;
  animation-delay: -1.8s;
}

.pf-hauntedBackdrop > span:nth-of-type(3) {
  right: 36%;
  bottom: 19%;
  width: 112px;
  height: 112px;
  animation-delay: -3.1s;
}

.pf-hauntedBackdrop > span:nth-of-type(4) {
  right: 13%;
  top: 63%;
  width: 88px;
  height: 88px;
  animation-delay: -4.6s;
}

.pf-hauntedBackdrop > i {
  position: absolute;
  display: block;
  width: 180px;
  height: 1px;
  border: 1px solid rgba(242, 240, 223, 0.12);
  background: rgba(231, 247, 241, 0.28);
  opacity: 0.38;
  transform-origin: center;
  animation: pfWebStrand 4.4s ease-in-out infinite alternate, pfFlicker 3.2s steps(1) infinite;
}

.pf-hauntedBackdrop > i:nth-of-type(1) {
  left: 2%;
  top: 18%;
  transform: rotate(37deg);
}

.pf-hauntedBackdrop > i:nth-of-type(2) {
  left: 6%;
  top: 22%;
  transform: rotate(-16deg);
  animation-delay: -2.2s;
}

.pf-hauntedBackdrop > i:nth-of-type(3) {
  right: 5%;
  top: 7%;
  transform: rotate(-32deg);
  animation-delay: -3.8s;
}

.pf-hauntedBackdrop > i:nth-of-type(4) {
  right: 3%;
  top: 13%;
  transform: rotate(25deg);
  animation-delay: -4.5s;
}

.pf-webNet {
  position: absolute;
  right: 0;
  top: 0;
  width: min(24vw, 330px);
  height: min(24vw, 330px);
  background:
    linear-gradient(33deg, transparent 0 49%, rgba(231, 247, 241, 0.18) 50%, transparent 51%),
    linear-gradient(79deg, transparent 0 49%, rgba(231, 247, 241, 0.13) 50%, transparent 51%),
    linear-gradient(123deg, transparent 0 49%, rgba(231, 247, 241, 0.12) 50%, transparent 51%),
    repeating-radial-gradient(circle at 100% 0, transparent 0 42px, rgba(231, 247, 241, 0.14) 43px 44px, transparent 45px 84px);
  opacity: 0.72;
  transform: translate3d(calc(var(--px) * -12px), calc(var(--scroll) * -0.035px), 0);
  animation: pfWebStrand 5.8s ease-in-out infinite alternate;
}

.pf-branchFrame {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(112deg, transparent 0 10%, rgba(0, 0, 0, 0.56) 10% 11%, transparent 11% 18%, rgba(0, 0, 0, 0.42) 18% 19%, transparent 19%),
    linear-gradient(242deg, transparent 0 8%, rgba(0, 0, 0, 0.6) 8% 9%, transparent 9% 16%, rgba(0, 0, 0, 0.46) 16% 17%, transparent 17%);
  opacity: 0.6;
  transform: translate3d(calc(var(--px) * 20px), calc(var(--scroll) * -0.04px), 0);
}

.pf-floorGrid {
  position: absolute;
  inset: auto -6vw 0 -6vw;
  height: 28%;
  background:
    radial-gradient(ellipse at 42% 62%, rgba(190, 220, 220, 0.22), transparent 45%),
    radial-gradient(ellipse at 79% 58%, rgba(214, 168, 79, 0.2), transparent 38%),
    linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.48));
  filter: blur(12px);
  transform: translate3d(calc(var(--px) * -18px), calc(var(--scroll) * -0.06px), 0);
  opacity: 0.78;
  animation: pfFogDrift 7s ease-in-out infinite alternate;
}

.pf-mansionRelics {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.pf-driftShape {
  position: absolute;
  width: 86px;
  height: 86px;
  background:
    radial-gradient(circle at 50% 50%, rgba(215, 255, 69, 0.38), transparent 26%),
    linear-gradient(135deg, rgba(255, 24, 56, 0.86), rgba(255, 75, 47, 0.36));
  border: 1px solid rgba(255, 24, 56, 0.74);
  border-radius: var(--pf-radius);
  box-shadow:
    0 0 30px rgba(255, 24, 56, 0.28),
    inset 0 0 26px rgba(0, 0, 0, 0.26);
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.42));
  opacity: 0.74;
  animation: pfDriftShape 6.8s ease-in-out infinite alternate, pfFlicker 5s steps(1) infinite;
}

.pf-driftShape::before {
  content: "!";
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--pf-acid);
  font-size: 2rem;
  font-weight: 1000;
  text-shadow: 0 0 16px rgba(215, 255, 69, 0.55);
}

.pf-driftShape::after {
  content: "";
  position: absolute;
  inset: 14px;
  border: 1px solid rgba(215, 255, 69, 0.22);
  border-radius: inherit;
}

.pf-driftOne {
  right: 21%;
  top: 54%;
}

.pf-driftTwo {
  right: 7%;
  top: 33%;
  width: 60px;
  height: 60px;
  opacity: 0.58;
  animation-delay: -3.2s;
}

.pf-pumpkin {
  position: absolute;
  width: 118px;
  height: 118px;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 241, 232, 0.86) 0 10%, rgba(255, 24, 56, 0.82) 12% 22%, transparent 24%),
    repeating-radial-gradient(circle, rgba(255, 24, 56, 0.28) 0 18px, rgba(255, 75, 47, 0.12) 19px 34px, transparent 35px 50px);
  box-shadow:
    0 0 52px rgba(255, 24, 56, 0.48),
    inset 0 0 28px rgba(255, 24, 56, 0.28);
  transform: rotate(-5deg);
  animation: pfPumpkinGlow 2.3s steps(1) infinite;
}

.pf-pumpkin::before {
  content: "";
  position: absolute;
  inset: 18px;
  border: 2px solid rgba(215, 255, 69, 0.22);
  border-radius: 50%;
  background: transparent;
  transform: none;
}

.pf-pumpkin::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 58%;
  height: 2px;
  background: var(--pf-acid);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 18px rgba(215, 255, 69, 0.48);
}

.pf-pumpkin span {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    linear-gradient(90deg, transparent 49%, rgba(215, 255, 69, 0.46) 49% 51%, transparent 51%),
    linear-gradient(0deg, transparent 49%, rgba(215, 255, 69, 0.46) 49% 51%, transparent 51%);
  filter: drop-shadow(0 0 12px rgba(215, 255, 69, 0.45));
}

.pf-pumpkinOne {
  right: 0.7rem;
  bottom: 0.8rem;
}

.pf-pumpkinTwo {
  right: 19%;
  bottom: 1.3rem;
  width: 84px;
  height: 84px;
  transform: rotate(7deg);
  opacity: 0.82;
  animation-delay: -1.4s;
}

.pf-candleTrail {
  position: absolute;
  right: 26%;
  bottom: 4.2rem;
  display: flex;
  align-items: end;
  gap: 1rem;
  transform: translate3d(calc(var(--px) * -22px), calc(var(--scroll) * -0.03px), 0);
}

.pf-candleTrail span {
  position: relative;
  width: 12px;
  height: 46px;
  border-radius: 6px 6px 2px 2px;
  background: linear-gradient(#f7edd5, #83613a);
  box-shadow: 0 10px 22px rgba(214, 168, 79, 0.22);
}

.pf-candleTrail span::before {
  content: "";
  position: absolute;
  left: -7px;
  top: -24px;
  width: 27px;
  height: 34px;
  border-radius: 50% 50% 44% 44%;
  background:
    radial-gradient(circle at 50% 64%, rgba(255, 248, 161, 0.95) 0 18%, rgba(247, 133, 42, 0.78) 38%, transparent 72%);
  filter: blur(1px);
  animation: pfFlicker 1.4s steps(1) infinite;
}

.pf-candleTrail span:nth-child(2) {
  height: 30px;
  animation-delay: -0.6s;
}

.pf-candleTrail span:nth-child(3) {
  height: 54px;
  animation-delay: -1.1s;
}

.pf-candleTrail span:nth-child(4) {
  height: 38px;
  animation-delay: -1.8s;
}

.pf-sigil {
  position: absolute;
  right: 33%;
  top: 20%;
  display: grid;
  width: 122px;
  height: 122px;
  place-items: center;
  border: 1px solid rgba(214, 168, 79, 0.34);
  border-radius: 50%;
  color: rgba(214, 168, 79, 0.78);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-weight: 950;
  background:
    linear-gradient(60deg, transparent 0 48%, rgba(214, 168, 79, 0.32) 49%, transparent 51%),
    linear-gradient(-60deg, transparent 0 48%, rgba(214, 168, 79, 0.32) 49%, transparent 51%),
    radial-gradient(circle, transparent 0 52%, rgba(214, 168, 79, 0.14) 53% 55%, transparent 56%);
  transform: rotate(calc(var(--px) * 36deg)) translate3d(0, calc(var(--scroll) * -0.05px), 0);
  opacity: 0.6;
  animation: pfSigilPulse 4.8s ease-in-out infinite alternate;
}

.pf-curseHud {
  position: absolute;
  right: clamp(1rem, 4vw, 4rem);
  top: clamp(6rem, 20vh, 14rem);
  z-index: 3;
  width: min(300px, 26vw);
  border: 1px solid rgba(215, 255, 69, 0.34);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(135deg, rgba(215, 255, 69, 0.12), transparent 36%, rgba(255, 79, 216, 0.12)),
    rgba(5, 8, 7, 0.58);
  padding: 0.85rem;
  color: var(--pf-ink);
  box-shadow:
    0 18px 60px rgba(0, 0, 0, 0.36),
    0 0 36px rgba(215, 255, 69, 0.1);
  backdrop-filter: blur(14px);
  transform:
    translate3d(calc(var(--px) * -26px), calc(var(--scroll) * -0.08px), 0)
    rotate(2.4deg);
  animation: pfHudFloat 5.5s ease-in-out infinite alternate, pfFlicker 6.2s steps(1) infinite;
}

.pf-curseHud::before {
  content: "";
  position: absolute;
  inset: -7px;
  z-index: -1;
  border: 1px solid rgba(255, 79, 216, 0.2);
  border-radius: var(--pf-radius);
  transform: rotate(-2.2deg);
}

.pf-hudTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.pf-hudTop span {
  color: var(--pf-muted);
  font-size: 0.74rem;
  font-weight: 950;
}

.pf-hudTop b {
  color: var(--pf-acid);
  font-size: 1rem;
  text-shadow: 0 0 18px rgba(215, 255, 69, 0.42);
}

.pf-hudMeter {
  height: 12px;
  overflow: hidden;
  border: 1px solid rgba(215, 255, 69, 0.26);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.38);
}

.pf-hudMeter span {
  display: block;
  width: 82%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--pf-acid), var(--pf-pink), var(--pf-cyan));
  box-shadow: 0 0 18px rgba(215, 255, 69, 0.34);
  animation: pfMeterPulse 2.5s ease-in-out infinite alternate;
}

.pf-hudGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.42rem;
  margin: 0.75rem 0;
}

.pf-hudGrid span {
  display: grid;
  min-height: 58px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--pf-radius);
  background: rgba(255, 255, 255, 0.055);
  color: var(--pf-muted);
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
}

.pf-hudGrid b {
  color: var(--pf-ink);
  font-size: 1.05rem;
}

.pf-curseHud p {
  margin: 0;
  color: #dfe7d6;
  font-size: 0.82rem;
  font-weight: 850;
}

.pf-portraitField {
  position: absolute;
  right: max(-80px, -5vw);
  top: 0;
  z-index: 0;
  width: min(48vw, 620px);
  height: 100%;
  min-height: 650px;
  opacity: 0.9;
  pointer-events: none;
  transform:
    translate3d(calc(var(--px) * -28px), calc(var(--scroll) * -0.16px), 0)
    rotateX(var(--tilt-y))
    rotateY(var(--tilt-x));
  transform-origin: center;
}

.pf-portraitField::before {
  content: "";
  position: absolute;
  inset: 7rem 10% auto auto;
  width: min(28vw, 360px);
  height: min(28vw, 360px);
  border: 1px solid rgba(255, 24, 56, 0.22);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(90deg, transparent 0 48%, rgba(255, 24, 56, 0.18) 48% 52%, transparent 52%),
    linear-gradient(0deg, transparent 0 48%, rgba(255, 79, 216, 0.18) 48% 52%, transparent 52%);
  transform: rotate(9deg);
  animation: pfFramePulse 4.8s ease-in-out infinite alternate, pfHauntedShake 2.8s steps(2) infinite;
}

.pf-portrait {
  position: absolute;
  right: 0;
  bottom: 0;
  width: min(43vw, 560px);
  height: min(72svh, 650px);
  object-fit: cover;
  object-position: center top;
  clip-path: polygon(14% 0, 100% 0, 100% 100%, 0 100%, 0 14%);
  filter: saturate(0.78) contrast(1.18) brightness(0.58) hue-rotate(68deg);
  box-shadow:
    -26px 0 0 rgba(255, 24, 56, 0.08),
    -48px 28px 0 rgba(255, 79, 216, 0.09),
    0 0 64px rgba(0, 0, 0, 0.64);
  animation: pfPortraitHaunt 6s ease-in-out infinite alternate, pfFlicker 4.1s steps(1) infinite;
}

.pf-codeTile {
  position: absolute;
  right: min(30vw, 360px);
  bottom: clamp(2rem, 8vh, 5rem);
  width: min(390px, 36vw);
  border: 1px solid rgba(255, 24, 56, 0.24);
  border-radius: var(--pf-radius);
  background: rgba(8, 12, 9, 0.86);
  color: #f4f7f5;
  box-shadow: var(--pf-shadow);
  overflow: hidden;
  backdrop-filter: blur(14px);
  transform: translate3d(calc(var(--px) * -42px), calc(var(--scroll) * -0.24px), 0);
  animation: pfCandleSwing 4.2s ease-in-out infinite alternate, pfFlicker 3.1s steps(1) infinite;
}

.pf-codeTile::before,
.pf-terminal::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent 0 13px, rgba(255, 255, 255, 0.035) 13px 14px);
  animation: pfScan 2.4s linear infinite;
}

.pf-codeTile header,
.pf-terminal header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.72rem 0.85rem;
  color: #bdc7bd;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.pf-dots {
  display: inline-flex;
  gap: 0.35rem;
}

.pf-dots i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.pf-dots i:nth-child(1) {
  background: var(--pf-coral);
}

.pf-dots i:nth-child(2) {
  background: var(--pf-gold);
}

.pf-dots i:nth-child(3) {
  background: var(--pf-green);
}

.pf-codeTile pre,
.pf-terminal pre {
  position: relative;
  margin: 0;
  padding: 1rem;
  overflow: hidden;
  color: #eef6ef;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.86rem;
  line-height: 1.72;
  white-space: pre-wrap;
}

.pf-codeKey {
  color: #b7ffc9;
}

.pf-codeValue {
  color: #d6a84f;
}

.pf-codeFn {
  color: #9dbdff;
}

.pf-heroContent {
  position: relative;
  z-index: 2;
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 5.5rem 0 3.4rem;
  transform: translate3d(0, calc(var(--scroll) * -0.06px), 0);
}

.pf-heroContent::before {
  content: "RED ALERT JOURNEY";
  position: absolute;
  left: -0.2rem;
  top: 3.6rem;
  color: rgba(255, 24, 56, 0.13);
  font-size: 4.4rem;
  font-weight: 1000;
  line-height: 1;
  pointer-events: none;
  transform: rotate(-2deg);
  -webkit-text-stroke: 1px rgba(255, 24, 56, 0.18);
}

.pf-statusStrip {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0 0 1rem;
}

.pf-statusStrip span {
  display: inline-grid;
  min-height: 28px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(90deg, rgba(255, 79, 216, 0.11), transparent 42%, rgba(215, 255, 69, 0.1)),
    rgba(255, 255, 255, 0.052);
  padding: 0 0.6rem;
  color: var(--pf-muted);
  font-size: 0.76rem;
  font-weight: 900;
  animation: pfChipFloat 4.4s ease-in-out infinite alternate, pfFlicker 4.7s steps(1) infinite;
}

.pf-statusStrip span:nth-child(2) {
  animation-delay: -1.2s;
  color: var(--pf-gold);
}

.pf-statusStrip span:nth-child(3) {
  animation-delay: -2.4s;
  color: var(--pf-green);
}

.pf-statusStrip span:nth-child(4) {
  animation-delay: -3.1s;
  color: var(--pf-blue);
}

.pf-superLabel {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 0.95rem;
  transform: rotate(-2deg);
}

.pf-superLabel span {
  display: inline-grid;
  min-height: 34px;
  place-items: center;
  border: 1px solid rgba(255, 79, 216, 0.55);
  border-radius: var(--pf-radius);
  background: rgba(255, 79, 216, 0.16);
  padding: 0 0.7rem;
  color: var(--pf-pink);
  font-weight: 1000;
  animation: pfHauntedShake 2.2s steps(2) infinite;
}

.pf-superLabel b {
  display: inline-grid;
  min-height: 34px;
  place-items: center;
  border: 1px solid rgba(215, 255, 69, 0.38);
  border-radius: var(--pf-radius);
  background: rgba(215, 255, 69, 0.09);
  padding: 0 0.7rem;
  color: var(--pf-acid);
  font-size: 0.78rem;
  text-transform: uppercase;
}

.pf-eyebrow,
.pf-sectionKicker {
  color: var(--pf-acid);
  font-size: 0.84rem;
  font-weight: 950;
  letter-spacing: 0;
  text-transform: uppercase;
}

.pf-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 1.1rem;
}

.pf-eyebrow::before {
  content: "";
  width: 34px;
  height: 2px;
  background: currentColor;
  box-shadow: 0 0 16px currentColor;
}

.pf-root h1,
.pf-root h2,
.pf-root h3,
.pf-root p {
  margin-top: 0;
}

.pf-root h1 {
  position: relative;
  display: grid;
  max-width: 810px;
  margin-bottom: 1.05rem;
  color: var(--pf-ink);
  font-size: 7.6rem;
  line-height: 0.9;
  letter-spacing: 0;
  text-wrap: balance;
  text-shadow:
    2px 2px 0 rgba(215, 255, 69, 0.5),
    -2px 0 0 rgba(255, 79, 216, 0.46),
    0 0 46px rgba(85, 247, 255, 0.18);
  animation: pfTitleGlitch 6.8s steps(1) infinite, pfTitleVibrate 2.7s steps(2) infinite;
}

.pf-root h1::before,
.pf-root h1::after {
  content: attr(data-text);
  position: absolute;
  inset: 0 auto auto 0;
  z-index: -1;
  color: transparent;
  pointer-events: none;
}

.pf-root h1::before {
  -webkit-text-stroke: 1px rgba(215, 255, 69, 0.6);
  transform: translate3d(calc(var(--px) * 14px), -7px, 0);
  clip-path: polygon(0 0, 100% 0, 100% 44%, 0 28%);
}

.pf-root h1::after {
  -webkit-text-stroke: 1px rgba(255, 79, 216, 0.6);
  transform: translate3d(calc(var(--px) * -14px), 8px, 0);
  clip-path: polygon(0 55%, 100% 38%, 100% 100%, 0 100%);
}

.pf-root h1 span {
  display: block;
  transform: skewX(-3deg);
}

.pf-root h1 span:nth-child(2) {
  transform: translateX(0.08em) skewX(3deg);
}

.pf-lede {
  max-width: 660px;
  margin-bottom: 1.7rem;
  color: #d6d4c5;
  font-size: 1.32rem;
}

.pf-heroActions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.4rem;
}

.pf-primaryButton,
.pf-secondaryButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.48rem;
  min-height: 48px;
  border-radius: var(--pf-radius);
  padding: 0 1.05rem;
  font-weight: 950;
  white-space: nowrap;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, color 180ms ease;
}

.pf-root .pf-primaryButton {
  border: 1px solid rgba(215, 255, 69, 0.82);
  background:
    linear-gradient(135deg, rgba(215, 255, 69, 0.3), rgba(255, 79, 216, 0.2), rgba(85, 247, 255, 0.14)),
    rgba(255, 255, 255, 0.06);
  color: white;
  box-shadow:
    0 12px 0 rgba(0, 0, 0, 0.34),
    0 0 24px rgba(215, 255, 69, 0.24);
  animation: pfFlicker 5.1s steps(1) infinite;
}

.pf-primaryButton:hover,
.pf-secondaryButton:hover {
  transform: translateY(-2px) rotate(-1deg);
  animation: pfButtonPanic 300ms steps(2) infinite;
}

.pf-root .pf-secondaryButton {
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.055);
  color: var(--pf-ink);
}

.pf-secondaryButton:hover {
  border-color: rgba(214, 168, 79, 0.7);
  color: var(--pf-gold);
}

.pf-searchShell {
  position: relative;
  width: min(620px, 100%);
  margin: 1.4rem 0 1.5rem;
}

.pf-searchBox {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 58px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(90deg, rgba(215, 255, 69, 0.09), transparent 52%, rgba(255, 79, 216, 0.1)),
    rgba(255, 255, 255, 0.065);
  padding: 0.35rem 0.55rem 0.35rem 1rem;
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
}

.pf-searchBox input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--pf-ink);
  font-weight: 760;
}

.pf-searchBox input::placeholder {
  color: #9ba49f;
}

.pf-searchSubmit {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: var(--pf-radius);
  background: var(--pf-acid);
  color: #08100d;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(215, 255, 69, 0.32);
}

.pf-results {
  position: absolute;
  inset: calc(100% + 8px) 0 auto;
  z-index: 20;
  display: none;
  overflow: hidden;
  border: 1px solid var(--pf-line);
  border-radius: var(--pf-radius);
  background: rgba(13, 17, 16, 0.96);
  box-shadow: var(--pf-shadow);
  backdrop-filter: blur(18px);
}

.pf-results.isOpen {
  display: block;
}

.pf-commandItem {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.pf-commandItem:last-child {
  border-bottom: 0;
}

.pf-commandItem strong {
  display: block;
  color: var(--pf-ink);
  font-size: 0.95rem;
}

.pf-commandItem span span {
  display: block;
  color: var(--pf-muted);
  font-size: 0.82rem;
  font-weight: 780;
}

.pf-commandItem:hover {
  background: rgba(255, 24, 56, 0.08);
}

.pf-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  max-width: 600px;
}

.pf-fact {
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  min-height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: var(--pf-radius);
  background: rgba(255, 255, 255, 0.06);
  padding: 0 0.78rem;
  color: #d8dfdb;
  font-size: 0.88rem;
  font-weight: 860;
}

.pf-fact b {
  color: var(--pf-gold);
}

.pf-miniConsole {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: min(520px, 100%);
  min-height: 42px;
  margin-top: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--pf-radius);
  background:
    repeating-linear-gradient(90deg, transparent 0 18px, rgba(214, 168, 79, 0.055) 18px 19px),
    rgba(255, 255, 255, 0.055);
  padding: 0 0.75rem;
  color: var(--pf-muted);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.82rem;
  transform: translate3d(calc(var(--px) * 10px), 0, 0) rotate(-1deg);
  animation: pfHauntedShake 3.2s steps(2) infinite;
}

.pf-miniConsole strong {
  color: var(--pf-ink);
}

.pf-miniConsole i {
  margin-left: auto;
  color: var(--pf-green);
  font-style: normal;
  font-weight: 950;
  animation: pfBlink 1s steps(1) infinite;
}

.pf-vibeStrip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-width: 660px;
  margin-top: 1rem;
}

.pf-vibeStrip span {
  display: inline-grid;
  min-height: 34px;
  place-items: center;
  border: 1px solid rgba(215, 255, 69, 0.26);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(135deg, rgba(215, 255, 69, 0.16), rgba(255, 79, 216, 0.08)),
    rgba(0, 0, 0, 0.22);
  padding: 0 0.78rem;
  color: var(--pf-ink);
  font-size: 0.8rem;
  font-weight: 950;
  text-transform: uppercase;
  transform: rotate(-1.6deg);
  box-shadow: 0 0 22px rgba(215, 255, 69, 0.08);
}

.pf-vibeStrip span:nth-child(2) {
  border-color: rgba(255, 79, 216, 0.32);
  color: var(--pf-pink);
  transform: rotate(1.7deg);
}

.pf-vibeStrip span:nth-child(3) {
  border-color: rgba(85, 247, 255, 0.3);
  color: var(--pf-cyan);
  transform: rotate(-0.8deg);
}

.pf-ticker {
  position: relative;
  z-index: 2;
  overflow: hidden;
  border-top: 1px solid var(--pf-line);
  border-bottom: 1px solid var(--pf-line);
  background:
    repeating-linear-gradient(90deg, rgba(215, 255, 69, 0.1) 0 18px, rgba(255, 79, 216, 0.07) 18px 36px, rgba(85, 247, 255, 0.07) 36px 54px),
    rgba(255, 255, 255, 0.032);
  transform: rotate(-0.6deg);
}

.pf-ticker div {
  display: flex;
  width: max-content;
  animation: pfTicker 24s linear infinite;
}

.pf-ticker div:nth-child(2) {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  animation-direction: reverse;
  animation-duration: 30s;
}

.pf-ticker span {
  display: inline-flex;
  align-items: center;
  min-height: 60px;
  padding: 0 2rem;
  color: var(--pf-ink);
  font-weight: 950;
}

.pf-ticker span::before {
  content: "";
  width: 9px;
  height: 9px;
  margin-right: 1rem;
  background: var(--pf-green);
  box-shadow: 0 0 14px var(--pf-green);
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  animation: pfFlicker 2.8s steps(1) infinite;
}

.pf-ticker span:nth-child(3n)::before {
  background: var(--pf-coral);
}

.pf-ticker span:nth-child(4n)::before {
  background: var(--pf-gold);
}

.pf-section {
  position: relative;
  z-index: 2;
  padding: 5rem 0;
  background:
    linear-gradient(180deg, rgba(4, 8, 9, 0.92), rgba(9, 11, 8, 0.98)),
    repeating-linear-gradient(90deg, rgba(214, 168, 79, 0.035) 0 1px, transparent 1px 74px);
}

.pf-section::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse at 8% 8%, rgba(214, 168, 79, 0.12), transparent 32%),
    linear-gradient(100deg, transparent 0 18%, rgba(255, 24, 56, 0.065) 18% 19%, transparent 19% 53%, rgba(255, 79, 216, 0.07) 53% 54%, transparent 54%),
    repeating-linear-gradient(90deg, transparent 0 78px, rgba(255, 255, 255, 0.025) 78px 79px, transparent 79px 156px);
  transform: translate3d(0, calc(var(--scroll) * -0.025px), 0);
  pointer-events: none;
}

.pf-sectionAlt {
  border-top: 1px solid var(--pf-line);
  border-bottom: 1px solid var(--pf-line);
  background:
    linear-gradient(180deg, rgba(13, 9, 7, 0.94), rgba(4, 8, 9, 0.98)),
    repeating-linear-gradient(135deg, transparent 0 34px, rgba(214, 168, 79, 0.035) 34px 35px, transparent 35px 70px);
}

.pf-root #projects {
  padding-top: 3.2rem;
}

.pf-container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.pf-sectionHead {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 2.6rem;
}

.pf-sectionKicker {
  margin: 0 0 0.35rem;
  color: var(--pf-coral);
}

.pf-root h2 {
  margin-bottom: 0;
  font-size: 3.8rem;
  line-height: 0.98;
  letter-spacing: 0;
  text-wrap: balance;
}

.pf-sectionHead > p {
  max-width: 440px;
  margin-bottom: 0;
  color: var(--pf-muted);
  font-weight: 720;
}

.pf-routeGrid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.9rem;
  margin-bottom: 3.3rem;
}

.pf-routeTile {
  position: relative;
  display: grid;
  min-height: 122px;
  border: 1px solid rgba(214, 168, 79, 0.24);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(180deg, rgba(31, 20, 14, 0.94), rgba(10, 11, 9, 0.9)),
    radial-gradient(circle at 18% 20%, rgba(255, 79, 216, 0.14), transparent 24%),
    repeating-linear-gradient(90deg, rgba(214, 168, 79, 0.1) 0 1px, transparent 1px 28px);
  padding: 1rem;
  overflow: hidden;
  box-shadow:
    inset 0 0 34px rgba(0, 0, 0, 0.34),
    0 12px 28px rgba(0, 0, 0, 0.2);
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.pf-routeTile::after {
  content: "";
  position: absolute;
  right: 0.85rem;
  top: 0.82rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--pf-acid);
  box-shadow: 0 0 18px rgba(215, 255, 69, 0.72);
}

.pf-routeTile::before,
.pf-projectCard::before,
.pf-stackCard::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 0 34%, rgba(255, 255, 255, 0.12) 47%, transparent 60%);
  transform: translateX(-120%);
  transition: transform 520ms ease;
}

.pf-routeTile:hover,
.pf-stackCard:hover {
  transform: translate3d(0, -5px, 0) rotateX(2deg) rotateZ(-0.4deg);
  border-color: rgba(214, 168, 79, 0.54);
  box-shadow:
    0 22px 52px rgba(0, 0, 0, 0.28),
    0 0 26px rgba(214, 168, 79, 0.16);
}

.pf-projectCard:hover {
  transform: translate3d(0, -12px, 0) rotateX(5deg) rotateZ(-0.6deg);
  border-color: rgba(255, 24, 56, 0.44);
  box-shadow:
    0 28px 70px rgba(0, 0, 0, 0.34),
    0 0 36px rgba(255, 24, 56, 0.13);
}

.pf-routeTile:hover::before,
.pf-projectCard:hover::before,
.pf-stackCard:hover::before {
  transform: translateX(120%);
}

.pf-routeTile img {
  width: 34px;
  height: 34px;
  object-fit: contain;
  filter: saturate(1.2);
}

.pf-routeTile strong {
  align-self: end;
  color: var(--pf-ink);
  font-size: 1.02rem;
}

.pf-routeTile span {
  color: var(--pf-muted);
  font-size: 0.8rem;
  font-weight: 780;
}

.pf-projectGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.pf-projectCard {
  --tone: var(--pf-green);
  --tone-soft: rgba(255, 24, 56, 0.13);
  position: relative;
  display: grid;
  min-height: 330px;
  border: 1px solid rgba(214, 168, 79, 0.26);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(180deg, rgba(32, 21, 14, 0.94), rgba(7, 9, 8, 0.96)),
    radial-gradient(circle at 16% 13%, rgba(255, 79, 216, 0.1), transparent 28%),
    radial-gradient(circle at 84% 22%, rgba(85, 247, 255, 0.1), transparent 24%),
    repeating-linear-gradient(90deg, rgba(214, 168, 79, 0.08) 0 1px, transparent 1px 38px);
  overflow: hidden;
  box-shadow:
    inset 0 0 48px rgba(0, 0, 0, 0.4),
    0 12px 32px rgba(0, 0, 0, 0.2);
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.pf-projectCard::after {
  content: attr(data-index);
  position: absolute;
  right: 0.85rem;
  top: 0.65rem;
  z-index: 2;
  color: rgba(242, 240, 223, 0.08);
  font-size: 4.4rem;
  font-weight: 1000;
  line-height: 1;
  text-shadow: 0 0 22px rgba(255, 24, 56, 0.12);
  transform: rotate(7deg);
  animation: pfNumberFloat 4s ease-in-out infinite alternate;
}

.pf-projectCard:nth-child(odd) {
  transform: translateY(18px) rotate(-1deg);
}

.pf-projectCard:nth-child(even) {
  transform: rotate(1deg);
}

.pf-projectVisual {
  position: relative;
  min-height: 150px;
  border-bottom: 1px solid rgba(214, 168, 79, 0.18);
  clip-path: polygon(0 24%, 8% 24%, 8% 9%, 50% 0, 92% 9%, 92% 24%, 100% 24%, 100% 100%, 0 100%);
  overflow: hidden;
  background: #141716;
}

.pf-projectVisual::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 32%, rgba(0, 0, 0, 0.64)),
    linear-gradient(135deg, color-mix(in srgb, var(--tone) 34%, transparent), transparent 48%);
  z-index: 1;
}

.pf-projectVisual img {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
  filter: saturate(0.95) contrast(1.06);
  transform: scale(1.02);
  transition: transform 220ms ease, filter 220ms ease;
}

.pf-projectCard:hover .pf-projectVisual img {
  filter: saturate(1.1) contrast(1.12);
  transform: scale(1.08);
}

.pf-tone-green {
  --tone: var(--pf-green);
  --tone-soft: rgba(255, 24, 56, 0.18);
}

.pf-tone-blue {
  --tone: var(--pf-blue);
  --tone-soft: rgba(139, 182, 255, 0.18);
}

.pf-tone-gold {
  --tone: var(--pf-gold);
  --tone-soft: rgba(214, 168, 79, 0.18);
}

.pf-tone-coral {
  --tone: var(--pf-coral);
  --tone-soft: rgba(255, 79, 216, 0.18);
}

.pf-tone-violet {
  --tone: var(--pf-violet);
  --tone-soft: rgba(177, 156, 255, 0.18);
}

.pf-tone-mint {
  --tone: var(--pf-mint);
  --tone-soft: rgba(125, 244, 223, 0.18);
}

.pf-projectBody {
  display: grid;
  align-content: start;
  gap: 0.85rem;
  padding: 1rem;
}

.pf-projectMeta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--pf-muted);
  font-size: 0.77rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.pf-projectCard h3 {
  margin-bottom: 0;
  color: var(--pf-ink);
  font-size: 1.18rem;
  line-height: 1.2;
}

.pf-projectCard p {
  margin-bottom: 0;
  color: #c4ccc8;
  font-size: 0.95rem;
  font-weight: 620;
}

.pf-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.pf-chip {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--pf-radius);
  background: rgba(255, 255, 255, 0.06);
  padding: 0 0.55rem;
  color: #e1e7e3;
  font-size: 0.78rem;
  font-weight: 850;
}

.pf-stackLayout {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 2rem;
  align-items: start;
}

.pf-terminal {
  position: sticky;
  top: 96px;
  border: 1px solid rgba(214, 168, 79, 0.28);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(180deg, rgba(34, 22, 14, 0.92), rgba(8, 12, 9, 0.92)),
    repeating-linear-gradient(90deg, transparent 0 42px, rgba(214, 168, 79, 0.06) 42px 43px, transparent 43px 84px);
  color: #f4f7f5;
  overflow: hidden;
  box-shadow: var(--pf-shadow);
  backdrop-filter: blur(14px);
  transform: translate3d(0, calc(var(--scroll) * -0.018px), 0);
  animation: pfFlicker 5.6s steps(1) infinite;
}

.pf-terminal pre {
  overflow-x: auto;
  padding: 1.2rem;
}

.pf-stackList {
  display: grid;
  gap: 0.85rem;
}

.pf-stackCard {
  position: relative;
  border: 1px solid rgba(214, 168, 79, 0.22);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(90deg, rgba(214, 168, 79, 0.08), transparent 60%, rgba(255, 24, 56, 0.045)),
    linear-gradient(180deg, rgba(24, 17, 12, 0.9), rgba(8, 11, 9, 0.9));
  padding: 1rem;
  overflow: hidden;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.pf-stackCard h3 {
  margin-bottom: 0.8rem;
  color: var(--pf-ink);
  font-size: 1rem;
}

.pf-timeline {
  display: grid;
  gap: 1rem;
}

.pf-timelineItem {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 1rem;
  border: 1px solid rgba(214, 168, 79, 0.18);
  border-radius: var(--pf-radius);
  background:
    linear-gradient(90deg, rgba(214, 168, 79, 0.08), transparent 34%),
    rgba(255, 255, 255, 0.035);
  padding: 1rem;
  box-shadow: inset 0 0 28px rgba(0, 0, 0, 0.18);
}

.pf-timelineItem time {
  color: var(--pf-green);
  font-weight: 950;
  text-shadow: 0 0 16px rgba(255, 24, 56, 0.22);
}

.pf-timelineItem h3 {
  margin-bottom: 0.35rem;
  color: var(--pf-ink);
  font-size: 1.12rem;
}

.pf-timelineItem p {
  margin-bottom: 0;
  color: var(--pf-muted);
  font-weight: 680;
}

.pf-contact {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  border: 1px solid rgba(214, 168, 79, 0.34);
  border-radius: var(--pf-radius);
  background:
    radial-gradient(circle at 92% 34%, rgba(247, 133, 42, 0.22), transparent 28%),
    linear-gradient(105deg, rgba(214, 168, 79, 0.18), transparent 32%, rgba(255, 79, 216, 0.16)),
    linear-gradient(180deg, rgba(27, 17, 11, 0.9), rgba(7, 10, 9, 0.92));
  padding: 2rem;
  box-shadow:
    0 14px 0 rgba(0, 0, 0, 0.22),
    0 0 42px rgba(214, 168, 79, 0.1);
  transform: translate3d(0, calc(var(--scroll) * -0.014px), 0);
  animation: pfRoomPulse 6.2s steps(1) infinite;
}

.pf-contact h2 {
  max-width: 720px;
}

.pf-contactActions {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: 0.65rem;
}

.pf-footer {
  position: relative;
  z-index: 2;
  padding: 1.7rem 0 2.2rem;
  border-top: 1px solid var(--pf-line);
  color: var(--pf-muted);
  font-size: 0.9rem;
  font-weight: 760;
}

.pf-footer .pf-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.pf-commandDialog {
  width: min(680px, calc(100% - 28px));
  border: 1px solid rgba(255, 24, 56, 0.26);
  border-radius: var(--pf-radius);
  background: rgba(13, 17, 16, 0.96);
  color: var(--pf-ink);
  padding: 0;
  box-shadow: var(--pf-shadow);
  backdrop-filter: blur(18px);
}

.pf-commandDialog::backdrop {
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(8px);
}

.pf-dialogHead {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid var(--pf-line);
  padding: 0.9rem;
}

.pf-dialogHead input {
  flex: 1;
  min-height: 44px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--pf-ink);
  font-weight: 820;
}

.pf-dialogList {
  display: grid;
  max-height: min(480px, 70svh);
  overflow: auto;
  padding: 0.5rem;
}

.pf-dialogList .pf-commandItem {
  border-bottom: 0;
  border-radius: var(--pf-radius);
}

.pf-reveal {
  opacity: 0;
  transform: translate3d(0, 28px, 0);
  transition:
    opacity 650ms ease var(--delay, 0ms),
    transform 650ms ease var(--delay, 0ms);
}

.pf-reveal.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.pf-projectCard.pf-reveal.is-visible:nth-child(odd) {
  transform: translateY(18px) rotate(-1deg);
}

.pf-projectCard.pf-reveal.is-visible:nth-child(even) {
  transform: rotate(1deg);
}

.pf-projectCard.pf-reveal.is-visible:hover {
  transform: translate3d(0, -12px, 0) rotateX(5deg) rotateZ(-0.6deg);
}

@keyframes pfRailFlow {
  0% {
    background-position: -260px 0;
    opacity: 0.2;
  }
  45% {
    opacity: 0.95;
  }
  100% {
    background-position: 260px 0;
    opacity: 0.2;
  }
}

@keyframes pfWireDrift {
  from {
    transform: translate3d(-10px, -8px, 0) rotate(-7deg);
  }
  to {
    transform: translate3d(14px, 11px, 0) rotate(10deg);
  }
}

@keyframes pfFramePulse {
  from {
    box-shadow: 0 0 0 rgba(255, 24, 56, 0);
  }
  to {
    box-shadow: 0 0 44px rgba(255, 24, 56, 0.15);
  }
}

@keyframes pfScan {
  to {
    transform: translateY(14px);
  }
}

@keyframes pfChipFloat {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-6px);
  }
}

@keyframes pfTitleGlitch {
  0%, 91%, 100% {
    text-shadow:
      1px 1px 0 rgba(255, 24, 56, 0.42),
      -1px 0 0 rgba(255, 79, 216, 0.44),
      0 0 46px rgba(255, 24, 56, 0.18);
  }
  92% {
    text-shadow:
      5px 0 0 rgba(255, 24, 56, 0.52),
      -4px 0 0 rgba(255, 79, 216, 0.54);
  }
  93% {
    text-shadow:
      -3px 0 0 rgba(139, 182, 255, 0.52),
      3px 0 0 rgba(214, 168, 79, 0.48);
  }
}

@keyframes pfTicker {
  to {
    transform: translateX(-50%);
  }
}

@keyframes pfBarPulse {
  from {
    transform: scaleX(0.78);
    opacity: 0.66;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

@keyframes pfStickerPop {
  from {
    transform: translate3d(0, 0, 0) rotate(-9deg);
  }
  to {
    transform: translate3d(6px, -9px, 0) rotate(7deg);
  }
}

@keyframes pfTapeSlide {
  from {
    transform: translate3d(-14px, 0, 0) skewX(-24deg) rotate(-3deg);
  }
  to {
    transform: translate3d(20px, -12px, 0) skewX(-24deg) rotate(4deg);
  }
}

@keyframes pfBlink {
  0%, 55% {
    opacity: 1;
  }
  56%, 100% {
    opacity: 0.25;
  }
}

@keyframes pfFogDrift {
  from {
    opacity: 0.62;
    filter: contrast(1);
  }
  to {
    opacity: 0.86;
    filter: contrast(1.18);
  }
}

@keyframes pfStaticJolt {
  0%, 78%, 100% {
    opacity: 0.46;
  }
  79% {
    opacity: 0.68;
    transform: translate3d(calc(var(--px) * 25px), calc(var(--scroll) * -0.06px - 2px), 0);
  }
  80% {
    opacity: 0.38;
  }
}

@keyframes pfRoomPulse {
  0%, 88%, 100% {
    filter: brightness(1);
  }
  89% {
    filter: brightness(1.35);
  }
  90% {
    filter: brightness(0.74);
  }
}

@keyframes pfHauntedShake {
  0%, 76%, 100% {
    translate: 0 0;
  }
  77% {
    translate: -2px 1px;
  }
  78% {
    translate: 2px -1px;
  }
  79% {
    translate: -1px 0;
  }
}

@keyframes pfTitleVibrate {
  0%, 70%, 100% {
    translate: 0 0;
  }
  72% {
    translate: -2px 1px;
  }
  74% {
    translate: 2px -1px;
  }
  76% {
    translate: -1px 0;
  }
}

@keyframes pfButtonPanic {
  0%, 100% {
    translate: 0 0;
  }
  50% {
    translate: 2px -1px;
  }
}

@keyframes pfCursorPulse {
  from {
    opacity: 0.64;
  }
  to {
    opacity: 1;
  }
}

@keyframes pfFlicker {
  0%, 72%, 100% {
    filter: brightness(1);
  }
  73% {
    filter: brightness(1.35);
  }
  74% {
    filter: brightness(0.74);
  }
  76% {
    filter: brightness(1.12);
  }
}

@keyframes pfWordHaunt {
  0%, 81%, 100% {
    opacity: 0.7;
  }
  82% {
    opacity: 0.22;
  }
  83% {
    opacity: 0.9;
  }
}

@keyframes pfDoorCreak {
  from {
    filter: brightness(0.82);
  }
  to {
    filter: brightness(1.1);
  }
}

@keyframes pfCrackBlink {
  0%, 64%, 100% {
    opacity: 0.42;
  }
  65% {
    opacity: 0.96;
  }
  66% {
    opacity: 0.18;
  }
}

@keyframes pfPortraitHaunt {
  from {
    opacity: 0.58;
  }
  to {
    opacity: 0.82;
  }
}

@keyframes pfCandleSwing {
  from {
    rotate: -0.8deg;
  }
  to {
    rotate: 1.2deg;
  }
}

@keyframes pfNumberFloat {
  from {
    translate: 0 0;
  }
  to {
    translate: -6px 7px;
  }
}

@keyframes pfLanternBreath {
  from {
    opacity: 0.52;
    scale: 0.92;
  }
  to {
    opacity: 0.92;
    scale: 1.08;
  }
}

@keyframes pfMansionBreathe {
  from {
    filter: saturate(1.04) contrast(1.05) brightness(0.72);
  }
  to {
    filter: saturate(1.18) contrast(1.15) brightness(0.86);
  }
}

@keyframes pfWebStrand {
  from {
    opacity: 0.28;
    filter: blur(0);
  }
  to {
    opacity: 0.68;
    filter: blur(0.8px);
  }
}

@keyframes pfDriftShape {
  from {
    transform: translate3d(-10px, 14px, 0) rotate(-8deg);
  }
  to {
    transform: translate3d(18px, -18px, 0) rotate(8deg);
  }
}

@keyframes pfPumpkinGlow {
  0%, 70%, 100% {
    filter: brightness(1);
  }
  71% {
    filter: brightness(1.38);
  }
  73% {
    filter: brightness(0.76);
  }
}

@keyframes pfSigilPulse {
  from {
    opacity: 0.24;
  }
  to {
    opacity: 0.68;
  }
}

@keyframes pfHudFloat {
  from {
    translate: 0 -8px;
  }
  to {
    translate: 10px 10px;
  }
}

@keyframes pfMeterPulse {
  from {
    width: 62%;
    filter: saturate(1);
  }
  to {
    width: 92%;
    filter: saturate(1.5);
  }
}

@media (max-width: 980px) {
  .pf-navLinks .pf-navLink {
    display: none;
  }

  .pf-journeyControls {
    right: auto;
    top: calc(100svh - 154px);
    bottom: auto;
    left: 50%;
    width: min(100% - 22px, 560px);
    grid-template-columns: 48px minmax(88px, 0.58fr) minmax(0, 1fr) 48px;
    align-items: center;
    gap: 0.42rem;
    padding: 0.42rem;
    border: 1px solid rgba(255, 24, 56, 0.36);
    border-radius: var(--pf-radius-lg);
    background:
      linear-gradient(90deg, rgba(255, 24, 56, 0.16), rgba(5, 2, 3, 0.84), rgba(215, 255, 69, 0.08)),
      rgba(8, 1, 2, 0.84);
    box-shadow:
      0 -16px 42px rgba(0, 0, 0, 0.38),
      0 0 30px rgba(255, 24, 56, 0.18);
    backdrop-filter: blur(16px) saturate(1.2);
    transform: translateX(-50%);
  }

  .pf-journeyArrow {
    width: 46px;
    height: 46px;
  }

  .pf-journeyReadout {
    min-height: 46px;
  }

  .pf-journeyReadout b {
    font-size: 1.05rem;
  }

  .pf-journeyDots {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.28rem;
  }

  .pf-journeyDots button {
    width: 100%;
    height: 34px;
  }

  .pf-mansionScene img {
    object-position: 62% center;
  }

  .pf-portraitField {
    right: -160px;
    width: 72vw;
    opacity: 0.22;
  }

  .pf-portraitField::before,
  .pf-codeTile {
    display: none;
  }

  .pf-curseHud {
    display: none;
  }

  .pf-heroContent {
    padding-top: 4rem;
  }

  .pf-root h1 {
    max-width: 720px;
    font-size: 5.8rem;
  }

  .pf-routeGrid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .pf-projectGrid,
  .pf-stackLayout {
    grid-template-columns: 1fr;
  }

  .pf-terminal {
    position: relative;
    top: auto;
  }

  .pf-contact {
    grid-template-columns: 1fr;
  }

  .pf-contactActions {
    justify-content: start;
  }
}

@media (max-width: 640px) {
  .pf-cursor {
    display: none;
  }

  .pf-nav {
    width: min(100% - 22px, 1180px);
    min-height: 62px;
  }

  .pf-brand span:not(.pf-brandMark) {
    display: none;
  }

  .pf-textButton {
    min-width: 42px;
    padding: 0;
  }

  .pf-textButton span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .pf-signalCanvas {
    opacity: 0.28;
  }

  .pf-motionRails i,
  .pf-motionRails span:nth-child(2),
  .pf-motionRails span:nth-child(4) {
    display: none;
  }

  .pf-mansionScene img {
    width: 132%;
    height: 108%;
    object-position: 64% center;
    opacity: 0.72;
  }

  .pf-mansionScene::before {
    background:
      linear-gradient(90deg, rgba(2, 5, 6, 0.9), rgba(2, 5, 6, 0.62) 56%, rgba(2, 5, 6, 0.28)),
      linear-gradient(180deg, rgba(0, 0, 0, 0.2), transparent 36%, rgba(0, 0, 0, 0.56));
  }

  .pf-hauntedBackdrop > span,
  .pf-hauntedBackdrop i,
  .pf-webNet,
  .pf-branchFrame {
    display: none;
  }

  .pf-driftShape,
  .pf-pumpkinTwo,
  .pf-candleTrail,
  .pf-sigil {
    display: none;
  }

  .pf-pumpkinOne {
    right: -22px;
    bottom: 8px;
    scale: 0.68;
    opacity: 0.62;
  }

  .pf-heroContent {
    width: min(100% - 24px, 1180px);
    padding-top: 2.25rem;
    padding-bottom: 9.5rem;
    transform: none;
  }

  .pf-journeyControls {
    width: min(100% - 18px, 440px);
    grid-template-columns: 42px minmax(66px, 0.5fr) minmax(0, 1fr) 42px;
    gap: 0.28rem;
    padding: 0.32rem;
    top: calc(100svh - 150px);
  }

  .pf-journeyArrow {
    width: 40px;
    height: 40px;
  }

  .pf-journeyReadout {
    min-height: 40px;
  }

  .pf-journeyReadout b {
    font-size: 0.92rem;
  }

  .pf-journeyReadout span {
    font-size: 0.54rem;
  }

  .pf-journeyDots button {
    height: 28px;
  }

  .pf-journeyDots span {
    font-size: 0.58rem;
  }

  .pf-statusStrip {
    display: none;
  }

  .pf-root h1 {
    font-size: 3.8rem;
  }

  .pf-heroContent::before {
    top: 1.4rem;
    font-size: 2.2rem;
    opacity: 0.58;
  }

  .pf-root h1::before,
  .pf-root h1::after {
    display: none;
  }

  .pf-root h2 {
    font-size: 2.1rem;
  }

  .pf-lede {
    font-size: 1rem;
  }

  .pf-heroActions {
    gap: 0.55rem;
    margin-bottom: 1rem;
  }

  .pf-primaryButton,
  .pf-secondaryButton {
    min-height: 46px;
    padding: 0 0.9rem;
  }

  .pf-searchShell {
    margin: 1rem 0 1rem;
  }

  .pf-searchBox {
    min-height: 54px;
  }

  .pf-facts {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.35rem;
    scrollbar-width: none;
  }

  .pf-vibeStrip {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.3rem;
    scrollbar-width: none;
  }

  .pf-vibeStrip::-webkit-scrollbar {
    display: none;
  }

  .pf-vibeStrip span {
    flex: 0 0 auto;
  }

  .pf-facts::-webkit-scrollbar {
    display: none;
  }

  .pf-fact {
    flex: 0 0 auto;
  }

  .pf-section {
    padding: 3.4rem 0 6.2rem;
  }

  .pf-routeGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pf-routeTile {
    min-height: 112px;
  }

  .pf-sectionHead {
    display: block;
  }

  .pf-sectionHead > p {
    margin-top: 0.75rem;
  }

  .pf-timelineItem {
    grid-template-columns: 1fr;
  }

  .pf-contact {
    padding: 1.2rem;
  }

  .pf-footer .pf-container {
    display: block;
  }
}

@media (max-width: 380px) {
  .pf-root h1 {
    font-size: 3.25rem;
  }

  .pf-journeyControls {
    grid-template-columns: 38px 56px minmax(0, 1fr) 38px;
  }

  .pf-journeyArrow {
    width: 36px;
    height: 36px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pf-root::before,
  .pf-root::after,
  .pf-root *,
  .pf-root *::before,
  .pf-root *::after {
    scroll-behavior: auto !important;
    transition: none !important;
    animation: none !important;
  }

  .pf-heroContent,
  .pf-portraitField,
  .pf-codeTile,
  .pf-terminal,
  .pf-contact,
  .pf-mansionScene img,
  .pf-webNet,
  .pf-branchFrame,
  .pf-floorGrid,
  .pf-curseHud {
    transform: none !important;
  }
}
`;
