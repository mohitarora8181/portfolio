import React from 'react';
import { MoreVert, OpenInNew } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { PortfolioVideo } from './youtubePortfolio';
import { youtubeChannel } from './youtubePortfolio';

type VideoCardProps = {
    video: PortfolioVideo;
};

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    return (
        <motion.article
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <div className="relative overflow-hidden rounded-xl bg-gray-100 transition-all group-hover:rounded-none">
                <img src={video.thumbnail} alt={video.title} className="aspect-video w-full object-cover" />
                <span className="absolute bottom-2 right-2 rounded bg-black px-1.5 py-0.5 text-xs font-semibold text-white">
                    {video.duration}
                </span>
            </div>
            <div className="mt-3 flex gap-3">
                <img src={youtubeChannel.avatar} alt="" className="h-9 w-9 flex-none rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold leading-5">{video.title}</h3>
                    <p className="mt-1 text-xs text-gray-600">{video.channel}</p>
                    <p className="text-xs text-gray-600">{video.meta}</p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-700">{video.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {video.chips.slice(0, 3).map((chip) => (
                            <span key={chip} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                                {chip}
                            </span>
                        ))}
                    </div>
                    {video.links.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {video.links.slice(0, 3).map((link) => (
                                <a
                                    key={`${video.id}-${link.label}`}
                                    href={link.href}
                                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                                    rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                                    className="inline-flex items-center gap-1 rounded-full bg-[#eef3fd] px-2 py-0.5 text-[11px] font-semibold capitalize text-[#065fd4] hover:bg-[#dbe8ff]"
                                >
                                    {link.label}
                                    <OpenInNew sx={{ fontSize: 11 }} />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                <MoreVert sx={{ fontSize: 20 }} className="mt-0.5 text-gray-700 opacity-0 group-hover:opacity-100" />
            </div>
        </motion.article>
    );
};

export default VideoCard;
