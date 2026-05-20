import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    HomeOutlined as HomeIcon,
    SubscriptionsOutlined as SubscriptionsIcon,
    ExploreOutlined as ExploreIcon,
    HistoryOutlined as HistoryIcon,
    WatchLaterOutlined as WatchLaterIcon,
    ThumbUpOutlined as ThumbUpIcon,
    PlaylistPlayOutlined as PlaylistIcon,
    VideoCameraFrontOutlined as VideosIcon,
    SchoolOutlined as CoursesIcon,
    ContentCutOutlined as ClipsIcon,
} from '@mui/icons-material';

const SidebarItem = ({
    icon: Icon,
    label,
    active,
    onClick,
}: {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick: () => void;
}) => (
    <motion.div
        className={`flex items-center gap-4 p-3 py-2 rounded-lg cursor-pointer ${
            active ? 'bg-[#e8e8e8] font-bold' : 'hover:bg-gray-100'
        }`}
        onClick={onClick}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
    >
        <Icon className="text-2xl" />
        <span className="text-sm">{label}</span>
    </motion.div>
);

const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { icon: HomeIcon, label: 'Home' },
        { icon: ExploreIcon, label: 'Shorts' },
        { icon: SubscriptionsIcon, label: 'Subscriptions' },
        { icon: HistoryIcon, label: 'History' },
        { icon: PlaylistIcon, label: 'Playlists' },
        { icon: VideosIcon, label: 'Your videos' },
        { icon: CoursesIcon, label: 'Your courses' },
        { icon: WatchLaterIcon, label: 'Watch later' },
        { icon: ThumbUpIcon, label: 'Liked videos' },
        { icon: ClipsIcon, label: 'Your clips' },
    ];

    return (
        <motion.div
            className="h-full fixed w-[200px] overflow-y-auto text-gray-900 flex flex-col"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="flex flex-col gap-2 pr-3"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1, // Stagger animation for child items
                        },
                    },
                }}
            >
                {items.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        active={index === activeIndex}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default Sidebar;