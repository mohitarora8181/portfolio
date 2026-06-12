import {
    getExperiencePeriod,
    getPortfolioData,
    getProjectDate,
    getSkillGroups,
} from '@/src/services/portfolioData';

const data = getPortfolioData();
const skillGroups = getSkillGroups();

export type Message = {
    text: string;
    time: string;
    isSender: boolean;
    dateTag?: string;
};

export type ChatCategory = 'all' | 'unread' | 'favorites' | 'groups';

export type Chat = {
    id: string;
    name: string;
    message: string;
    time: string;
    archived: boolean;
    category: ChatCategory[];
    messages: Message[];
};

const linksFromRecord = (links: Partial<Record<string, string>>) => (
    Object.entries(links)
        .filter((entry): entry is [string, string] => Boolean(entry[1]))
        .map(([label, href]) => `${label.replace(/_/g, ' ')}: ${href}`)
);

export const whatsappProfile = {
    name: data.meta.name,
    tagline: data.meta.tagline,
    avatar: data.meta.avatar,
    email: data.meta.email,
    phone: data.meta.phone,
    resumeUrl: data.meta.resume_url,
    links: data.meta.links,
};

export const portfolioChats: Chat[] = [
    {
        id: 'profile',
        name: data.meta.name,
        message: data.meta.tagline,
        time: 'Now',
        archived: false,
        category: ['all', 'favorites'],
        messages: [
            { text: `Hi, I am ${data.meta.name}.`, time: '10:00 AM', isSender: false, dateTag: 'Today' },
            { text: data.meta.tagline, time: '10:01 AM', isSender: false },
            { text: `Email: ${data.meta.email}`, time: '10:02 AM', isSender: true },
            { text: `Phone: ${data.meta.phone}`, time: '10:03 AM', isSender: true },
            { text: `Resume: ${data.meta.resume_url}`, time: '10:04 AM', isSender: true },
            ...Object.entries(data.meta.links)
                .filter((entry): entry is [string, string] => Boolean(entry[1]))
                .map(([label, href]) => ({ text: `${label}: ${href}`, time: 'Link', isSender: true })),
        ],
    },
    {
        id: 'experience',
        name: 'Experience',
        message: `${data.experience[0].role} at ${data.experience[0].company}`,
        time: '9:45 AM',
        archived: false,
        category: ['all', 'unread', 'groups'],
        messages: data.experience.flatMap((experience) => [
            {
                text: `${experience.role} at ${experience.company} (${getExperiencePeriod(experience)})`,
                time: experience.current ? 'Current' : 'Done',
                isSender: false,
                dateTag: experience.company,
            },
            {
                text: experience.highlights.join(' | '),
                time: experience.location,
                isSender: true,
            },
            {
                text: `Tech: ${experience.tech_stack.join(', ')}`,
                time: experience.type,
                isSender: false,
            },
            ...(experience.company_url ? [{
                text: `Company link: ${experience.company_url}`,
                time: 'Link',
                isSender: true,
            }] : []),
        ]),
    },
    {
        id: 'projects',
        name: 'Projects',
        message: `${data.projects.length} portfolio projects`,
        time: 'Yesterday',
        archived: false,
        category: ['all', 'favorites', 'groups'],
        messages: data.projects.flatMap((project) => [
            {
                text: `${project.name}: ${project.tagline}`,
                time: getProjectDate(project),
                isSender: false,
                dateTag: project.name,
            },
            {
                text: project.description,
                time: project.status,
                isSender: true,
            },
            {
                text: `Stack: ${project.tech_stack.join(', ')}`,
                time: project.featured ? 'Featured' : 'Project',
                isSender: false,
            },
            ...linksFromRecord(project.links).map((text) => ({
                text,
                time: 'Link',
                isSender: true,
            })),
        ]),
    },
    {
        id: 'skills',
        name: 'Skills',
        message: `${skillGroups.length} skill groups`,
        time: 'Mon',
        archived: false,
        category: ['all', 'groups'],
        messages: skillGroups.map((group) => ({
            text: `${group.label}: ${group.items.join(', ')}`,
            time: `${group.items.length} skills`,
            isSender: false,
            dateTag: group.label,
        })),
    },
    {
        id: 'achievements',
        name: 'Achievements',
        message: `${data.achievements.length} achievements`,
        time: 'Sun',
        archived: false,
        category: ['all', 'unread'],
        messages: data.achievements.map((achievement) => ({
            text: `${achievement.title} - ${achievement.issuer}`,
            time: String(achievement.year),
            isSender: false,
            dateTag: String(achievement.year),
        })).flatMap((message, index) => {
            const achievement = data.achievements[index];
            return achievement.link ? [message, { text: `Credential: ${achievement.link}`, time: 'Link', isSender: true }] : [message];
        }),
    },
    {
        id: 'education',
        name: 'Education',
        message: data.education[0]?.institution ?? 'Education details',
        time: 'Sat',
        archived: false,
        category: ['all'],
        messages: data.education.map((education) => ({
            text: `${education.degree} at ${education.institution}. CGPA: ${education.cgpa}`,
            time: `${education.start_year} - ${education.end_year}`,
            isSender: false,
            dateTag: 'Education',
        })),
    },
    {
        id: 'open-source',
        name: 'Open Source',
        message: `${data.open_source.length} contributions`,
        time: 'Fri',
        archived: false,
        category: ['all', 'groups'],
        messages: data.open_source.map((item) => ({
            text: `${item.name}: ${item.description || item.role}`,
            time: item.role,
            isSender: false,
            dateTag: 'Open Source',
        })).flatMap((message, index) => {
            const item = data.open_source[index];
            return item.repo_url ? [message, { text: `Repository: ${item.repo_url}`, time: 'Link', isSender: true }] : [message];
        }),
    },
];
