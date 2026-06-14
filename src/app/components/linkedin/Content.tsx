import React, { useMemo, useState } from 'react';
import {
    ArrowDropDown,
    Bookmark,
    BusinessCenter,
    Event,
    Groups,
    ChatBubbleOutline,
    Info,
    MoreHoriz,
    Newspaper,
    OndemandVideo,
    Person,
    Photo,
    Repeat,
    School,
    Send,
    Article,
    ThumbUpOffAlt,
    GitHub,
    LinkedIn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
    linkedinPosts,
    linkedinProfile,
    linkedinSections,
    linkedinStats,
} from './linkedinPortfolio';
import type { LinkedInPost, LinkedInSection } from './linkedinPortfolio';

type ContentProps = {
    query: string;
    onQueryChange: (query: string) => void;
    activeSection: LinkedInSection;
    onSectionChange: (section: LinkedInSection) => void;
};

const sidebarItems: { label: LinkedInSection; icon: React.ReactNode }[] = [
    { label: 'Projects', icon: <Bookmark sx={{ fontSize: 18 }} /> },
    { label: 'Open Source', icon: <Groups sx={{ fontSize: 18 }} /> },
    { label: 'Experience', icon: <BusinessCenter sx={{ fontSize: 18 }} /> },
    { label: 'Skills', icon: <Newspaper sx={{ fontSize: 18 }} /> },
    { label: 'Education', icon: <School sx={{ fontSize: 18 }} /> },
    { label: 'Achievements', icon: <Event sx={{ fontSize: 18 }} /> },
    { label: 'Research', icon: <Article sx={{ fontSize: 18 }} /> },
];

const postMatchesQuery = (post: LinkedInPost, query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return true;

    return [
        post.title,
        post.subtitle,
        post.content,
        post.metrics,
        post.section,
        ...post.details,
        ...post.chips,
    ].join(' ').toLowerCase().includes(normalizedQuery);
};

const postActions = [
    { label: 'Like', icon: <ThumbUpOffAlt sx={{ fontSize: 22 }} /> },
    { label: 'Comment', icon: <ChatBubbleOutline sx={{ fontSize: 22 }} /> },
    { label: 'Repost', icon: <Repeat sx={{ fontSize: 22 }} /> },
    { label: 'Send', icon: <Send sx={{ fontSize: 22 }} /> },
];

const socialLinks = [
    { label: 'GitHub', href: linkedinProfile.links.github, icon: GitHub },
    { label: 'LinkedIn', href: linkedinProfile.links.linkedin, icon: LinkedIn },
    { label: 'Resume', href: linkedinProfile.resumeUrl, icon: Article },
].filter((link) => Boolean(link.href));

