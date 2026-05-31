import React, { useMemo, useState } from 'react';
import {
    Add,
    Close,
    InfoOutlined,
    MicOff,
    MoreVert,
    Search,
} from '@mui/icons-material';
import {
    gmeetChatMessages,
    gmeetParticipants,
    gmeetProfile,
    gmeetTopics,
} from './gmeetPortfolio';
import type { GmeetPanel, GmeetTopic } from './gmeetPortfolio';

interface SidebarProps {
    activePanel: GmeetPanel;
    onClose: () => void;
    selectedTopic: GmeetTopic;
    onSelectTopic: (topic: GmeetTopic) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activePanel,
    onClose,
    selectedTopic,
    onSelectTopic,
}) => {
    const [query, setQuery] = useState('');

    const filteredParticipants = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return gmeetParticipants.filter((participant) => !normalizedQuery || [
            participant.name,
            participant.role,
            participant.category,
            participant.note,
        ].join(' ').toLowerCase().includes(normalizedQuery));
    }, [query]);

    const filteredTopics = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return gmeetTopics.filter((topic) => !normalizedQuery || [
            topic.title,
            topic.subtitle,
            topic.type,
            ...topic.details,
            ...topic.chips,
        ].join(' ').toLowerCase().includes(normalizedQuery));
    }, [query]);

    if (!activePanel) return null;

    const selectParticipantTopic = (topicId?: string) => {
        if (!topicId) return;
        const topic = gmeetTopics.find((item) => item.id === topicId);
        if (topic) onSelectTopic(topic);
    };

    return (
        <aside className="fixed bottom-[88px] right-4 top-4 z-30 w-[360px] overflow-hidden rounded-3xl bg-white text-[#202124] shadow-2xl max-lg:bottom-[116px] max-lg:left-3 max-lg:right-3 max-lg:top-auto max-lg:max-h-[62dvh] max-lg:w-auto max-sm:bottom-[148px] max-sm:rounded-2xl">
            <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <h2 className="text-xl font-medium">
                            {activePanel === 'people' ? 'People' : activePanel === 'chat' ? 'In-call messages' : 'Meeting details'}
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">{gmeetProfile.meetingCode}</p>
                    </div>
                    <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-gray-100">
                        <Close className="text-gray-600" />
                    </button>
                </div>

                {activePanel === 'people' && (
                    <div className="flex min-h-0 flex-1 flex-col">
                        <div className="space-y-3 p-4">
                            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100">
                                <Add fontSize="small" />
                                Add people
                            </button>
                            <label className="flex items-center rounded-xl border bg-gray-50 px-3 py-2">
                                <Search className="mr-2 text-gray-400" fontSize="small" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search people or topics"
                                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                                />
                            </label>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">In this call</p>
                            <div className="space-y-2">
                                {filteredParticipants.map((participant) => (
                                    <button
                                        key={participant.id}
                                        type="button"
                                        onClick={() => selectParticipantTopic(participant.topicId)}
                                        className={`flex w-full items-center justify-between rounded-xl p-2 text-left hover:bg-gray-50 ${
                                            participant.topicId === selectedTopic.id ? 'bg-blue-50 text-blue-700' : ''
                                        }`}
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <img src={participant.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {participant.name}{participant.id === 'host' ? ' (You)' : ''}
                                                </p>
                                                <p className="truncate text-xs text-gray-500">{participant.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1 text-gray-500">
                                            {participant.muted && <MicOff sx={{ fontSize: 17 }} />}
                                            <MoreVert fontSize="small" />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <p className="mb-2 mt-5 text-xs font-semibold uppercase text-gray-500">Agenda</p>
                            <div className="space-y-2">
                                {filteredTopics.slice(0, 8).map((topic) => (
                                    <button
                                        key={topic.id}
                                        type="button"
                                        onClick={() => onSelectTopic(topic)}
                                        className={`w-full rounded-xl p-3 text-left ${
                                            selectedTopic.id === topic.id ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    >
                                        <p className="truncate text-sm font-semibold">{topic.title}</p>
                                        <p className="mt-1 truncate text-xs text-gray-500">{topic.subtitle}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activePanel === 'chat' && (
                    <div className="flex min-h-0 flex-1 flex-col">
                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                            {gmeetChatMessages.map((message) => (
                                <button
                                    key={message.id}
                                    type="button"
                                    onClick={() => selectParticipantTopic(message.topicId)}
                                    className={`block w-full rounded-2xl p-2 text-left ${
                                        message.topicId === selectedTopic.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-sm font-semibold">{message.sender}</p>
                                        <p className="text-xs text-gray-500">{message.time}</p>
                                    </div>
                                    <p className="mt-1 rounded-2xl bg-gray-100 p-3 text-sm leading-6">{message.message}</p>
                                </button>
                            ))}
                        </div>
                        <div className="border-t p-4">
                            <input
                                type="text"
                                placeholder="Send a message to everyone"
                                className="h-11 w-full rounded-full bg-gray-100 px-4 text-sm outline-none"
                            />
                        </div>
                    </div>
                )}

                {activePanel === 'details' && (
                    <div className="min-h-0 flex-1 overflow-y-auto p-5">
                        <div className="rounded-2xl bg-blue-50 p-4">
                            <div className="flex items-center gap-2 text-blue-700">
                                <InfoOutlined sx={{ fontSize: 20 }} />
                                <p className="font-semibold">Portfolio meeting</p>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-gray-700">
                                {gmeetProfile.tagline}. Use the agenda cards to inspect project, experience, skill, and achievement details.
                            </p>
                        </div>

                        <div className="mt-5">
                            <p className="text-xs font-semibold uppercase text-gray-500">Profile links</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <a
                                    href={gmeetProfile.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                                >
                                    Resume
                                </a>
                                {Object.entries(gmeetProfile.links).filter((entry): entry is [string, string] => Boolean(entry[1])).map(([label, href]) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold capitalize text-gray-700 hover:bg-gray-200"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-xs font-semibold uppercase text-gray-500">Selected topic</p>
                            <h3 className="mt-2 text-xl font-semibold">{selectedTopic.title}</h3>
                            <p className="mt-1 text-sm text-gray-500">{selectedTopic.subtitle}</p>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {selectedTopic.meta.map((item) => (
                                    <div key={`${item.label}-${item.value}`} className="rounded-xl bg-gray-50 p-3">
                                        <p className="text-[11px] font-bold uppercase text-gray-400">{item.label}</p>
                                        <p className="mt-1 text-sm font-semibold capitalize">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-2">
                                {selectedTopic.details.map((detail, index) => (
                                    <div key={`${selectedTopic.id}-${detail}`} className="grid grid-cols-[28px_1fr] rounded-xl bg-gray-50 p-3 text-sm leading-6">
                                        <span className="font-semibold text-gray-400">{index + 1}</span>
                                        <span>{detail}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {selectedTopic.chips.map((chip) => (
                                    <span key={chip} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                        {chip}
                                    </span>
                                ))}
                            </div>
                            {selectedTopic.links.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {selectedTopic.links.map((link) => (
                                        <a
                                            key={`${selectedTopic.id}-${link.label}`}
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold capitalize text-white hover:bg-blue-700"
                                        >
                                            Open {link.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
