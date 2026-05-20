'use client'

import React, { useState } from 'react'
import Footer from '../components/gmeet/Footer'
import VideoTiles from '../components/gmeet/VideoTiles'

const Page = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className='h-full w-full bg-black'>
            <VideoTiles
                isSpeaking={isSpeaking}
                setIsSpeaking={setIsSpeaking}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <Footer sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
    )
}

export default Page
