import React from "react";
import { motion } from "framer-motion";
import { Search, Group, MoreVert } from "@mui/icons-material";

export const Chats: React.FC<{ setSelectedChat: any, selectedChat: any }> = ({ setSelectedChat, selectedChat }) => {
    const chats = [
        {
            name: "Family Group",
            message: "Mom: Don't forget to bring groceries.",
            time: "10:15 AM",
            archived: false,
            messages: [
                { text: "Hey, are you coming home?", time: "10:00 AM", isSender: false },
                { text: "Yes, I'll be there by 6 PM.", time: "10:05 AM", isSender: true },
                { text: "Don't forget to bring groceries.", time: "10:15 AM", isSender: false },
            ],
        },
        {
            name: "Work Team",
            message: "Boss: Please review the document.",
            time: "9:45 AM",
            archived: false,
            messages: [
                { text: "Can you send me the latest report?", time: "9:30 AM", isSender: false },
                { text: "Sure, give me a moment.", time: "9:35 AM", isSender: true },
                { text: "Please review the document.", time: "9:45 AM", isSender: false },
            ],
        },
        {
            name: "Friends Group",
            message: "John: Let's meet at 7 PM.",
            time: "Yesterday",
            archived: false,
            messages: [
                { text: "Are we meeting tomorrow?", time: "8:00 PM", isSender: false },
                { text: "Yes, let's meet at 7 PM.", time: "8:15 PM", isSender: true },
                { text: "Sounds good!", time: "8:20 PM", isSender: false },
            ],
        },
    ];

    return (
        <motion.div
            className="p-4 bg-white h-full min-w-[450px] max-sm:min-w-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="flex items-center justify-between mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-xl font-semibold">Chats</h1>
                <div className="flex space-x-2 items-center">
                    <motion.span
                        className="w-10 h-10 flex justify-center items-center rounded-full cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                    >
                        <svg
                            color="rgb(84, 101, 111)"
                            viewBox="0 0 24 24"
                            height="24"
                            width="24"
                            preserveAspectRatio="xMidYMid meet"
                            fill="none"
                        >
                            <path d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z" fill="currentColor"></path>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </motion.span>
                    <motion.div whileHover={{ scale: 1.1 }}>
                        <MoreVert className="cursor-pointer" htmlColor="rgb(84, 101, 111)" />
                    </motion.div>
                </div>
            </motion.div>
            <motion.div
                className="relative ps-5 bg-[#f0f2f5] rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full text-sm p-2 pl-10 rounded-lg placeholder:text-gray-500 outline-none"
                />
                <Search sx={{ fontSize: "20px" }} className="absolute left-2 top-2 text-gray-500" />
            </motion.div>
            <motion.div
                className="w-full flex gap-3 py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <motion.p
                    className="p-1 px-3 w-fit bg-[#e7fce3] text-[#008069] rounded-2xl cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                >
                    All
                </motion.p>
                <motion.p
                    className="p-1 px-3 w-fit bg-[#f0f2f5] text-gray-500 rounded-2xl cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                >
                    Unread
                </motion.p>
                <motion.p
                    className="p-1 px-3 w-fit bg-[#f0f2f5] text-gray-500 rounded-2xl cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                >
                    Favorites
                </motion.p>
                <motion.p
                    className="p-1 px-3 w-fit bg-[#f0f2f5] text-gray-500 rounded-2xl cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                >
                    Groups
                </motion.p>
            </motion.div>
            <motion.div
                className="flex flex-col gap-3 w-full h-full pb-40 overflow-y-scroll scrollbar-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                {chats.map((chat, index) => (
                    <motion.div
                        key={index}
                        className={`flex cursor-pointer text-md rounded-sm p-3 pl-1 w-full justify-between border-b border-gray-200 ${selectedChat?.name == chat?.name && "bg-gray-100"} hover:bg-gray-100`}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedChat(chat)}
                    >
                        <div className="w-full flex gap-2 justify-between">
                            <div className="max-w-2/3 flex gap-2">
                                <span className="p-2 w-10 h-10 bg-[#dddddd] flex justify-center rounded-full">
                                    <Group htmlColor="white" />
                                </span>
                                <div className="w-full flex flex-col gap-1">
                                    <h2 className="font-normal truncate">{chat.name}</h2>
                                    <p className="text-sm text-gray-500 text-nowrap truncate">{chat.message}</p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-400 text-nowrap">{chat.time}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default Chats;