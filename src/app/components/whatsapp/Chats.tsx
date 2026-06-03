import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Article, GitHub, Group, LinkedIn, MoreVert, Search, AddCommentOutlined } from "@mui/icons-material";
import { portfolioChats, whatsappProfile } from "./whatsappPortfolio";
import type { Chat, ChatCategory } from "./whatsappPortfolio";

export type { Chat, Message } from "./whatsappPortfolio";

type ChatsProps = {
    selectedChat: Chat | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
};

const filters: { label: string; value: ChatCategory }[] = [
    { label: "All", value: "all" },
    { label: "Unread", value: "unread" },
    { label: "Favorites", value: "favorites" },
    { label: "Groups", value: "groups" },
];

const socialLinks = [
    { label: "GitHub", href: whatsappProfile.links.github, icon: GitHub },
    { label: "LinkedIn", href: whatsappProfile.links.linkedin, icon: LinkedIn },
    { label: "Resume", href: whatsappProfile.resumeUrl, icon: Article },
].filter((link) => Boolean(link.href));

export const Chats: React.FC<ChatsProps> = ({ setSelectedChat, selectedChat }) => {
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<ChatCategory>("all");

    const visibleChats = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return portfolioChats.filter((chat) => {
            const matchesFilter = chat.category.includes(activeFilter);
            const matchesQuery = !normalizedQuery || [
                chat.name,
                chat.message,
                ...chat.messages.map((message) => message.text),
            ].join(" ").toLowerCase().includes(normalizedQuery);

            return matchesFilter && matchesQuery;
        });
    }, [activeFilter, query]);

    return (
        <motion.aside
            className="flex h-full w-[450px] min-w-[450px] flex-col overflow-hidden bg-white max-sm:w-full max-sm:min-w-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="px-4 pt-4">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">WhatsApp</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#f0f2f5]">
                            <AddCommentOutlined htmlColor="rgb(84, 101, 111)" />
                        </button>
                        <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#f0f2f5]">
                            <MoreVert htmlColor="rgb(84, 101, 111)" />
                        </button>
                    </div>
                </div>

                <div className="relative rounded-lg bg-[#f0f2f5]">
                    <Search sx={{ fontSize: "20px" }} className="absolute left-3 top-2.5 text-gray-500" />
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search portfolio chats"
                        className="w-full rounded-lg bg-transparent p-2 pl-10 text-sm outline-none placeholder:text-gray-500"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setActiveFilter(filter.value)}
                            className={`w-fit rounded-2xl px-3 py-1 text-sm transition ${
                                activeFilter === filter.value
                                    ? "bg-[#e7fce3] text-[#008069]"
                                    : "bg-[#f0f2f5] text-gray-500 hover:bg-[#e9edef]"
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-none">
                    {socialLinks.map(({ label, href, icon: Icon }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#f0f2f5] px-3 py-1.5 text-xs font-semibold text-[#54656f] hover:bg-[#e9edef]"
                        >
                            <Icon sx={{ fontSize: 15 }} />
                            {label}
                        </a>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none">
                {visibleChats.map((chat) => (
                    <button
                        key={chat.id}
                        type="button"
                        className={`flex w-full cursor-pointer gap-3 border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-100 ${
                            selectedChat?.id === chat.id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => setSelectedChat(chat)}
                    >
                        <span className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-full bg-[#dddddd]">
                            {chat.id === "profile" ? (
                                <img src={whatsappProfile.avatar} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <Group htmlColor="white" />
                            )}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-3">
                                <span className="truncate text-[15px] font-medium">{chat.name}</span>
                                <span className="flex-none text-xs text-gray-400">{chat.time}</span>
                            </span>
                            <span className="mt-1 block truncate text-sm text-gray-500">{chat.message}</span>
                        </span>
                    </button>
                ))}
                {visibleChats.length === 0 && (
                    <div className="px-6 py-16 text-center text-sm text-gray-500">
                        No portfolio chats found.
                    </div>
                )}
            </div>
        </motion.aside>
    );
};

export default Chats;
