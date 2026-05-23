import React from 'react';
import { motion } from 'framer-motion';
import {
    HomeOutlined as HomeIcon,
    CodeOutlined as CodeIcon,
    ExploreOutlined as ExploreIcon,
    WorkOutlineOutlined as WorkIcon,
    WatchLaterOutlined as WatchLaterIcon,
    ThumbUpOutlined as ThumbUpIcon,
    PlaylistPlayOutlined as PlaylistIcon,
    VideoCameraFrontOutlined as VideosIcon,
    SchoolOutlined as CoursesIcon,
    ContactMailOutlined as ContactIcon,
    StarsOutlined as StarsIcon,
} from '@mui/icons-material';
import { youtubeSidebarItems } from './youtubePortfolio';

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
    <motion.button
        type="button"
        className={`box-border flex w-full min-w-0 items-center gap-4 rounded-lg p-3 py-2 text-left ${
            active ? 'bg-[#e8e8e8] font-bold' : 'hover:bg-gray-100'
        }`}
        onClick={onClick}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileTap={{ scale: 0.98 }}
    >
        <Icon className="flex-none text-2xl" />
        <span className="min-w-0 truncate text-sm">{label}</span>
    </motion.button>
);

type SidebarProps = {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeFilter, onFilterChange }) => {
    const iconByFilter: Record<string, React.ElementType> = {
        All: HomeIcon,
        Projects: ExploreIcon,
        Experience: WorkIcon,
        Skills: PlaylistIcon,
        Achievements: WatchLaterIcon,
        Education: CoursesIcon,
        'Open Source': VideosIcon,
        Featured: ThumbUpIcon,
        Contact: ContactIcon,
    };

    const items = youtubeSidebarItems.map((item, index) => ({
        icon: iconByFilter[item.filter] ?? (index % 2 === 0 ? CodeIcon : StarsIcon),
        label: item.label,
        filter: item.filter,
    }));

    return (
        <motion.div
            className="youtube-sidebar-scroll sticky top-[72px] flex h-[calc(100vh-72px)] w-[200px] flex-col overflow-y-auto text-gray-900"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="box-border flex w-full flex-col gap-2 pr-3"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.04,
                        },
                    },
                }}
            >
                {items.map((item) => (
                    <SidebarItem
                        key={item.filter}
                        icon={item.icon}
                        label={item.label}
                        active={item.filter === activeFilter}
                        onClick={() => onFilterChange(item.filter)}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default Sidebar;
