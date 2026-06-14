import portfolioJson from "@/myData.json";

export type PortfolioData = typeof portfolioJson;
export type SkillGroup = PortfolioData["skills"][keyof PortfolioData["skills"]];
export type Experience = PortfolioData["experience"][number];
export type ResearchPaper = PortfolioData["research"][number];
export type Project = PortfolioData["projects"][number];
export type Achievement = PortfolioData["achievements"][number];

const PORTFOLIO_CACHE_KEY = "portfolio:firebase-data";
const PORTFOLIO_GLOBAL_KEY = "__PORTFOLIO_DATA__";

const portfolioFallback = portfolioJson;

type PortfolioWindow = Window & {
  [PORTFOLIO_GLOBAL_KEY]?: PortfolioData;
};

const readBrowserCache = () => {
  if (typeof window === "undefined") return null;

  const browserWindow = window as PortfolioWindow;
  if (browserWindow[PORTFOLIO_GLOBAL_KEY]) {
    return browserWindow[PORTFOLIO_GLOBAL_KEY] ?? null;
  }

  try {
    const cached = window.sessionStorage.getItem(PORTFOLIO_CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as PortfolioData;
    browserWindow[PORTFOLIO_GLOBAL_KEY] = parsed;
    return parsed;
  } catch {
    return null;
  }
};

const currentPortfolioData: { value: PortfolioData } = {
  value:
    typeof window === "undefined"
      ? portfolioFallback
      : readBrowserCache() ?? portfolioFallback,
};

export const setPortfolioData = (data: PortfolioData) => {
  currentPortfolioData.value = data;

  if (typeof window !== "undefined") {
    const browserWindow = window as PortfolioWindow;
    browserWindow[PORTFOLIO_GLOBAL_KEY] = data;
    try {
      window.sessionStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(data));
    } catch {
      // Session storage can be unavailable in privacy-restricted contexts.
    }
  }
};

const formatMonthYear = (value: string | null) => {
  if (!value) return "Present";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatProjectDate = (value: string) => {
  const [year, month] = value.split("-");
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(Number(year), Number(month) - 1));
};

export const portfolioDataService = {
  get(): PortfolioData {
    if (typeof window !== "undefined") {
      const cached = readBrowserCache();
      if (cached) {
        currentPortfolioData.value = cached;
      }
    }

    return currentPortfolioData.value;
  },
};

export const getPortfolioData = () => portfolioDataService.get();

export const getSkillGroups = () => Object.values(getPortfolioData().skills);

export const getFeaturedProjects = () =>
  getPortfolioData().projects.filter((project) => project.featured);

export const getExperiencePeriod = (experience: Experience) =>
  `${formatMonthYear(experience.start_date)} - ${formatMonthYear(experience.end_date)}`;

export const getResearchPeriod = (paper: ResearchPaper) =>
  `${formatMonthYear(paper.start_date)} - ${formatMonthYear(paper.end_date)}`;

export const getProjectDate = (project: Project) => formatProjectDate(project.date);

export const getResearchPapers = () => getPortfolioData().research;

export const getAppShowcases = () => {
  const data = getPortfolioData();

  return [
    {
      name: "YouTube",
      href: "/youtube",
      theme: "bg-[#ff0033]",
      description: "Projects, roles, and achievements presented as portfolio videos.",
      skills: ["Project cards", "Filters", "Content grid"],
    },
    {
      name: "WhatsApp",
      href: "/whatsapp",
      theme: "bg-[#00a884]",
      description: "Portfolio sections converted into chats for a familiar messaging flow.",
      skills: ["Stateful UI", "Mobile flow", "Structured data"],
    },
    {
      name: "Spotify",
      href: "/spotify",
      theme: "bg-[#1ed760]",
      description: "Skills, projects, and experience organized as playlists and tracks.",
      skills: ["Dark UI", "Collections", "Playback shell"],
    },
    {
      name: "LinkedIn",
      href: "/linkedin",
      theme: "bg-[#0a66c2]",
      description: "A professional feed built directly from experience, projects, and achievements.",
      skills: ["Feed UI", "Profile data", "Career timeline"],
    },
    {
      name: "Google Meet",
      href: "/gmeet",
      theme: "bg-[#fbbc04]",
      description: `${data.meta.name}'s portfolio as a live interview room with agenda and profile context.`,
      skills: ["Panels", "Controls", "Live presence"],
    },
    {
      name: "Google Maps",
      href: "/maps",
      theme: "bg-[#4285f4]",
      description: "Portfolio sections plotted as map pins with routes, search, and place-style detail panels.",
      skills: ["Interactive map", "Route pins", "Portfolio places"],
    },
  ];
};
