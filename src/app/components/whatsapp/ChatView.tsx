import React, { useState } from 'react';
import { AttachFile, MoreVert, Search, Mic, Send, EmojiEmotionsOutlined, Person, ArrowBack, LockOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Chat, Message } from './Chats';
import { whatsappProfile } from './whatsappPortfolio';

type ChatViewProps = {
    selectedChat: Chat | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
};

const linkPattern = /(https?:\/\/[^\s|]+|www\.[^\s|]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

const renderLinkedText = (text: string) => {
    const parts = text.split(linkPattern);

    return parts.map((part, index) => {
        if (!part.match(linkPattern)) return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;

        const isEmail = part.includes('@') && !part.startsWith('http') && !part.startsWith('www.');
        const href = isEmail ? `mailto:${part}` : part.startsWith('http') ? part : `https://${part}`;

        return (
            <a
                key={`${part}-${index}`}
                href={href}
                target={isEmail ? undefined : '_blank'}
                rel={isEmail ? undefined : 'noreferrer'}
                className="font-medium text-[#027eb5] underline-offset-2 hover:underline"
            >
                {part}
            </a>
        );
    });
};

const ChatView: React.FC<ChatViewProps> = ({ selectedChat, setSelectedChat }) => {
    const [isTyping, setisTyping] = useState(false);

    if (!selectedChat) {
        return (
            <section className="flex h-full w-full flex-col items-center justify-center bg-[#f7f5f3] px-8 text-center">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-[#e2f0ed]">
                    <img src={whatsappProfile.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
                </div>
                <h2 className="mt-6 text-3xl font-light text-[#41525d]">WhatsApp Portfolio</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#667781]">
                    Select a chat to explore {whatsappProfile.name}&apos;s profile, experience, projects, skills, and achievements.
                </p>
                <div className="mt-10 flex items-center gap-2 text-xs text-[#8696a0]">
                    <LockOutlined sx={{ fontSize: 14 }} />
                    End-to-end inspired portfolio experience
                </div>
            </section>
        );
    }

    return (
        <motion.div
            className="w-full h-full flex flex-col bg-[#efeae2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={selectedChat.id}
        >
            <>
                    <motion.div
                        className="flex items-center justify-between gap-3 px-4 py-3 bg-[#FFFFFF] border-b border-gray-300 max-sm:px-3"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex min-w-0 items-center space-x-3 cursor-pointer">
                            <motion.div onClick={() => setSelectedChat(null)} className='text-gray-600 cursor-pointer hidden max-sm:block'>
                                <ArrowBack />
                            </motion.div>
                            <motion.div
                                className="w-10 h-10 flex justify-center items-center rounded-full bg-[#dddddd]"
                                whileHover={{ scale: 1.1 }}
                            >
                                <img src={whatsappProfile.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                            </motion.div>
                            <div className="min-w-0">
                                <h1 className="truncate text-sm font-medium">{selectedChat.name}</h1>
                                <p className="text-xs text-gray-500">{selectedChat.messages.length} portfolio messages</p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center space-x-3">
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <Search className="text-gray-600 cursor-pointer" />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <MoreVert className="text-gray-600 cursor-pointer" />
                            </motion.div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#efeae2] bg-repeat bg-[url(https://static.whatsapp.net/rsrc.php/v4/yl/r/gi_DckOUM5a.png)] max-sm:p-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {selectedChat.messages.map((message: Message, index: number) => {
                            const showIcon = index === 0 || selectedChat.messages[index - 1].isSender !== message.isSender;
                            const showDateTag = message.dateTag && selectedChat.messages[index - 1]?.dateTag !== message.dateTag;
                            return (
                                <React.Fragment key={`${message.text}-${index}`}>
                                    {showDateTag && (
                                        <div className="flex justify-center">
                                            <span className="rounded-lg bg-white/90 px-3 py-1 text-xs font-medium text-[#54656f] shadow-sm">
                                                {message.dateTag}
                                            </span>
                                        </div>
                                    )}
                                    <motion.div
                                        className={`flex ${message.isSender ? 'items-end justify-end' : 'items-start'} gap-2`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.06, duration: 0.25 }}
                                    >
                                        {!message.isSender && (
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-transparent flex-shrink-0"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                {showIcon && (
                                                    <img src={whatsappProfile.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                                                )}
                                            </motion.div>
                                        )}
                                        <motion.div
                                            className={`${message.isSender ? 'bg-[#d9fdd3]' : 'bg-white'
                                                } max-w-[70%] rounded-lg px-4 py-2 shadow-sm max-sm:max-w-[86%] max-sm:px-3`}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <p className="whitespace-pre-wrap break-words text-sm leading-5">{renderLinkedText(message.text)}</p>
                                            <span className="float-right ml-3 mt-1 text-[11px] text-gray-500">{message.time}</span>
                                        </motion.div>
                                        {message.isSender && (
                                            <motion.div
                                                className={`w-8 h-8 rounded-full ${showIcon && "bg-gray-300"} flex justify-center items-center self-baseline`}
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                {showIcon && <Person htmlColor="white" />}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </React.Fragment>
                            );
                        })}
                    </motion.div>
                    <motion.div
                        className="flex items-center px-4 py-2 bg-[#f0f2f5] border-t border-gray-100 max-sm:px-2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <EmojiEmotionsOutlined className="text-gray-600 cursor-pointer" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <AttachFile className="text-gray-600 cursor-pointer mx-3 max-sm:mx-2" />
                        </motion.div>
                        <input
                            type="text"
                            placeholder="Type a message"
                            className="min-w-0 flex-1 px-4 py-2.5 rounded-lg bg-white border border-gray-100 outline-none max-sm:px-3"
                            onChange={(e) => e.target.value.trim().length > 0 ? setisTyping(true) : setisTyping(false)}
                        />
                        {!isTyping ? <motion.div whileHover={{ scale: 1.1 }}>
                            <Mic className="text-gray-600 cursor-pointer ml-3" />
                        </motion.div>
                            : <motion.div whileHover={{ scale: 1.1 }}>
                                <Send className="text-gray-600 cursor-pointer ml-3" />
                            </motion.div>}
                    </motion.div>
            </>
        </motion.div>
    );
};

export default ChatView;
