import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getExperiencePeriod, getPortfolioData, getProjectDate } from '@/src/services/portfolioData';

const data = getPortfolioData();

const MainContent = () => {
    const filters = [
        'All',
        'Projects',
        'Experience',
        'Skills',
        'Achievements',
        ...Object.values(data.skills).slice(0, 4).map((group) => group.label),
    ];

    const [activeFilter, setActiveFilter] = useState('All');

    const videos = [
        ...data.projects.map((project, index) => ({
            thumbnail: `https://picsum.photos/seed/${project.id}/720/405`,
            title: `${project.name}: ${project.tagline}`,
            channel: data.meta.name,
            views: `${project.tech_stack.length} technologies`,
            time: getProjectDate(project),
            duration: index % 2 ? '8:18' : '12:40',
            category: 'Projects',
        })),
        ...data.experience.map((experience, index) => ({
            thumbnail: `https://picsum.photos/seed/${experience.id}/720/405`,
            title: `${experience.role} at ${experience.company}`,
            channel: data.meta.name,
            views: `${experience.highlights.length} highlights`,
            time: getExperiencePeriod(experience),
            duration: index % 2 ? '6:25' : '10:15',
            category: 'Experience',
        })),
        ...Object.values(data.skills).map((group, index) => ({
            thumbnail: `https://picsum.photos/seed/${group.label}/720/405`,
            title: `${group.label}: ${group.items.join(', ')}`,
            channel: `${data.meta.name} Skills`,
            views: `${group.items.length} skills`,
            time: 'Portfolio stack',
            duration: index % 2 ? '4:30' : '7:05',
            category: group.label,
        })),
        ...data.achievements.map((achievement) => ({
            thumbnail: `https://picsum.photos/seed/${achievement.id}/720/405`,
            title: `${achievement.title} by ${achievement.issuer}`,
            channel: data.meta.name,
            views: achievement.type,
            time: String(achievement.year),
            duration: '3:20',
            category: 'Achievements',
        })),
    ];

    const visibleVideos = videos.filter((video) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Skills') return Object.values(data.skills).some((group) => group.label === video.category);
        return video.category === activeFilter;
    });

    return (
        <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="flex fixed z-1000 gap-3 max-h-16 max-sm:w-full w-[calc(100%-240px)] scrollbar-none overflow-x-auto py-3 px-5 bg-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {filters.map((filter) => (
                    <motion.button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-lg text-nowrap cursor-pointer text-sm ${
                            activeFilter === filter
                                ? 'bg-black text-white'
                                : 'bg-[#f0f0f0] hover:bg-[#f8f8f8] text-gray-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {filter}
                    </motion.button>
                ))}
            </motion.div>
            <motion.div
                className="w-full h-full pt-16 overflow-hidden grid grid-cols-3 max-sm:grid-cols-1 gap-4 p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {visibleVideos.map((video, index) => (
                    <VideoCard
                        key={index}
                        thumbnail={video.thumbnail}
                        title={video.title}
                        channel={video.channel}
                        views={video.views}
                        time={video.time}
                        duration={video.duration}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
};

type VideoCardProps = {
    thumbnail: string;
    title: string;
    channel: string;
    views: string;
    time: string;
    duration?: string;
};

const VideoCard: React.FC<VideoCardProps> = ({ thumbnail, title, channel, views, time, duration }) => {
    return (
        <motion.div
            className="flex flex-col gap-2 cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-auto object-cover rounded-lg hover:rounded-none transition-all"
                />
                {duration && (
                    <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-1.5 py-0.5 rounded">
                        {duration}
                    </span>
                )}
            </div>
            <div className="flex flex-col">
                <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
                <p className="text-xs text-gray-600">{channel}</p>
                <p className="text-xs text-gray-600">
                    {views} {time && `• ${time}`}
                </p>
            </div>
        </motion.div>
    );
};

export default MainContent;
