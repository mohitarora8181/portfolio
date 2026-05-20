'use client'
import React, { use, useEffect, useState } from 'react'
import Sidebar from '../components/whatsapp/Sidebar'
import Chats from '../components/whatsapp/Chats'
import ChatView from '../components/whatsapp/ChatView'

const page = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [isMobileView, setMobileView] = useState(false);


    useEffect(() => {
        if ((typeof window !== "undefined")) {
            if (window?.innerWidth < 746) {
                setMobileView(true);
            }
        }
    }, [])

    return (
        <div className='w-full h-full bg-[#eae6df]'>
            <div className='w-full h-[128px] bg-[#00a884]'>
                <div className='absolute left-0 top-0 w-full h-full bg-transparent p-5 max-sm:p-1'>
                    <div className='bg-[#f0f2f5] w-full h-full flex overflow-hidden shadow-xl'>
                        <Sidebar />
                        {isMobileView ? !selectedChat
                            ? <Chats selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
                            : <ChatView selectedChat={selectedChat} setSelectedChat={setSelectedChat} /> :
                            <>
                                <Chats selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
                                <ChatView selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
