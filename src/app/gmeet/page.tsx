'use client'

import React, { useState } from 'react'
import Footer from '../components/gmeet/Footer'
import VideoTiles from '../components/gmeet/VideoTiles'
import Sidebar from '../components/gmeet/Sidebar'
import { defaultGmeetTopic } from '../components/gmeet/gmeetPortfolio'
import type { GmeetPanel, GmeetTopic } from '../components/gmeet/gmeetPortfolio'

const Page = () => {
    const [activePanel, setActivePanel] = useState<GmeetPanel>('people');
    const [selectedTopic, setSelectedTopic] = useState<GmeetTopic>(defaultGmeetTopic);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [handRaised, setHandRaised] = useState(false);

    const togglePanel = (panel: Exclude<GmeetPanel, null>) => {
        setActivePanel((currentPanel) => currentPanel === panel ? null : panel);
    };

    return (
        <div className='h-screen w-full overflow-hidden bg-[#202124]'>
            <VideoTiles
                activePanel={activePanel}
                selectedTopic={selectedTopic}
                onSelectTopic={setSelectedTopic}
                micOn={micOn}
                cameraOn={cameraOn}
                handRaised={handRaised}
            />
            <Sidebar
                activePanel={activePanel}
                onClose={() => setActivePanel(null)}
                selectedTopic={selectedTopic}
                onSelectTopic={setSelectedTopic}
            />
            <Footer
                activePanel={activePanel}
                onTogglePanel={togglePanel}
                micOn={micOn}
                cameraOn={cameraOn}
                handRaised={handRaised}
                onToggleMic={() => setMicOn((value) => !value)}
                onToggleCamera={() => setCameraOn((value) => !value)}
                onToggleHand={() => setHandRaised((value) => !value)}
            />
        </div>
    )
}

export default Page
