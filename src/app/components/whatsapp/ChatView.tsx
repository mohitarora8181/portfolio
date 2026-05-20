import React, { useState } from 'react';
import { AttachFile, MoreVert, Search, Mic, Send, EmojiEmotionsOutlined, Group, Person, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ChatView: React.FC<{ selectedChat: any, setSelectedChat: any }> = ({ selectedChat, setSelectedChat }) => {
    const [isTyping, setisTyping] = useState(false);

    return (
        <motion.div
            className="w-full h-full flex flex-col bg-[#efeae2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={selectedChat?.name}
        >
            {selectedChat && (
                <>
                    <motion.div
                        className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border-b border-gray-300"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center space-x-3 cursor-pointer">
                            <motion.div onClick={() => setSelectedChat(null)} className='text-gray-600 cursor-pointer hidden max-sm:block'>
                                <ArrowBack />
                            </motion.div>
                            <motion.div
                                className="w-10 h-10 flex justify-center items-center rounded-full bg-[#dddddd]"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Group htmlColor="white" />
                            </motion.div>
                            <div>
                                <h1 className="text-sm font-medium">{selectedChat.name}</h1>
                                <p className="text-xs text-gray-500">click here for contact info</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <Search className="text-gray-600 cursor-pointer" />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <MoreVert className="text-gray-600 cursor-pointer" />
                            </motion.div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-repeat bg-[url(https://static.whatsapp.net/rsrc.php/v4/yl/r/gi_DckOUM5a.png)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {selectedChat.messages.map((message: any, index: number) => {
                            const showIcon = index === 0 || selectedChat.messages[index - 1].isSender !== message.isSender;
                            return (
                                <motion.div
                                    key={index}
                                    className={`flex ${message.isSender ? 'items-end justify-end' : 'items-start'} space-x-2`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                >
                                    {!message.isSender && (
                                        <motion.div
                                            className="w-8 h-8 rounded-full bg-transparent flex-shrink-0"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {showIcon && (
                                                <img src={"https://static.whatsapp.net/rsrc.php/v4/ye/r/W2MDyeo0zkf.png"} />
                                            )}
                                        </motion.div>
                                    )}
                                    <motion.div
                                        className={`${message.isSender ? 'bg-[#d9fdd3]' : 'bg-white'
                                            } px-4 py-2 rounded-lg shadow-sm max-w-[70%]`}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <span className="text-xs text-gray-500 float-right">{message.time}</span>
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
                            );
                        })}
                    </motion.div>
                    <motion.div
                        className="flex items-center px-4 py-2 bg-[#f0f2f5] border-t border-gray-100"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <EmojiEmotionsOutlined className="text-gray-600 cursor-pointer" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <AttachFile className="text-gray-600 cursor-pointer mx-3" />
                        </motion.div>
                        <input
                            type="text"
                            placeholder="Type a message"
                            className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-gray-100 outline-none"
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
            )}
        </motion.div>
    );
};

export default ChatView;