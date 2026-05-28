import React, { useEffect, useState } from 'react';
import {
    Mic,
    MicOff,
    Videocam,
    VideocamOff,
    PresentToAll,
    MoreVert,
    CallEnd,
    Apps,
    BackHandOutlined,
    InfoOutline,
    LockPersonOutlined,
    Mood,
    PeopleOutline,
    ChatOutlined,
    ClosedCaptionOff,
} from '@mui/icons-material';
import { gmeetProfile } from './gmeetPortfolio';
import type { GmeetPanel } from './gmeetPortfolio';

interface FooterProps {
    activePanel: GmeetPanel;
    onTogglePanel: (panel: Exclude<GmeetPanel, null>) => void;
    micOn: boolean;
    cameraOn: boolean;
    handRaised: boolean;
    onToggleMic: () => void;
    onToggleCamera: () => void;
    onToggleHand: () => void;
}

const Footer: React.FC<FooterProps> = ({
    activePanel,
    onTogglePanel,
    micOn,
    cameraOn,
    handRaised,
    onToggleMic,
    onToggleCamera,
    onToggleHand,
}) => {
    const [currentTime, setCurrentTime] = useState('');
    const [captionsOn, setCaptionsOn] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }).toUpperCase());
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    const centerControls = [
        {
            label: micOn ? 'Turn off microphone' : 'Turn on microphone',
            icon: micOn ? <Mic /> : <MicOff />,
            active: !micOn,
            danger: !micOn,
            onClick: onToggleMic,
        },
        {
            label: cameraOn ? 'Turn off camera' : 'Turn on camera',
            icon: cameraOn ? <Videocam /> : <VideocamOff />,
            active: !cameraOn,
            danger: !cameraOn,
            onClick: onToggleCamera,
        },
        {
            label: 'Captions',
            icon: <ClosedCaptionOff />,
            active: captionsOn,
            onClick: () => setCaptionsOn((value) => !value),
        },
        {
            label: 'Reactions',
            icon: <Mood />,
            active: false,
            onClick: () => undefined,
        },
        {
            label: 'Present now',
            icon: <PresentToAll />,
            active: false,
            onClick: () => onTogglePanel('details'),
        },
        {
            label: handRaised ? 'Lower hand' : 'Raise hand',
            icon: <BackHandOutlined />,
            active: handRaised,
            onClick: onToggleHand,
        },
        {
            label: 'More options',
            icon: <MoreVert />,
            active: false,
            onClick: () => undefined,
        },
    ];

    const rightControls = [
        { label: 'Meeting details', icon: <InfoOutline />, panel: 'details' as const },
        { label: 'People', icon: <PeopleOutline />, panel: 'people' as const },
        { label: 'Chat', icon: <ChatOutlined />, panel: 'chat' as const },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#202124] px-6 py-4 max-sm:px-3">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-lg:grid-cols-[1fr_auto] max-sm:flex max-sm:flex-col">
                <div className="flex min-w-0 items-center gap-3 text-sm text-white max-sm:hidden">
                    <span>{currentTime}</span>
                    <span className="text-gray-500">|</span>
                    <span className="truncate">{gmeetProfile.meetingCode}</span>
                </div>

                <div className="flex items-center gap-3">
                    {centerControls.map((control) => (
                        <button
                            key={control.label}
                            type="button"
                            aria-label={control.label}
                            onClick={control.onClick}
                            className={`grid h-12 w-12 place-items-center rounded-full text-white transition ${
                                control.danger
                                    ? 'bg-[#ea4335] hover:bg-[#d93025]'
                                    : control.active
                                        ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa]'
                                        : 'bg-[#3c4043] hover:bg-[#4a4d51]'
                            }`}
                        >
                            {control.icon}
                        </button>
                    ))}
                    <button
                        type="button"
                        aria-label="Leave call"
                        className="grid h-12 min-w-[72px] place-items-center rounded-full bg-[#ea4335] px-6 text-white hover:bg-[#d93025]"
                    >
                        <CallEnd />
                    </button>
                </div>

                <div className="flex items-center justify-end gap-1 max-lg:hidden">
                    {rightControls.map((control) => (
                        <button
                            key={control.label}
                            type="button"
                            aria-label={control.label}
                            onClick={() => onTogglePanel(control.panel)}
                            className={`grid h-10 w-10 place-items-center rounded-full text-white ${
                                activePanel === control.panel ? 'bg-[#3c4043]' : 'hover:bg-[#3c4043]'
                            }`}
                        >
                            {control.icon}
                        </button>
                    ))}
                    <button className="grid h-10 w-10 place-items-center rounded-full text-white hover:bg-[#3c4043]">
                        <Apps />
                    </button>
                    <button className="grid h-10 w-10 place-items-center rounded-full text-white hover:bg-[#3c4043]">
                        <LockPersonOutlined />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
