import {
    getExperiencePeriod,
    getPortfolioData,
    getProjectDate,
    getSkillGroups,
} from '@/src/services/portfolioData';

const data = getPortfolioData();
const skillGroups = getSkillGroups();

export type SpotifyPlaylist = {
    id: string;
    title: string;
    subtitle: string;
    cover: string;
    tracks: string[];
};

export type SpotifyAlbum = {
    id: string;
    kind: 'project' | 'experience';
    title: string;
    subtitle: string;
    cover: string;
    description: string;
    details: string[];
    meta: { label: string; value: string }[];
    links: { label: string; href: string }[];
    chips: string[];
};

export type SpotifyActivity = {
    id: string;
    title: string;
    subtitle: string;
};

export const spotifyProfile = {
    name: data.meta.name,
    tagline: data.meta.tagline,
    avatar: data.meta.avatar,
    email: data.meta.email,
    resumeUrl: data.meta.resume_url,
};

export const spotifyPlaylists: SpotifyPlaylist[] = [
    ...skillGroups.map((group) => ({
        id: group.label,
        title: group.label,
        subtitle: `Playlist • ${group.items.length} skills`,
        cover: `https://picsum.photos/seed/spotify-${group.label}/160/160`,
        tracks: group.items,
    })),
    {
        id: 'open-source',
        title: 'Open Source Contributions',
        subtitle: `Playlist • ${data.open_source.length} contributions`,
        cover: 'https://picsum.photos/seed/spotify-open-source/160/160',
        tracks: data.open_source.map((item) => item.name),
    },
];

export const spotifyAlbums: SpotifyAlbum[] = [
    ...data.projects.map((project) => ({
        id: project.id,
        kind: 'project' as const,
        title: project.name,
        subtitle: `${project.status} • ${getProjectDate(project)}`,
        cover: `https://picsum.photos/seed/spotify-${project.id}/320/320`,
        description: project.description || project.tagline,
        details: [project.tagline, ...project.highlights].filter(Boolean),
        meta: [
            { label: 'Type', value: project.type.replace(/_/g, ' ') },
            { label: 'Status', value: project.status },
            { label: 'Date', value: getProjectDate(project) },
        ],
        links: Object.entries(project.links)
            .filter((entry): entry is [string, string] => Boolean(entry[1]))
            .map(([label, href]) => ({ label: label.replace(/_/g, ' '), href })),
        chips: project.tech_stack,
    })),
    ...data.experience.map((experience) => ({
        id: experience.id,
        kind: 'experience' as const,
        title: `${experience.company}`,
        subtitle: `${experience.role} • ${getExperiencePeriod(experience)}`,
        cover: `https://picsum.photos/seed/spotify-${experience.id}/320/320`,
        description: experience.highlights[0],
        details: experience.highlights,
        meta: [
            { label: 'Role', value: experience.role },
            { label: 'Period', value: getExperiencePeriod(experience) },
            { label: 'Location', value: experience.location },
            { label: 'Type', value: experience.type },
        ],
        links: experience.company_url ? [{ label: 'company', href: experience.company_url }] : [],
        chips: experience.tech_stack,
    })),
];

export const spotifyActivity: SpotifyActivity[] = [
    ...data.experience.slice(0, 3).map((experience) => ({
        id: experience.id,
        title: experience.company,
        subtitle: `${experience.role} • ${experience.current ? 'Currently working' : 'Completed'}`,
    })),
    ...data.achievements.map((achievement) => ({
        id: achievement.id,
        title: achievement.title,
        subtitle: `${achievement.issuer} • ${achievement.year}`,
    })),
];

export const nowPlaying = spotifyAlbums[0];
