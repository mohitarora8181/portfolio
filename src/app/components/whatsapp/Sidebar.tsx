import React from 'react';
import { motion } from 'framer-motion';
import {
    ChatOutlined,
    DonutLargeOutlined,
    GroupsOutlined,
    SettingsOutlined,
    StarBorderOutlined,
} from '@mui/icons-material';
import { whatsappProfile } from './whatsappPortfolio';

const actions = [
    { icon: ChatOutlined, label: 'Chats', active: true },
    { icon: DonutLargeOutlined, label: 'Status' },
    { icon: StarBorderOutlined, label: 'Favorites' },
    { icon: GroupsOutlined, label: 'Communities' },
];

const Sidebar = () => {
    return (
        <motion.aside
            className='flex h-full w-[64px] flex-none flex-col items-center justify-between border-r border-[#e9edef] bg-[#f0f2f5] py-4 max-sm:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col gap-2">
                {actions.map(({ icon: Icon, label, active }) => (
                    <button
                        key={label}
                        type="button"
                        aria-label={label}
                        className={`grid h-10 w-10 place-items-center rounded-full transition ${
                            active ? 'bg-[rgba(11,20,26,.1)]' : 'hover:bg-[rgba(11,20,26,.08)]'
                        }`}
                    >
                        <Icon htmlColor="rgb(84, 101, 111)" />
                    </button>
                ))}
            </div>

            <div className="flex flex-col items-center gap-3">
                <button
                    type="button"
                    aria-label="Settings"
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-[rgba(11,20,26,.08)]"
                >
                    <SettingsOutlined htmlColor="rgb(84, 101, 111)" />
                </button>
                <img
                    src={whatsappProfile.avatar}
                    alt={whatsappProfile.name}
                    className="h-10 w-10 rounded-full object-cover"
                />
            </div>
        </motion.aside>
    );
};

export default Sidebar;
