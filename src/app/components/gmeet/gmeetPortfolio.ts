import {
    getExperiencePeriod,
    getPortfolioData,
    getProjectDate,
    getResearchPeriod,
    getSkillGroups,
} from '@/src/services/portfolioData';

const data = getPortfolioData();
const skillGroups = getSkillGroups();

const firstImage = (item: { images?: { url: string }[] }) => item.images?.find((image) => image.url)?.url;
const avatarFallback = (label: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=3c4043&color=ffffff&size=120`;

export type GmeetPanel = 'people' | 'chat' | 'details' | null;

export type GmeetParticipant = {
    id: string;
    name: string;
    role: string;
    avatar: string;
    muted: boolean;
    presenting?: boolean;
    topicId?: string;
    category: 'profile' | 'project' | 'experience' | 'skill' | 'achievement' | 'open_source' | 'education' | 'research';
    initials: string;
    note: string;
};

export type GmeetTopic = {
    id: string;
    title: string;
    subtitle: string;
    type: 'project' | 'experience' | 'skill' | 'achievement' | 'research';
    details: string[];
    chips: string[];
    meta: { label: string; value: string }[];
    links: { label: string; href: string }[];
};

export type GmeetChatMessage = {
    id: string;
    sender: string;
    message: string;
    time: string;
    topicId?: string;
};

export const gmeetProfile = {
    name: data.meta.name,
    firstName: data.meta.name.split(' ')[0],
    tagline: data.meta.tagline,
    avatar: data.meta.avatar,
    email: data.meta.email,
    resumeUrl: data.meta.resume_url,
    meetingCode: `${data.meta.name.toLowerCase().replace(/\s+/g, '-')}-portfolio`,
    links: data.meta.links,
};

const initialsOf = (value: string) => value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const gmeetTopics: GmeetTopic[] = [
    ...data.projects.map((project) => ({
        id: project.id,
        title: project.name,
        subtitle: `${project.status} | ${getProjectDate(project)}`,
        type: 'project' as const,
        details: [project.description || project.tagline, ...project.highlights].filter(Boolean),
        chips: project.tech_stack,
        meta: [
            { label: 'Type', value: project.type.replace(/_/g, ' ') },
            { label: 'Status', value: project.status },
            { label: 'Date', value: getProjectDate(project) },
        ],
        links: Object.entries(project.links)
            .filter((entry): entry is [string, string] => Boolean(entry[1]))
            .map(([label, href]) => ({ label: label.replace(/_/g, ' '), href })),
    })),
    ...data.experience.map((experience) => ({
        id: experience.id,
        title: experience.company,
        subtitle: `${experience.role} | ${getExperiencePeriod(experience)}`,
        type: 'experience' as const,
        details: experience.highlights,
        chips: experience.tech_stack,
        meta: [
            { label: 'Role', value: experience.role },
            { label: 'Period', value: getExperiencePeriod(experience) },
            { label: 'Location', value: experience.location },
        ],
        links: experience.company_url ? [{ label: 'company', href: experience.company_url }] : [],
    })),
    ...skillGroups.map((group) => ({
        id: `skill-${group.label}`,
        title: group.label,
        subtitle: `${group.items.length} skills`,
        type: 'skill' as const,
        details: group.items,
        chips: group.items,
        meta: [
            { label: 'Group', value: group.label },
            { label: 'Skills', value: String(group.items.length) },
        ],
        links: [],
    })),
    ...data.achievements.map((achievement) => ({
        id: achievement.id,
        title: achievement.title,
        subtitle: `${achievement.issuer} | ${achievement.year}`,
        type: 'achievement' as const,
        details: [achievement.description || achievement.type],
        chips: [achievement.type, String(achievement.year)],
        meta: [
            { label: 'Issuer', value: achievement.issuer },
            { label: 'Year', value: String(achievement.year) },
            { label: 'Type', value: achievement.type },
        ],
        links: achievement.link ? [{ label: 'credential', href: achievement.link }] : [],
    })),
    ...data.research.map((paper) => ({
        id: paper.id,
        title: paper.title,
        subtitle: `${paper.status} | ${getResearchPeriod(paper)}`,
        type: 'research' as const,
        details: [paper.role, ...paper.highlights].filter(Boolean),
        chips: paper.tech_stack,
        meta: [
            { label: 'Role', value: paper.role },
            { label: 'Status', value: paper.status },
            { label: 'Venue', value: paper.venue || 'Draft' },
        ],
        links: paper.paper_url ? [{ label: 'paper', href: paper.paper_url }] : [],
    })),
];

export const gmeetParticipants: GmeetParticipant[] = [
    {
        id: 'host',
        name: data.meta.name,
        role: data.meta.tagline,
        avatar: data.meta.avatar,
        muted: false,
        presenting: true,
        category: 'profile',
        initials: initialsOf(data.meta.name),
        note: data.meta.email,
    },
    ...data.projects.map((project, index) => ({
        id: `person-${project.id}`,
        name: project.name,
        role: project.type.replace(/_/g, ' '),
        avatar: firstImage(project) ?? avatarFallback(project.name),
        muted: index % 2 === 0,
        topicId: project.id,
        category: 'project' as const,
        initials: initialsOf(project.name),
        note: project.tagline,
    })),
    ...data.experience.map((experience, index) => ({
        id: `person-${experience.id}`,
        name: experience.company,
        role: experience.role,
        avatar: experience.company_logo || firstImage(experience) || avatarFallback(experience.company),
        muted: index !== 0,
        topicId: experience.id,
        category: 'experience' as const,
        initials: initialsOf(experience.company),
        note: getExperiencePeriod(experience),
    })),
    ...skillGroups.map((group) => ({
        id: `person-skill-${group.label}`,
        name: group.label,
        role: `${group.items.length} skills`,
        avatar: group.images?.[0]?.url ?? avatarFallback(group.label),
        muted: true,
        topicId: `skill-${group.label}`,
        category: 'skill' as const,
        initials: initialsOf(group.label),
        note: group.items.slice(0, 4).join(', '),
    })),
    ...data.achievements.map((achievement) => ({
        id: `person-${achievement.id}`,
        name: achievement.title,
        role: achievement.issuer,
        avatar: achievement.image || avatarFallback(achievement.title),
        muted: true,
        topicId: achievement.id,
        category: 'achievement' as const,
        initials: initialsOf(achievement.title),
        note: String(achievement.year),
    })),
    ...data.research.map((paper) => ({
        id: `person-${paper.id}`,
        name: paper.title,
        role: paper.role,
        avatar: paper.images?.[0]?.url ?? avatarFallback(paper.title),
        muted: true,
        topicId: paper.id,
        category: 'research' as const,
        initials: initialsOf(paper.title),
        note: paper.tech_stack.slice(0, 4).join(', '),
    })),
];

export const gmeetChatMessages: GmeetChatMessage[] = [
    {
        id: 'intro',
        sender: gmeetProfile.firstName,
        message: `Welcome to my portfolio meet. We can walk through ${data.projects.length} projects, ${data.experience.length} experiences, and ${skillGroups.length} skill groups.`,
        time: 'Now',
    },
    ...data.projects.map((project, index) => ({
        id: `chat-${project.id}`,
        sender: project.name,
        message: `${project.tagline} Tech: ${project.tech_stack.join(', ')}.`,
        time: `${index + 1} min`,
        topicId: project.id,
    })),
    ...data.experience.map((experience, index) => ({
        id: `chat-${experience.id}`,
        sender: experience.company,
        message: experience.highlights[0],
        time: `${index + data.projects.length + 1} min`,
        topicId: experience.id,
    })),
    ...data.achievements.map((achievement, index) => ({
        id: `chat-${achievement.id}`,
        sender: achievement.title,
        message: achievement.description || `${achievement.type} recognition from ${achievement.issuer}.`,
        time: `${index + data.projects.length + data.experience.length + 1} min`,
        topicId: achievement.id,
    })),
    ...data.research.map((paper, index) => ({
        id: `chat-${paper.id}`,
        sender: paper.title,
        message: paper.highlights[0] ?? paper.status,
        time: `${index + data.projects.length + data.experience.length + data.achievements.length + 1} min`,
        topicId: paper.id,
    })),
];

export const defaultGmeetTopic = gmeetTopics[0];
