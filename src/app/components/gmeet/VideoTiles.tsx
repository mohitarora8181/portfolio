import React, { useMemo, useState } from 'react';
import {
    BackHandOutlined,
    Groups,
    MicOff,
    PresentToAll,
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
];

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

    return (
        <main className={`flex h-full flex-col gap-3 bg-[#202124] p-4 pb-[92px] transition-all duration-300 ${panelOpen ? 'pr-[392px]' : 'pr-4'} max-lg:pr-4 max-sm:p-2 max-sm:pb-[148px]`}>
            <div className={`grid min-h-0 flex-1 gap-3 ${panelOpen ? 'grid-cols-1' : 'grid-cols-[minmax(0,1fr)_264px]'} max-xl:grid-cols-1`}>
                <section className="relative min-h-0 overflow-hidden rounded-[18px] bg-[#303134] shadow-2xl max-sm:rounded-xl">
                    <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur max-sm:left-3 max-sm:top-3">
                        <PresentToAll sx={{ fontSize: 16 }} />
                        <span className="truncate">{gmeetProfile.firstName} is presenting</span>
                    </div>

                    <div className="flex h-full items-center justify-center p-6 max-xl:p-5 max-sm:p-3">
                        <div className="flex h-full w-full max-w-[1080px] flex-col overflow-hidden rounded-xl bg-[#f8fafd] shadow-2xl ring-1 ring-black/15">
                            <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 max-sm:px-3">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-[#ea4335]" />
                                    <span className="h-3 w-3 rounded-full bg-[#fbbc04]" />
                                    <span className="h-3 w-3 rounded-full bg-[#34a853]" />
                                </div>
                                <p className="truncate text-sm font-semibold text-gray-600">{gmeetProfile.meetingCode}</p>
                            </div>

                            <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_250px] gap-6 overflow-hidden px-8 py-7 max-2xl:grid-cols-1 max-xl:px-7 max-xl:py-6 max-sm:px-3 max-sm:py-4">
                                <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
                                    <p className="text-xs font-bold uppercase tracking-wide text-[#1a73e8]">{selectedTopic.type}</p>
                                    <h1 className="mt-3 line-clamp-2 text-3xl font-semibold leading-[1.1] text-[#202124] max-xl:text-2xl max-sm:text-xl">
                                        {selectedTopic.title}
                                    </h1>
                                    <p className="mt-3 line-clamp-2 text-sm font-medium leading-5 text-gray-600 max-sm:text-xs">{selectedTopic.subtitle}</p>

                                    <div className="mt-5 grid shrink-0 grid-cols-3 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
                                        {selectedTopic.meta.map((item) => (
                                            <div key={`${item.label}-${item.value}`} className="min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                                <p className="text-[11px] font-bold uppercase text-gray-500">{item.label}</p>
                                                <p className="mt-1 truncate text-xs font-semibold capitalize text-[#202124]">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {isSkillTopic ? (
                                        <div className="mt-5 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#d7e3fc] bg-[#eef3fd] p-5 scrollbar-none max-sm:p-4">
                                            <div className="grid grid-cols-4 gap-2.5 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
                                                {selectedTopic.details.map((skill) => (
                                                    <div key={`${selectedTopic.id}-${skill}`} className="truncate rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#202124] shadow-sm">
                                                        {skill}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-none">
                                            {selectedTopic.details.map((detail, index) => (
                                                <div key={`${selectedTopic.id}-${detail}`} className="grid grid-cols-[36px_1fr] rounded-xl bg-[#eef3fd] px-4 py-3 text-xs leading-5 text-[#202124]">
                                                    <span className="font-semibold text-[#1a73e8]">{index + 1}</span>
                                                    <span>{detail}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 max-2xl:hidden">
                                    <div className="flex items-center gap-3">
                                        <img src={selectedParticipant.avatar} alt={selectedParticipant.name} className="h-14 w-14 rounded-full object-cover" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-[#202124]">{selectedParticipant.name}</p>
                                            <p className="truncate text-xs text-gray-500">{selectedParticipant.role}</p>
                                        </div>
                                    </div>
                                    <p className="mt-5 line-clamp-4 text-xs leading-5 text-gray-600">{selectedParticipant.note}</p>
                                    <div className="mt-5 max-h-[180px] overflow-y-auto pr-1 scrollbar-none">
                                        <div className="flex flex-wrap gap-2">
                                        {selectedTopic.chips.slice(0, 8).map((chip) => (
                                            <span key={chip} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                {chip}
                                            </span>
                                        ))}
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-lg bg-black/55 px-3 py-2 text-sm font-semibold text-white backdrop-blur max-sm:left-3 max-sm:text-xs">
                        {!micOn && <MicOff sx={{ fontSize: 18 }} />}
                        {!cameraOn && <VideocamOff sx={{ fontSize: 18 }} />}
                        {handRaised && <BackHandOutlined sx={{ fontSize: 18 }} className="text-[#fdd663]" />}
                        <span className="truncate">{gmeetProfile.name}</span>
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
                                className={`relative overflow-hidden rounded-[18px] bg-[#303134] text-left transition ${
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

            <div className="shrink-0 rounded-2xl bg-[#202124] p-2 shadow-xl ring-1 ring-white/10">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {topicTypes.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => setActiveType(type.value)}
                            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
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
                            className={`min-w-[220px] rounded-xl border px-4 py-3 text-left transition max-sm:min-w-[190px] ${
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
