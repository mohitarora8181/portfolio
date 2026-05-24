import {
    getExperiencePeriod,
    getPortfolioData,
    getProjectDate,
    getSkillGroups,
} from '@/src/services/portfolioData';

const data = getPortfolioData();
const skillGroups = getSkillGroups();

export type LinkedInSection = 'All' | 'Experience' | 'Projects' | 'Skills' | 'Education' | 'Achievements' | 'Open Source';

export type LinkedInPost = {
    id: string;
    section: LinkedInSection;
    title: string;
    subtitle: string;
    content: string;
    image: string;
    metrics: string;
    details: string[];
    chips: string[];
    links: { label: string; href: string }[];
};

export const linkedinProfile = {
    name: data.meta.name,
    firstName: data.meta.name.split(' ')[0],
    tagline: data.meta.tagline,
    avatar: data.meta.avatar,
    email: data.meta.email,
    phone: data.meta.phone,
    resumeUrl: data.meta.resume_url,
    links: data.meta.links,
    education: data.education[0],
};

export const linkedinSections: LinkedInSection[] = [
    'All',
    'Experience',
    'Projects',
    'Skills',
    'Education',
    'Achievements',
    'Open Source',
];

export const linkedinPosts: LinkedInPost[] = [
    ...data.experience.map((item) => ({
        id: item.id,
        section: 'Experience' as const,
        title: `${item.role} at ${item.company}`,
        subtitle: `${item.location} | ${getExperiencePeriod(item)}`,
        content: item.highlights[0],
        image: `https://picsum.photos/seed/linkedin-${item.id}/900/520`,
        metrics: `${item.tech_stack.length} technologies | ${item.highlights.length} highlights`,
        details: item.highlights,
        chips: item.tech_stack,
        links: item.company_url ? [{ label: 'Company', href: item.company_url }] : [],
    })),
    ...data.projects.map((project) => ({
        id: project.id,
        section: 'Projects' as const,
        title: project.name,
        subtitle: `${project.status} | ${getProjectDate(project)}`,
        content: project.description || project.tagline,
        image: `https://picsum.photos/seed/linkedin-${project.id}/900/520`,
        metrics: project.tech_stack.join(' | '),
        details: [project.tagline, ...project.highlights].filter(Boolean),
        chips: project.tech_stack,
        links: Object.entries(project.links)
            .filter((entry): entry is [string, string] => Boolean(entry[1]))
            .map(([label, href]) => ({ label: label.replace(/_/g, ' '), href })),
    })),
    ...skillGroups.map((group) => ({
        id: `skill-${group.label}`,
        section: 'Skills' as const,
        title: group.label,
        subtitle: `Skill group | ${group.items.length} skills`,
        content: `Tools and technologies used across ${data.projects.length} projects and ${data.experience.length} work experiences.`,
        image: `https://picsum.photos/seed/linkedin-${group.label}/900/520`,
        metrics: group.items.join(' | '),
        details: group.items,
        chips: group.items,
        links: [],
    })),
    ...data.education.map((education) => ({
        id: education.id,
        section: 'Education' as const,
        title: education.institution,
        subtitle: `${education.degree} | ${education.start_year} - ${education.end_year}`,
        content: `CGPA ${education.cgpa}. ${education.highlights.join(' ')}`,
        image: `https://picsum.photos/seed/linkedin-${education.id}/900/520`,
        metrics: `CGPA ${education.cgpa}`,
        details: education.highlights.length > 0 ? education.highlights : [`CGPA ${education.cgpa}`],
        chips: [education.degree, `${education.start_year} - ${education.end_year}`],
        links: [],
    })),
    ...data.achievements.map((achievement) => ({
        id: achievement.id,
        section: 'Achievements' as const,
        title: achievement.title,
        subtitle: `${achievement.issuer} | ${achievement.year}`,
        content: achievement.description || `${achievement.type} recognition from ${achievement.issuer}.`,
        image: `https://picsum.photos/seed/linkedin-${achievement.id}/900/520`,
        metrics: achievement.type,
        details: [achievement.description || achievement.type],
        chips: [achievement.type, String(achievement.year)],
        links: achievement.link ? [{ label: 'Credential', href: achievement.link }] : [],
    })),
    ...data.open_source.map((item) => ({
        id: item.id,
        section: 'Open Source' as const,
        title: item.name,
        subtitle: `${item.role} | Open source`,
        content: item.description || `Contributed to ${item.name}.`,
        image: `https://picsum.photos/seed/linkedin-${item.id}/900/520`,
        metrics: item.role,
        details: [item.description || `Repository contribution as ${item.role}.`],
        chips: [item.role],
        links: item.repo_url ? [{ label: 'Repository', href: item.repo_url }] : [],
    })),
];

export const linkedinStats = {
    projects: data.projects.length,
    experience: data.experience.length,
    skills: skillGroups.reduce((total, group) => total + group.items.length, 0),
    achievements: data.achievements.length,
};
