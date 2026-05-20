import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MainContent = () => {
    const filters = [
        'All',
        'Data Structures',
        'APIs',
        'Shark Tank',
        'Trailers',
        'Software development',
        'Neural network',
        'Dramedy',
        'Live',
        'Cricket',
        'Calculus',
        'Soundtracks',
    ];

    const [activeFilter, setActiveFilter] = useState('All');

    const videos = [
        {
            thumbnail: 'https://i.ytimg.com/vi/rBeyHDKLVqM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA0I7b7NzJWYkrcq6fdkdzilbNWZw',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/JeiCxJP7IK4/hqdefault.jpg?sqp=-oaymwEnCOADEI4CSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBr8X6vwYsojfbmqJKo1wa6KUb4OQ',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/eChzTni31Ms/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCCP35P7Luzg3ZO7YUDROeITZp-KA',
            title: "'Dorabi' की Design Sensibilities | Shark Tank India S4",
            channel: 'Sony LIV',
            views: '455K views',
            time: '4 weeks ago',
            duration: '22:49',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/rBeyHDKLVqM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA0I7b7NzJWYkrcq6fdkdzilbNWZw',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/JeiCxJP7IK4/hqdefault.jpg?sqp=-oaymwEnCOADEI4CSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBr8X6vwYsojfbmqJKo1wa6KUb4OQ',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/eChzTni31Ms/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCCP35P7Luzg3ZO7YUDROeITZp-KA',
            title: "'Dorabi' की Design Sensibilities | Shark Tank India S4",
            channel: 'Sony LIV',
            views: '455K views',
            time: '4 weeks ago',
            duration: '22:49',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/rBeyHDKLVqM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA0I7b7NzJWYkrcq6fdkdzilbNWZw',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/JeiCxJP7IK4/hqdefault.jpg?sqp=-oaymwEnCOADEI4CSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBr8X6vwYsojfbmqJKo1wa6KUb4OQ',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/eChzTni31Ms/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCCP35P7Luzg3ZO7YUDROeITZp-KA',
            title: "'Dorabi' की Design Sensibilities | Shark Tank India S4",
            channel: 'Sony LIV',
            views: '455K views',
            time: '4 weeks ago',
            duration: '22:49',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/rBeyHDKLVqM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA0I7b7NzJWYkrcq6fdkdzilbNWZw',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/JeiCxJP7IK4/hqdefault.jpg?sqp=-oaymwEnCOADEI4CSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBr8X6vwYsojfbmqJKo1wa6KUb4OQ',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/eChzTni31Ms/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCCP35P7Luzg3ZO7YUDROeITZp-KA',
            title: "'Dorabi' की Design Sensibilities | Shark Tank India S4",
            channel: 'Sony LIV',
            views: '455K views',
            time: '4 weeks ago',
            duration: '22:49',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/rBeyHDKLVqM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA0I7b7NzJWYkrcq6fdkdzilbNWZw',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/JeiCxJP7IK4/hqdefault.jpg?sqp=-oaymwEnCOADEI4CSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBr8X6vwYsojfbmqJKo1wa6KUb4OQ',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/eChzTni31Ms/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCCP35P7Luzg3ZO7YUDROeITZp-KA',
            title: "'Dorabi' की Design Sensibilities | Shark Tank India S4",
            channel: 'Sony LIV',
            views: '455K views',
            time: '4 weeks ago',
            duration: '22:49',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/rBeyHDKLVqM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA0I7b7NzJWYkrcq6fdkdzilbNWZw',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/JeiCxJP7IK4/hqdefault.jpg?sqp=-oaymwEnCOADEI4CSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBr8X6vwYsojfbmqJKo1wa6KUb4OQ',
            title: 'Kubernetes for Beginners in One Video 🔥',
            channel: 'M Prashant',
            views: '222K views',
            time: '1 year ago',
            duration: '3:03:29',
        },
        {
            thumbnail: 'https://i.ytimg.com/vi/eChzTni31Ms/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCCP35P7Luzg3ZO7YUDROeITZp-KA',
            title: "'Dorabi' की Design Sensibilities | Shark Tank India S4",
            channel: 'Sony LIV',
            views: '455K views',
            time: '4 weeks ago',
            duration: '22:49',
        },
    ];

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
                {videos.map((video, index) => (
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