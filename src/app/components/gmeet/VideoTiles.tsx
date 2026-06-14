import React, { useMemo, useState } from 'react';
import {
    BackHandOutlined,
    Article,
    GitHub,
    Groups,
    LinkedIn,
    MicOff,
    VideocamOff,
} from '@mui/icons-material';
import {
    gmeetParticipants,
    gmeetProfile,
    gmeetTopics,
} from './gmeetPortfolio';
import type { GmeetPanel, GmeetTopic } from './gmeetPortfolio';

interface VideoTilesProps {
    activePanel: GmeetPanel;
    selectedTopic: GmeetTopic;
    onSelectTopic: (topic: GmeetTopic) => void;
    micOn: boolean;
    cameraOn: boolean;
    handRaised: boolean;
}

const topicTypes: Array<{ label: string; value: GmeetTopic['type'] | 'all' }> = [
    { label: 'All', value: 'all' },
    { label: 'Projects', value: 'project' },
    { label: 'Experience', value: 'experience' },
    { label: 'Skills', value: 'skill' },
    { label: 'Achievements', value: 'achievement' },
    { label: 'Research', value: 'research' },
];

const socialLinks = [
    { label: 'GitHub', href: gmeetProfile.links.github, icon: GitHub },
    { label: 'LinkedIn', href: gmeetProfile.links.linkedin, icon: LinkedIn },
    { label: 'Resume', href: gmeetProfile.resumeUrl, icon: Article },
].filter((link) => Boolean(link.href));

