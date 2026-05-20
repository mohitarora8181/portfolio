import React, { useEffect, useState } from 'react';
import {
    Mic,
    Videocam,
    PresentToAll,
    MoreVert,
    CallEnd,
    Apps,
    BackHandOutlined,
    ClosedCaptionOff,
    InfoOutline,
    LockPersonOutlined,
    Mood,
    PeopleOutline,
    ChatOutlined
} from '@mui/icons-material';
import { getPortfolioData } from '@/src/services/portfolioData';

const data = getPortfolioData();

interface FooterProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Footer: React.FC<FooterProps> = ({ sidebarOpen, toggleSidebar }) => {
    const [currentTime, setCurrentTime] = useState('');

    const mainControls = [
        { icon: <Mic className="w-6 h-6" /> },
        { icon: <Videocam className="w-6 h-6" /> },
        { icon: <ClosedCaptionOff className="w-6 h-6" /> },
        { icon: <Mood className="w-6 h-6" /> },
        { icon: <PresentToAll className="w-6 h-6" /> },
        { icon: <BackHandOutlined className="w-6 h-6" /> },
        { icon: <MoreVert className="w-6 h-6" /> },
    ];

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).toUpperCase();
            setCurrentTime(timeString);
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-[#131314] py-4 px-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <span className="text-white text-md">{currentTime}</span>
                    <span className="text-white text-md">|</span>
                    <span className="text-white text-md">{data.meta.name.toLowerCase().replaceAll(' ', '-')}-portfolio</span>
                </div>

                <div className="flex items-center space-x-2">
                    {mainControls.map((control, index) => (
                        <button
                            key={index}
                            className="p-3 px-5 rounded-full hover:bg-[#3c3e3e] bg-[#333537] cursor-pointer text-white"
                        >
                            {control.icon}
                        </button>
                    ))}
                    <button className="p-3 px-6 rounded-full bg-[#ea4335] hover:bg-red-700 text-white cursor-pointer">
                        <CallEnd className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-2 rounded-full hover:bg-[#3c3e3e] text-white cursor-pointer">
                        <InfoOutline className="w-6 h-6" />
                    </button>
                    <button
                        className={`p-2 rounded-full ${sidebarOpen ? 'bg-[#3c3e3e]' : 'hover:bg-[#3c3e3e]'} text-white cursor-pointer`}
                        onClick={toggleSidebar}
                    >
                        <PeopleOutline className="w-6 h-6" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-[#3c3e3e] text-white cursor-pointer">
                        <ChatOutlined className="w-6 h-6" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-[#3c3e3e] text-white cursor-pointer">
                        <Apps className="w-6 h-6" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-[#3c3e3e] text-white cursor-pointer">
                        <LockPersonOutlined className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
