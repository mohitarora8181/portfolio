'use client'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/whatsapp/Sidebar'
import Chats from '../components/whatsapp/Chats'
import ChatView from '../components/whatsapp/ChatView'
import type { Chat } from '../components/whatsapp/Chats'
import { portfolioChats } from '../components/whatsapp/whatsappPortfolio'

const Page = () => {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(portfolioChats[0] ?? null);
    const [isMobileView, setMobileView] = useState(false);


    useEffect(() => {
        const updateViewport = () => {
            const isMobile = window.innerWidth < 746;
            setMobileView(isMobile);
            setSelectedChat((currentChat) => {
                if (isMobile) return null;
                return currentChat ?? portfolioChats[0] ?? null;
            });
        };

        updateViewport();
        window.addEventListener("resize", updateViewport);

        return () => window.removeEventListener("resize", updateViewport);
    }, [])

    return (
        <div className='h-dvh w-full overflow-hidden bg-[#eae6df]'>
            <div className='w-full h-[128px] bg-[#00a884]'>
                <div className='absolute left-0 top-0 w-full h-full bg-transparent max-sm:p-0'>
                    <div className='mx-auto flex h-full w-full max-w-[1600px] overflow-hidden bg-[#F7F5F3] shadow-xl'>
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

export default Page