const VideoTiles: React.FC<VideoTilesProps> = ({
    activePanel,
    selectedTopic,
    onSelectTopic,
    micOn,
    cameraOn,
    handRaised,
}) => {
    const [activeType, setActiveType] = useState<GmeetTopic['type'] | 'all'>('all');
    const panelOpen = Boolean(activePanel);

    const visibleTopics = useMemo(() => (
        gmeetTopics.filter((topic) => activeType === 'all' || topic.type === activeType)
    ), [activeType]);

    const selectedParticipant = gmeetParticipants.find((participant) => participant.topicId === selectedTopic.id) ?? gmeetParticipants[0];
    const isSkillTopic = selectedTopic.type === 'skill';
    const sideParticipants = [
        selectedParticipant,
        ...gmeetParticipants.filter((participant) => participant.id !== selectedParticipant.id),
    ].slice(0, 4);
    const primaryDetails = selectedTopic.details.slice(0, isSkillTopic ? 10 : 4);

    return (
        <main className={`flex h-full flex-col gap-3 overflow-hidden bg-[#202124] p-4 pb-[92px] transition-all duration-300 ${panelOpen ? 'pr-[392px]' : 'pr-4'} max-lg:pr-4 max-sm:overflow-y-auto max-sm:p-2 max-sm:pb-[132px] max-sm:scrollbar-none`}>
            <div className={`grid min-h-0 flex-1 gap-3 max-sm:flex-none ${panelOpen ? 'grid-cols-1' : 'grid-cols-[minmax(0,1fr)_280px]'} max-xl:grid-cols-1`}>
                <section className="grid min-h-0 gap-3 overflow-hidden rounded-[22px] bg-[#202124] max-lg:overflow-y-auto max-lg:scrollbar-none max-sm:overflow-visible">
                    <div className="grid min-h-0 grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] gap-3 max-lg:grid-cols-1 max-sm:min-h-0">
                        <div className="relative flex min-h-[360px] flex-col overflow-hidden rounded-[22px] bg-[#2b2f31] p-5 ring-1 ring-white/10 max-sm:min-h-[240px] max-sm:rounded-2xl max-sm:p-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0 truncate rounded-full bg-black/25 px-3 py-1.5 text-xs font-semibold text-white">
                                    {gmeetProfile.meetingCode}
                                </div>
                                <div className="flex shrink-0 gap-1.5">
                                    {!micOn && <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ea4335] text-white"><MicOff sx={{ fontSize: 17 }} /></span>}
                                    {!cameraOn && <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ea4335] text-white"><VideocamOff sx={{ fontSize: 17 }} /></span>}
                                    {handRaised && <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fdd663] text-[#202124]"><BackHandOutlined sx={{ fontSize: 17 }} /></span>}
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col items-center justify-center text-center">
                                <div className="grid h-36 w-36 place-items-center overflow-hidden rounded-full bg-[#3c4043] ring-4 ring-[#8ab4f8] max-sm:h-20 max-sm:w-20">
                                    {cameraOn ? (
                                        <img src={gmeetProfile.avatar} alt={gmeetProfile.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-semibold text-white">{gmeetProfile.firstName[0]}</span>
                                    )}
                                </div>
                                <h2 className="mt-5 text-3xl font-semibold text-white max-sm:mt-3 max-sm:text-xl">{gmeetProfile.name}</h2>
                                <p className="mt-2 max-w-md text-sm leading-6 text-gray-300 max-sm:line-clamp-2 max-sm:text-xs max-sm:leading-5">{gmeetProfile.tagline}</p>
                            </div>

                            <div className="flex items-center justify-between gap-3 rounded-2xl bg-black/25 px-4 py-3 text-white max-sm:px-3 max-sm:py-2.5">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">Currently discussing</p>
                                    <p className="truncate text-xs text-gray-300">{selectedTopic.title}</p>
                                </div>
                                <span className="shrink-0 rounded-full bg-[#8ab4f8] px-3 py-1 text-xs font-bold text-[#202124]">
                                    {selectedTopic.type}
                                </span>
                            </div>
                        </div>

                        <div className="flex min-h-0 flex-col overflow-hidden rounded-[22px] bg-[#f8fafd] p-5 text-[#202124] max-sm:overflow-visible max-sm:rounded-2xl max-sm:p-4">
                            <div className="flex flex-wrap gap-2">
                                {selectedTopic.meta.map((item) => (
                                    <span key={`${item.label}-${item.value}`} className="rounded-full bg-[#e8f0fe] px-3 py-1 text-xs font-semibold text-[#1a73e8]">
                                        {item.label}: {item.value}
                                    </span>
                                ))}
                            </div>
                            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-normal max-sm:text-xl">{selectedTopic.title}</h1>
                            <p className="mt-2 text-sm leading-6 text-gray-600 max-sm:text-xs max-sm:leading-5">{selectedTopic.subtitle}</p>

                            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                                {socialLinks.map(({ label, href, icon: Icon }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#d7e3fc] bg-white px-3 py-1.5 text-xs font-semibold text-[#1a73e8] hover:bg-[#eef3fd]"
                                    >
                                        <Icon sx={{ fontSize: 15 }} />
                                        {label}
                                    </a>
                                ))}
                            </div>

                            <div className="mt-4 min-h-0 flex-1 overflow-y-auto scrollbar-none max-sm:flex-none max-sm:overflow-visible">
                                {isSkillTopic ? (
                                    <div className="flex flex-wrap gap-2">
                                        {primaryDetails.map((skill) => (
                                            <span key={`${selectedTopic.id}-${skill}`} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {primaryDetails.map((detail, index) => (
                                            <div key={`${selectedTopic.id}-${detail}`} className="grid grid-cols-[30px_1fr] rounded-xl bg-white px-3 py-2 text-sm leading-6 ring-1 ring-gray-200 max-sm:grid-cols-[24px_1fr] max-sm:text-xs max-sm:leading-5">
                                                <span className="font-semibold text-[#1a73e8]">{index + 1}</span>
                                                <span>{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {selectedTopic.links.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {selectedTopic.links.map((link) => (
                                        <a
                                            key={`${selectedTopic.id}-${link.label}`}
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-full bg-[#1a73e8] px-3 py-1.5 text-xs font-bold capitalize text-white hover:bg-[#1558b0]"
                                        >
                                            Open {link.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {!panelOpen && (
                <aside className="grid min-h-0 grid-rows-4 gap-3 max-xl:hidden">
                    {sideParticipants.map((participant) => {
                        const topic = participant.topicId ? gmeetTopics.find((item) => item.id === participant.topicId) : undefined;
                        const selected = participant.id === selectedParticipant.id;

                        return (
                            <button
                                key={participant.id}
                                type="button"
                                onClick={() => topic && onSelectTopic(topic)}
                                className={`relative overflow-hidden rounded-[22px] bg-[#303134] text-left shadow-lg transition ${
                                    selected ? 'ring-2 ring-[#8ab4f8]' : 'hover:ring-1 hover:ring-white/30'
                                }`}
                            >
                                {cameraOn || participant.id !== selectedParticipant.id ? (
                                    <img src={participant.avatar} alt={participant.name} className="h-full w-full object-cover opacity-75" />
                                ) : (
                                    <div className="grid h-full place-items-center bg-[#3c4043] text-3xl font-semibold text-white">
                                        {participant.initials}
                                    </div>
                                )}
                                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase text-white">
                                    {participant.category.replace('_', ' ')}
                                </span>
                                {participant.muted && (
                                    <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white">
                                        <MicOff sx={{ fontSize: 17 }} />
                                    </span>
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                    <p className="truncate text-sm font-semibold text-white">{participant.name}</p>
                                    <p className="truncate text-xs text-gray-300">{participant.role}</p>
                                </div>
                            </button>
                        );
                    })}
                </aside>
                )}
            </div>

            <div className="shrink-0 rounded-2xl bg-[#202124] p-2 shadow-xl ring-1 ring-white/10 max-sm:rounded-xl max-sm:p-1.5">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {topicTypes.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => setActiveType(type.value)}
                            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold max-sm:px-3 max-sm:py-1.5 max-sm:text-xs ${
                                activeType === type.value ? 'bg-[#8ab4f8] text-[#202124]' : 'bg-[#303134] text-gray-200 hover:bg-[#3c4043]'
                            }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-none">
                    {visibleTopics.map((topic) => (
                        <button
                            key={topic.id}
                            type="button"
                            onClick={() => onSelectTopic(topic)}
                            className={`min-w-[220px] rounded-xl border px-4 py-3 text-left transition max-sm:min-w-[172px] max-sm:px-3 max-sm:py-2.5 ${
                                selectedTopic.id === topic.id
                                    ? 'border-[#8ab4f8] bg-[#2b3a55] text-white'
                                    : 'border-white/10 bg-[#303134] text-gray-200 hover:bg-[#3c4043]'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Groups sx={{ fontSize: 17 }} />
                                <p className="truncate text-sm font-semibold">{topic.title}</p>
                            </div>
                            <p className="mt-1 truncate text-xs text-gray-400">{topic.subtitle}</p>
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default VideoTiles;
