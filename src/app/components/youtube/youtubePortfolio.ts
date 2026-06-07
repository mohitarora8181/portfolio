import {
    getExperiencePeriod,
    getPortfolioData,
    getProjectDate,
    getSkillGroups,
} from '@/src/services/portfolioData';

const data = getPortfolioData();
const skillGroups = getSkillGroups();

const firstImage = (item: { images?: { url: string }[] }) => item.images?.find((image) => image.url)?.url;
const logoFallback = (label: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=1a73e8&color=ffffff&size=720`;

export type YouTubeSection =
    | 'All'
    | 'Projects'
    | 'Experience'
    | 'Skills'
    | 'Achievements'
    | 'Education'
    | 'Open Source'
    | 'Featured'
    | 'Contact';

export type PortfolioVideo = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channel: string;
    meta: string;
    duration: string;
    section: YouTubeSection | string;
    chips: string[];
};

export const youtubeChannel = {
    name: data.meta.name,
    handle: '@mohit8181',
    tagline: data.meta.tagline,
    avatar: data.meta.avatar,
    email: data.meta.email,
    resumeUrl: data.meta.resume_url,
    socials: [
        { label: 'LinkedIn', href: data.meta.links.linkedin },
        { label: 'GitHub', href: data.meta.links.github },
        { label: 'LeetCode', href: data.meta.links.leetcode },
        { label: 'GFG', href: data.meta.links.geeksforgeeks },
    ].filter((item) => item.href),
    subscribers: `${data.projects.length + data.experience.length}.${data.achievements.length}K subscribers`,
    stats: [
        `${data.projects.length} projects`,
        `${data.experience.length} roles`,
        `${skillGroups.length} skill groups`,
    ],
};

export const youtubeFilters = [
    'All',
    'Projects',
    'Experience',
    'Skills',
    'Achievements',
    'Education',
    'Open Source',
    'Featured',
    'Contact',
    ...skillGroups.slice(0, 4).map((group) => group.label),
];

export const youtubeSidebarItems = youtubeFilters.map((filter) => ({
    label: filter === 'All' ? 'Portfolio Home' : filter,
    filter,
}));

export const youtubeVideos: PortfolioVideo[] = [
    ...data.projects.map((project, index) => ({
        id: project.id,
        title: project.name,
        description: project.tagline,
        thumbnail: firstImage(project) ?? logoFallback(project.name),
        channel: data.meta.name,
        meta: `${project.status} | ${getProjectDate(project)} | ${project.tech_stack.length} technologies`,
        duration: index % 2 ? '8:18' : '12:40',
        section: 'Projects',
        chips: project.tech_stack,
    })),
    ...data.projects.filter((project) => project.featured).map((project, index) => ({
        id: `featured-${project.id}`,
        title: `Featured: ${project.name}`,
        description: project.description,
        thumbnail: project.images?.[1]?.url ?? firstImage(project) ?? logoFallback(project.name),
        channel: data.meta.name,
        meta: `${project.status} | ${getProjectDate(project)} | highlighted project`,
        duration: index % 2 ? '9:10' : '11:30',
        section: 'Featured',
        chips: project.tech_stack,
    })),
    ...data.experience.map((experience, index) => ({
        id: experience.id,
        title: `${experience.role} at ${experience.company}`,
        description: experience.highlights[0],
        thumbnail: firstImage(experience) || experience.company_logo || logoFallback(experience.company),
        channel: data.meta.name,
        meta: `${getExperiencePeriod(experience)} | ${experience.location}`,
        duration: index % 2 ? '6:25' : '10:15',
        section: 'Experience',
        chips: experience.tech_stack,
    })),
    ...skillGroups.map((group, index) => ({
        id: group.label,
        title: group.label,
        description: group.items.join(', '),
        thumbnail: logoFallback(group.label),
        channel: `${data.meta.name} Skills`,
        meta: `${group.items.length} skills | Portfolio stack`,
        duration: index % 2 ? '4:30' : '7:05',
        section: group.label,
        chips: group.items,
    })),
    ...data.achievements.map((achievement) => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description || `${achievement.type} recognition from ${achievement.issuer}.`,
        thumbnail: achievement.image || logoFallback(achievement.title),
        channel: data.meta.name,
        meta: `${achievement.issuer} | ${achievement.year}`,
        duration: '3:20',
        section: 'Achievements',
        chips: [achievement.type],
    })),
    ...data.education.map((education) => ({
        id: education.id,
        title: education.institution,
        description: `${education.degree} | CGPA ${education.cgpa}`,
        thumbnail: education.logo || logoFallback(education.institution),
        channel: data.meta.name,
        meta: `${education.start_year} - ${education.end_year}`,
        duration: '5:45',
        section: 'Education',
        chips: ['Degree', 'CGPA', 'College'],
    })),
    ...data.open_source.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description || `${item.role} contribution`,
        thumbnail: logoFallback(item.name),
        channel: data.meta.name,
        meta: item.role,
        duration: '2:50',
        section: 'Open Source',
        chips: ['Open source'],
    })),
    {
        id: 'contact',
        title: `Contact ${data.meta.name}`,
        description: `${data.meta.email} | ${data.meta.phone} | ${data.meta.links.linkedin}`,
        thumbnail: data.meta.avatar,
        channel: data.meta.name,
        meta: 'Available for frontend and full-stack opportunities',
        duration: '1:00',
        section: 'Contact',
        chips: ['Email', 'LinkedIn', 'Resume'],
    },
];
