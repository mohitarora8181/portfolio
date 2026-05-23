import React from 'react';
import { motion } from 'framer-motion';
import { OpenInNew } from '@mui/icons-material';
import { youtubeChannel } from './youtubePortfolio';

const ChannelHeader = () => {
    return (
        <motion.section
            className="px-5 pt-4 pb-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >

            <div className="mt-5 flex items-start gap-4">
                <img
                    src={youtubeChannel.avatar}
                    alt={youtubeChannel.name}
                    className="h-24 w-24 rounded-full object-cover max-sm:h-16 max-sm:w-16"
                />
                <div className="min-w-0 flex-1">
                    <h2 className="text-3xl font-black max-sm:text-2xl">{youtubeChannel.name}</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        {youtubeChannel.handle} | {youtubeChannel.subscribers}
                    </p>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-700">{youtubeChannel.tagline}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {youtubeChannel.stats.map((item) => (
                            <span key={item} className="rounded-full bg-[#f2f2f2] px-3 py-1 text-xs font-semibold text-gray-700">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 max-sm:hidden">
                    <a
                        href={`mailto:${youtubeChannel.email}`}
                        className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-black/80"
                    >
                        Subscribe
                    </a>
                    <a
                        href={youtubeChannel.resumeUrl}
                        target="_blank"
                        className="rounded-full bg-[#f2f2f2] px-4 py-2 text-xs font-bold text-black hover:bg-[#e5e5e5]"
                    >
                        Resume
                    </a>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                {youtubeChannel.socials.map((social) => (
                    <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded-full bg-[#f2f2f2] px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-[#e5e5e5]"
                    >
                        {social.label}
                        <OpenInNew sx={{ fontSize: 14 }} />
                    </a>
                ))}
                <a
                    href={`mailto:${youtubeChannel.email}`}
                    className="inline-flex items-center rounded-full bg-[#f2f2f2] px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-[#e5e5e5]"
                >
                    Email
                </a>
            </div>
        </motion.section>
    );
};

export default ChannelHeader;