const Content = ({ query, onQueryChange, activeSection, onSectionChange }: ContentProps) => {
    const [activePostId, setActivePostId] = useState<string | null>(null);

    const visiblePosts = useMemo(() => (
        linkedinPosts.filter((post) => {
            const matchesSection = activeSection === 'All' || post.section === activeSection;
            return matchesSection && postMatchesQuery(post, query);
        })
    ), [activeSection, query]);

    const activePost = useMemo(() => (
        visiblePosts.find((post) => post.id === activePostId) ?? null
    ), [activePostId, visiblePosts]);

    const pickSection = (section: LinkedInSection) => {
        onSectionChange(section);
        setActivePostId(null);
    };

    const openResume = () => {
        window.open(linkedinProfile.resumeUrl, '_blank', 'noreferrer');
    };

    return (
        <div className="mx-auto grid w-full max-w-[1188px] grid-cols-[225px_minmax(0,555px)_300px] items-start gap-6 px-10 pt-6 max-lg:grid-cols-[225px_minmax(0,555px)] max-sm:block max-sm:px-2 max-sm:pb-16 max-sm:pt-2">
            <aside className="sticky top-[68px] self-start max-sm:hidden flex flex-col gap-2">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex w-full flex-col items-start overflow-hidden rounded-lg border border-gray-300 bg-white"
                >
                    <div className="h-[72px] w-full bg-gradient-to-r from-[#0a66c2] to-[#00a884]" />
                    <img
                        src={linkedinProfile.avatar}
                        alt={linkedinProfile.name}
                        className="ml-4 -mt-9 h-[72px] w-[72px] rounded-full border-2 border-white object-cover"
                    />
                    <div className='w-full px-5 pb-4 text-xs'>
                        <h2 className="mt-2 text-xl font-semibold leading-tight">{linkedinProfile.name}</h2>
                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-800">{linkedinProfile.tagline}</p>
                        <p className="mt-2 text-xs text-gray-500">{linkedinProfile.education.institution}</p>
                    </div>
                </motion.div>

                <div className="flex w-full flex-col items-start rounded-lg border border-gray-300 bg-white p-4 text-sm">
                    <div className="flex w-full justify-between text-gray-600">
                        <span className='font-semibold'>Projects</span>
                        <span className="font-semibold text-[#0a66c2]">{linkedinStats.projects}</span>
                    </div>
                    <div className="flex w-full justify-between text-gray-600 mt-2">
                        <span className='font-semibold'>Experience</span>
                        <span className="font-semibold text-[#0a66c2]">{linkedinStats.experience}</span>
                    </div>
                    <div className="flex w-full justify-between text-gray-600 mt-2">
                        <span className='font-semibold'>Skills</span>
                        <span className="font-semibold text-[#0a66c2]">{linkedinStats.skills}</span>
                    </div>
                    <div className="flex w-full justify-between text-gray-600 mt-2">
                        <span className='font-semibold'>Achievements</span>
                        <span className="font-semibold text-[#0a66c2]">{linkedinStats.achievements}</span>
                    </div>
                    <div className="flex w-full justify-between text-gray-600 mt-2">
                        <span className='font-semibold'>Research</span>
                        <span className="font-semibold text-[#0a66c2]">{linkedinStats.research}</span>
                    </div>
                </div>

                <div className="flex w-full flex-col items-start rounded-lg border border-gray-300 bg-white p-2">
                    <button
                        type="button"
                        onClick={() => pickSection('All')}
                        className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-xs font-semibold ${
                            activeSection === 'All' ? 'bg-[#eaf4ff] text-[#0a66c2]' : 'text-[rgb(0,0,0,0.9)] hover:bg-[rgba(0,0,0,0.08)]'
                        }`}
                    >
                        <Person sx={{ fontSize: 18 }} /> Full profile feed
                    </button>
                    {sidebarItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => pickSection(item.label)}
                            className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-xs font-semibold ${
                                activeSection === item.label ? 'bg-[#eaf4ff] text-[#0a66c2]' : 'text-[rgb(0,0,0,0.9)] hover:bg-[rgba(0,0,0,0.08)]'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            </aside>

            <div className="min-w-0 max-sm:w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-gray-300 bg-white p-4"
                >
                    <span className='flex w-full items-center gap-3'>
                        <img src={linkedinProfile.avatar} alt="" className="h-12 w-12 rounded-full border-2 border-white object-cover" />
                        <input
                            type="text"
                            value={query}
                            onChange={(event) => onQueryChange(event.target.value)}
                            placeholder="Start a post"
                            className="h-[48px] w-full rounded-full border border-gray-400 px-5 text-sm font-semibold outline-none placeholder:text-gray-700 hover:bg-gray-50"
                        />
                    </span>
                    <div className="mt-3 grid grid-cols-3 text-sm font-semibold text-gray-600 max-sm:text-xs">
                        <button type="button" onClick={() => pickSection('Projects')} className="flex items-center justify-center gap-2 rounded-lg p-3 hover:bg-gray-100">
                            <OndemandVideo className="text-[#5f9b41]" /> Projects
                        </button>
                        <button type="button" onClick={() => pickSection('Skills')} className="flex items-center justify-center gap-2 rounded-lg p-3 hover:bg-gray-100">
                            <Photo className="text-[#378fe9]" /> Skills
                        </button>
                        <button type="button" onClick={openResume} className="flex items-center justify-center gap-2 rounded-lg p-3 hover:bg-gray-100">
                            <Article className="text-[#e16745]" /> Resume
                        </button>
                    </div>
                    <div className="mt-2 flex gap-2 overflow-x-auto border-t border-gray-100 pt-3 scrollbar-none">
                        {socialLinks.map(({ label, href, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                <Icon sx={{ fontSize: 15 }} />
                                {label}
                            </a>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1 text-sm scrollbar-none">
                    {linkedinSections.map((section) => (
                        <button
                            key={section}
                            type="button"
                            onClick={() => pickSection(section)}
                            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 font-semibold ${
                                activeSection === section
                                    ? 'border-[#0a66c2] bg-[#0a66c2] text-white'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {section}
                        </button>
                    ))}
                </div>

                <span className='my-3 flex w-full items-center gap-2 text-[12px] text-gray-600 text-nowrap'>
                    <p className='w-full border-t border-gray-400' />
                    Sort by:
                    <p className='font-semibold flex items-center'>{activeSection === 'All' ? 'Portfolio relevance' : activeSection} <ArrowDropDown sx={{ fontSize: "2em" }} /></p>
                </span>

                {visiblePosts.map((post, index) => {
                    const isActive = activePostId === post.id;

                    return (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`mb-4 rounded-lg border bg-white max-sm:mb-2 ${
                                isActive ? 'border-[#0a66c2] shadow-sm' : 'border-gray-300'
                            }`}
                        >
                            <div className="flex w-full items-start px-5 pt-4 text-left max-sm:px-2 max-sm:w-full">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                                    <img src={linkedinProfile.avatar} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div className="ml-3 min-w-0 flex-1">
                                    <h3 className="truncate text-sm font-semibold leading-5">{post.title}</h3>
                                    <p className="text-xs text-gray-500 truncate">{post.subtitle}</p>
                                    <p className="text-xs text-gray-500">{post.section} | Follow</p>
                                </div>
                                <span className='ml-2 cursor-pointer rounded-full p-1 hover:bg-gray-100'>
                                    <MoreHoriz className='text-[rgb(0,0,0,0.6)]' />
                                </span>
                            </div>
                            <p className="px-5 py-3 text-sm leading-6 max-sm:px-2">{post.content}</p>
                            <img src={post.image} alt={post.title} className="w-full mt-2 aspect-[16/9] object-cover" />
                            <div className='flex w-full justify-between px-5 py-2 text-xs text-gray-600'>
                                <span className='truncate pr-4 font-medium text-[#0a66c2]'>{post.metrics}</span>
                                <span>{index + 7} comments | {index + 3} reposts</span>
                            </div>
                            {post.links.length > 0 && (
                                <div className="flex flex-wrap gap-2 px-5 pb-3 max-sm:px-2">
                                    {post.links.slice(0, 3).map((link) => (
                                        <a
                                            key={`${post.id}-inline-${link.label}`}
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-full bg-[#eaf4ff] px-3 py-1.5 text-xs font-bold capitalize text-[#0a66c2] hover:bg-[#d7ebff]"
                                        >
                                            Open {link.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                            <div className='mx-5 border-t border-gray-200' />
                            <div className='grid grid-cols-4 gap-1 px-5 py-1 text-sm font-semibold text-gray-600 max-sm:px-1'>
                                {postActions.map((action) => (
                                    <button
                                        key={`${post.id}-${action.label}`}
                                        type='button'
                                        onClick={() => setActivePostId(isActive ? null : post.id)}
                                        className={`flex h-12 items-center justify-center gap-2 rounded-md px-2 hover:bg-gray-100 ${
                                            isActive ? 'text-[#0a66c2]' : ''
                                        }`}
                                    >
                                        {action.icon}
                                        <span className='max-sm:hidden'>{action.label}</span>
                                    </button>
                                ))}
                            </div>
                            {isActive && (
                                <div className="mx-5 mb-4 rounded-lg bg-[#f4f2ee] p-4 max-sm:mx-2">
                                    <p className="text-xs font-bold uppercase text-gray-500">Full details</p>
                                    <div className="mt-3 space-y-2">
                                        {post.details.map((detail, detailIndex) => (
                                            <div key={`${post.id}-${detail}`} className="grid grid-cols-[28px_1fr] text-sm leading-6 text-gray-700">
                                                <span className="font-semibold text-gray-400">{detailIndex + 1}</span>
                                                <span>{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {post.chips.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {post.chips.map((chip) => (
                                                <span key={`${post.id}-${chip}`} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                                                    {chip}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {post.links.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {post.links.map((link) => (
                                                <a
                                                    key={`${post.id}-${link.label}`}
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-full bg-[#0a66c2] px-4 py-2 text-xs font-bold capitalize text-white hover:bg-[#004182]"
                                                >
                                                    Open {link.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.article>
                    );
                })}

                {visiblePosts.length === 0 && (
                    <div className="rounded-lg border border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
                        No LinkedIn portfolio posts match this search.
                    </div>
                )}
            </div>

            <div className="flex flex-col max-lg:hidden">
                <div className="w-full rounded-lg border border-gray-300 bg-white pb-4">
                    <div className='flex w-full items-center justify-between px-6 pb-2 pt-5'>
                        <h3 className="text-xl font-semibold">LinkedIn News</h3>
                        <Info sx={{ fontSize: 18 }} />
                    </div>
                    <p className="px-6 pb-2 text-base font-semibold text-gray-500">Top portfolio stories</p>
                    <ul className="flex flex-col text-sm text-gray-800">
                        {linkedinPosts.filter((post) => post.section === 'Skills').map((post) => (
                            <li key={post.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        pickSection('Skills');
                                        setActivePostId(post.id);
                                    }}
                                    className={`flex w-full flex-col px-6 py-2 text-left hover:bg-[rgba(0,0,0,0.08)] ${
                                        activePost?.id === post.id ? 'bg-[#eaf4ff]' : ''
                                    }`}
                                >
                                    <span className="truncate font-semibold">{post.title}</span>
                                    <span className="mt-1 text-xs text-gray-500">{post.chips.length} skills in this group</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='fixed bottom-0 right-6 flex h-fit w-[300px] items-center rounded-t-xl border border-gray-300 bg-white p-1 px-2 shadow-xl'>
                    <img src={linkedinProfile.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                    <span className='bg-[#01754f] w-[10px] h-[10px] rounded-full self-end -ml-3 mb-0.5 border-2 border-white' />
                    <p className='px-3 font-semibold text-gray-700 text-sm'>Message {linkedinProfile.firstName}</p>
                    <span className='ml-auto'><Person sx={{ fontSize: 18 }} /></span>
                </div>
            </div>
        </div>
    );
};

export default Content;
