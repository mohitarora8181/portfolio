import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ChannelHeader from './ChannelHeader';
import FilterBar from './FilterBar';
import VideoCard from './VideoCard';
import { youtubeFilters, youtubeVideos } from './youtubePortfolio';

type MainContentProps = {
    sidebarOpen: boolean;
    activeFilter: string;
    onFilterChange: (filter: string) => void;
};

const MainContent: React.FC<MainContentProps> = ({ sidebarOpen, activeFilter, onFilterChange }) => {
    const visibleVideos = useMemo(() => {
        if (activeFilter === 'All') return youtubeVideos;
        if (activeFilter === 'Skills') {
            return youtubeVideos.filter((video) => !youtubeFilters.slice(0, 9).includes(video.section));
        }

        return youtubeVideos.filter((video) => video.section === activeFilter);
    }, [activeFilter]);

    return (
        <motion.div
            className="min-h-full bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            <ChannelHeader />
            <FilterBar
                activeFilter={activeFilter}
                filters={youtubeFilters}
                onChange={onFilterChange}
                sidebarOpen={sidebarOpen}
            />
            <section className="grid grid-cols-3 gap-x-4 gap-y-8 p-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
                {visibleVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </section>
            {visibleVideos.length === 0 && (
                <div className="px-5 py-20 text-center text-sm text-gray-500">
                    No portfolio videos in this section yet.
                </div>
            )}
        </motion.div>
    );
};

export default MainContent;
