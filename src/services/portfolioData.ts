import portfolioJson from "@/myData.json";

export type PortfolioData = typeof portfolioJson;
export type SkillGroup = PortfolioData["skills"][keyof PortfolioData["skills"]];
export type Experience = PortfolioData["experience"][number];
export type Project = PortfolioData["projects"][number];
export type Achievement = PortfolioData["achievements"][number];

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
    return portfolioJson;
  },
};

export const getPortfolioData = () => portfolioDataService.get();

export const getSkillGroups = () => Object.values(getPortfolioData().skills);

export const getFeaturedProjects = () =>
  getPortfolioData().projects.filter((project) => project.featured);

export const getExperiencePeriod = (experience: Experience) =>
  `${formatMonthYear(experience.start_date)} - ${formatMonthYear(experience.end_date)}`;

export const getProjectDate = (project: Project) => formatProjectDate(project.date);

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
  ];
};
