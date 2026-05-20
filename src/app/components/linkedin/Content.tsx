import React from 'react';
import data from "@/myData.json";
import { ArrowDropDown, Bookmark, Event, ExpandMore, Groups, MoreHoriz, Newspaper, Person } from '@mui/icons-material';
import { motion } from 'framer-motion'; // Import framer-motion

const Content = () => {
    const posts = [
        {
            id: 1,
            name: "Milan Naropanth",
            time: "11h",
            content: "I'm hiring Founding Engineers and Founding Growth for Summer '25. We're a venture-backed startup out of Harvard that raised $1.1m in offers.",
            image: "https://media.licdn.com/dms/image/v2/D5622AQHIFvs9kiPtlw/feedshare-shrink_2048_1536/B56ZZwx.IDHUAs-/0/1745648871297?e=1748476800&v=beta&t=wetGZRoiz7hvl2e3OVuuKQcTcmuskN6vmAO44RYngrc",
            likes: 1000,
            comments: 3,
            reposts: 3,
        },
        {
            id: 2,
            name: "John Doe",
            time: "1d",
            content: "Excited to announce our new product launch! Stay tuned for more updates.",
            image: "https://media.licdn.com/dms/image/v2/D4D22AQFs1dAr24xNtg/feedshare-shrink_800/B4DZZ2HPj8GcAg-/0/1745738332862?e=1748476800&v=beta&t=LEX_jeHz8foMRLvxYeHpPDG_1gJ_n3o0AouRN6zmFIQ",
            likes: 500,
            comments: 10,
            reposts: 2,
        },
        {
            id: 3,
            name: "Jane Smith",
            time: "2d",
            content: "Had an amazing time at the tech conference this week. Learned so much!",
            image: "https://media.licdn.com/dms/image/v2/D4D22AQGjuskP0LtL6Q/feedshare-shrink_800/B4DZZrCPZEGwAg-/0/1745552472703?e=1748476800&v=beta&t=41B61zC-6lT05PW80i731UlINnj4QON3FW0VO0_97YY",
            likes: 300,
            comments: 5,
            reposts: 1,
        },
        {
            id: 4,
            name: "Emily Johnson",
            time: "3d",
            content: "Looking for talented developers to join our team. DM me if interested!",
            image: "https://media.licdn.com/dms/image/sync/v2/D5610AQGV0y5CGUHneA/image-shrink_800/B56ZZe0yG8GUAc-/0/1745347617666?e=1746352800&v=beta&t=3qNRiG-GtFIPkZjRcqUVLphh8qHJm2TvIsvcLmczkPM",
            likes: 800,
            comments: 20,
            reposts: 5,
        },
        {
            id: 5,
            name: "Michael Brown",
            time: "4d",
            content: "Sharing some insights from my latest blog post. Check it out!",
            image: "https://media.licdn.com/dms/image/v2/D5622AQGmK746ygXXxA/feedshare-shrink_800/B56ZYjMPKYGcAo-/0/1744347133683?e=1748476800&v=beta&t=prl5-So7-xC7TqpjSIYJsfNPTMAK1RFn-zrgIs1Pa64",
            likes: 600,
            comments: 15,
            reposts: 4,
        },
    ];

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    const staggerChildren = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const hoverScale = {
        scale: 1.02,
        transition: { duration: 0.2 }
    };

    return (
        <div className="flex w-full h-full pt-5 max-sm:pt-2">
            {/* Left Sidebar */}
            <div className="w-1/4 max-sm:hidden flex flex-col ml-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="flex flex-col bg-white rounded-md items-start w-[230px] self-end border border-gray-300"
                >
                    <img
                        src="https://media.licdn.com/dms/image/v2/D4D16AQH3otE6xyUEag/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1700980257389?e=1751500800&v=beta&t=MjFRLzyGA6SAyKv6OEK5nwzSFrXPBdoVUmXclrKtUEQ"
                        alt="Background"
                        className="w-full h-20 object-cover rounded-t-md"
                    />
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        src={data.profileImage}
                        alt="Profile"
                        className="w-18 h-18 rounded-full border-2 border-white ml-3 -mt-10"
                    />
                    <div className='w-full pb-2 px-5 text-xs'>
                        <h2 className="text-lg font-semibold mt-2">{data.name}</h2>
                        <p className="text-gray-500 font-medium">Learner ++</p>
                        <p className="text-gray-500">Delhi</p>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col p-4 text-xs bg-white rounded-md items-start w-[230px] self-end border border-gray-300 mt-2"
                >
                    <div className="flex w-full justify-between text-gray-600">
                        <span className='font-semibold'>Profile viewers</span>
                        <span className="font-semibold text-[#0a66c2]">797</span>
                    </div>
                    <div className="flex w-full justify-between text-gray-600 mt-2">
                        <span className='font-semibold'>Post impressions</span>
                        <span className="font-semibold text-[#0a66c2]">102</span>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={hoverScale}
                    className="flex flex-col gap-1 p-4 bg-white rounded-md items-start w-[230px] self-end border border-gray-300 mt-2 text-center text-sm cursor-pointer"
                >
                    <p className='text-xs text-gray-500 font-medium'>Unlock 4x more profile visits</p>
                    <span className='flex gap-1 justify-start items-center text-xs'>
                        <motion.svg
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.5 }}
                            viewBox="0 0 24 24" width="24" height="24" id="premium-chip-medium" aria-hidden="true" role="none" data-supported-dps="24x24"
                        >
                            <path d="M20 20a3.36 3.36 0 001-2.39V6.38A3.38 3.38 0 0017.62 3H6.38A3.36 3.36 0 004 4z" fill="#f8c77e"></path>
                            <path d="M4 4a3.36 3.36 0 00-1 2.38v11.24A3.38 3.38 0 006.38 21h11.24A3.36 3.36 0 0020 20z" fill="#e7a33e"></path>
                        </motion.svg>
                        Try Premium for ₹0
                    </span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col p-4 bg-white rounded-md items-start w-[230px] self-end border border-gray-300 mt-2"
                >
                    <motion.ul
                        variants={staggerChildren}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2 text-xs font-medium text-[rgb(0,0,0,0.9)]"
                    >
                        <motion.li
                            variants={fadeIn}
                            whileHover={{ x: 5 }}
                            className="flex items-center"
                        >
                            <span className="mr-2"><Bookmark sx={{ fontSize: "18px" }} /></span> Saved items
                        </motion.li>
                        <motion.li
                            variants={fadeIn}
                            whileHover={{ x: 5 }}
                            className="flex items-center"
                        >
                            <span className="mr-2"><Groups sx={{ fontSize: "18px" }} /></span> Groups
                        </motion.li>
                        <motion.li
                            variants={fadeIn}
                            whileHover={{ x: 5 }}
                            className="flex items-center"
                        >
                            <span className="mr-2"><Newspaper sx={{ fontSize: "18px" }} /></span> Newsletters
                        </motion.li>
                        <motion.li
                            variants={fadeIn}
                            whileHover={{ x: 5 }}
                            className="flex items-center"
                        >
                            <span className="mr-2"><Event sx={{ fontSize: "18px" }} /></span> Events
                        </motion.li>
                    </motion.ul>
                </motion.div>
            </div>

            {/* Main Feed */}
            <div className="flex-1 max-sm:w-full px-6 max-sm:px-1">
                {/* Create Post Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-2 border border-gray-300 rounded-md"
                >
                    <span className='w-full px-2 flex gap-1'>
                        <img
                            src={data.profileImage}
                            alt="Profile"
                            className="w-14 h-14 rounded-full border-2 border-white"
                        />
                        <motion.input
                            whileFocus={{ boxShadow: "0 0 0 2px rgba(10, 102, 194, 0.3)" }}
                            type="text"
                            placeholder="Start a post"
                            className="w-full text-sm rounded-full h-fit p-3 self-center placeholder:font-medium placeholder:text-gray-800 px-5 border border-gray-400 outline-none"
                        />
                    </span>
                    <div className="flex justify-around text-sm text-gray-600">
                        <motion.button

                            whileTap={{ scale: 0.95 }}
                            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                        >
                            <span className="material-icons text-[#378fe9] mr-1">
                                <svg width={24} height={24} viewBox="0 0 24 24" id="image-medium" aria-hidden="true" role="none" data-supported-dps="24x24" fill="currentColor">
                                    <path d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm1 13a1 1 0 01-.29.71L16 14l-2 2-6-6-4 4V7a1 1 0 011-1h14a1 1 0 011 1zm-2-7a2 2 0 11-2-2 2 2 0 012 2z"></path>
                                </svg>
                            </span>
                            Media
                        </motion.button>
                        <motion.button

                            whileTap={{ scale: 0.95 }}
                            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                        >
                            <span className="material-icons text-[#a871ea] mr-1">
                                <svg width={24} height={24} viewBox="0 0 24 24" id="job-medium" aria-hidden="true" role="none" data-supported-dps="24x24" fill="currentColor">
                                    <path d="M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm10 9a4 4 0 003-1.38V17a3 3 0 01-3 3H5a3 3 0 01-3-3v-4.38A4 4 0 005 14z"></path>
                                </svg>
                            </span>
                            Job
                        </motion.button>
                        <motion.button

                            whileTap={{ scale: 0.95 }}
                            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                        >
                            <span className="material-icons text-[#e06847] mr-1">
                                <svg width={24} height={24} viewBox="0 0 24 24" id="content-align-left-medium" aria-hidden="true" role="none" data-supported-dps="24x24" fill="currentColor">
                                    <path d="M21 3v2H3V3zm-6 6h6V7h-6zm0 4h6v-2h-6zm0 4h6v-2h-6zM3 21h18v-2H3zM13 7H3v10h10z"></path>
                                </svg>
                            </span>
                            Write article
                        </motion.button>
                    </div>
                </motion.div>

                <span className='w-full flex gap-2 items-center text-[12px] text-nowrap my-2 text-gray-600'>
                    <p className='w-full border-t border-gray-400' />
                    Sort by:
                    <motion.p
                        whileHover={{ color: "#0a66c2" }}
                        className='font-semibold'
                    >
                        Top <ArrowDropDown sx={{ fontSize: "2em" }} />
                    </motion.p>
                </span>

                {/* Post Section */}
                <motion.div
                    variants={staggerChildren}
                    initial="hidden"
                    animate="visible"
                >
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            variants={fadeIn}
                            whileHover={{ y: -2 }}
                            className="bg-white border border-gray-300 rounded-md mb-4 max-sm:mb-2"
                        >
                            <div className="flex items-center px-5 pt-5 max-sm:px-2 max-sm:w-full">
                                <div
                                    className={`w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center self-baseline`}
                                >
                                    <Person sx={{ fontSize: "32px" }} htmlColor="white" />
                                </div>
                                <div className="ml-2 max-sm:ml-3 max-sm:w-2/3">
                                    <h3 className="text-sm font-semibold">{post.name}</h3>
                                    <p className="text-xs text-gray-500 max-w-1/2 truncate">Building Unemployed | I Post Daily Opportunities | Influencer Marketing | LinkedIn Branding</p>
                                    <p className="text-xs text-gray-500">{post.time} • Follow</p>
                                </div>
                                <motion.span
                                    whileHover={{ scale: 1.2, backgroundColor: "rgba(0,0,0,0.05)" }}
                                    className='ml-auto transition-all cursor-pointer hover:bg-gray-100 rounded-full p-1 self-start'
                                >
                                    <MoreHoriz className='text-[rgb(0,0,0,0.6)]' />
                                </motion.span>
                            </div>
                            <p className="mt-2 max-sm:px-2 px-5 p-1 text-sm">
                                {post.content}
                            </p>
                            {post.image && (
                                <motion.img
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                    src={post.image}
                                    alt="Post"
                                    className="w-full mt-2"
                                />
                            )}
                            <div className='w-full flex justify-between px-3 pt-2 text-xs text-gray-800'>
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className='w-fit flex'
                                >
                                    <img src="https://static.licdn.com/aero-v1/sc/h/8ekq8gho1ruaf8i7f86vd1ftt" alt="like" />
                                    <img className='-ml-1' src="https://static.licdn.com/aero-v1/sc/h/cpho5fghnpme8epox8rdcds22" alt="heart" />
                                    <img className='-ml-1' src="https://static.licdn.com/aero-v1/sc/h/lhxmwiwoag9qepsh4nc28zus" alt="idea" />
                                    <p>{post.likes}</p>
                                </motion.span>
                                <p className='w-full flex justify-end'>
                                    {`${post.comments} comments • ${post.reposts} reposts`}
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-3 p-2 px-10 max-sm:px-0 border-t border-gray-200 text-[rgb(0,0,0,0.9)] text-sm">
                                <motion.div

                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center cursor-pointer hover:bg-gray-100 p-2 px-4 rounded-sm tranisition-all"
                                >
                                    <span className="material-icons text-gray-500 mr-1">
                                        <svg width={16} height={16} viewBox="0 0 16 16" id="thumbs-up-outline-small" aria-hidden="true" role="none" data-supported-dps="16x16" fill="currentColor">
                                            <path d="M12.91 7l-2.25-2.57a8.21 8.21 0 01-1.5-2.55L9 1.37A2.08 2.08 0 007 0a2.08 2.08 0 00-2.06 2.08v1.17a5.81 5.81 0 00.31 1.89l.28.86H2.38A1.47 1.47 0 001 7.47a1.45 1.45 0 00.64 1.21 1.48 1.48 0 00-.37 2.06 1.54 1.54 0 00.62.51h.05a1.6 1.6 0 00-.19.71A1.47 1.47 0 003 13.42v.1A1.46 1.46 0 004.4 15h4.83a5.61 5.61 0 002.48-.58l1-.42H14V7zM12 12.11l-1.19.52a3.59 3.59 0 01-1.58.37H5.1a.55.55 0 01-.53-.4l-.14-.48-.49-.21a.56.56 0 01-.34-.6l.09-.56-.42-.42a.56.56 0 01-.09-.68L3.55 9l-.4-.61A.28.28 0 013.3 8h5L7.14 4.51a4.15 4.15 0 01-.2-1.26V2.08A.09.09 0 017 2a.11.11 0 01.08 0l.18.51a10 10 0 001.9 3.24l2.84 3z"></path>
                                        </svg>
                                    </span> Like
                                </motion.div>
                                <motion.div

                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center cursor-pointer hover:bg-gray-100 p-2 px-4 rounded-sm tranisition-all"
                                >
                                    <span className="material-icons text-gray-500 mr-1">
                                        <svg width={16} height={16} viewBox="0 0 16 16" id="comment-small" aria-hidden="true" role="none" data-supported-dps="16x16" fill="currentColor">
                                            <path d="M5 8h5v1H5zm11-.5v.08a6 6 0 01-2.75 5L8 16v-3H5.5A5.51 5.51 0 010 7.5 5.62 5.62 0 015.74 2h4.76A5.5 5.5 0 0116 7.5zm-2 0A3.5 3.5 0 0010.5 4H5.74A3.62 3.62 0 002 7.5 3.53 3.53 0 005.5 11H10v1.33l2.17-1.39A4 4 0 0014 7.58zM5 7h6V6H5z"></path>
                                        </svg>
                                    </span> Comment
                                </motion.div>
                                <motion.div

                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center cursor-pointer hover:bg-gray-100 p-2 px-4 rounded-sm tranisition-all"
                                >
                                    <span className="material-icons text-gray-500 mr-1">
                                        <svg width={16} height={16} viewBox="0 0 16 16" id="repost-small" aria-hidden="true" role="none" data-supported-dps="16x16" fill="currentColor">
                                            <path d="M4 10H2V5c0-1.66 1.34-3 3-3h3.85L7.42 0h2.44L12 3 9.86 6H7.42l1.43-2H5c-.55 0-1 .45-1 1v5zm8-4v5c0 .55-.45 1-1 1H7.15l1.43-2H6.14L4 13l2.14 3h2.44l-1.43-2H11c1.66 0 3-1.34 3-3V6h-2z"></path>
                                        </svg>
                                    </span> Repost
                                </motion.div>
                                <motion.div

                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center cursor-pointer hover:bg-gray-100 p-2 px-4 rounded-sm tranisition-all"
                                >
                                    <span className="material-icons text-gray-500 mr-1">
                                        <svg width={16} height={16} viewBox="0 0 16 16" id="send-privately-small" aria-hidden="true" role="none" data-supported-dps="16x16" fill="currentColor">
                                            <path d="M14 2L0 6.67l5 2.64 5.67-3.98L6.7 11l2.63 5L14 2z"></path>
                                        </svg>
                                    </span> Send
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="w-1/3 max-sm:hidden pr-3 flex flex-col">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-[300px] pb-5 bg-white rounded-md border border-gray-300"
                >
                    <div className='w-full px-4 pt-3 pb-1 flex justify-between'>
                        <span className='flex flex-col gap-1 w-full'>
                            <h3 className="text-lg font-semibold">Trending Now</h3>
                            <p className="text-sm text-gray-500 mt-1 font-semibold">curated by LinkedIn News</p>
                        </span>
                        <svg width={16} height={16} viewBox="0 0 16 16" id="signal-notice-small" aria-hidden="true" role="none" data-supported-dps="16x16" fill="currentColor">
                            <path d="M12 2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zm-3 8v2H7.5A1.5 1.5 0 016 10.5a1.56 1.56 0 01.1-.5l1.08-3h2.13l-1.09 3zm0-3.75A1.25 1.25 0 1110.25 5 1.25 1.25 0 019 6.25z"></path>
                        </svg>
                    </div>
                    <motion.ul
                        variants={staggerChildren}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-2 text-sm text-gray-800"
                    >
                        <motion.li
                            variants={fadeIn}
                            className="flex flex-col cursor-pointer p-4 py-1 hover:bg-[rgba(0,0,0,0.08)]"
                        >
                            <span className="font-semibold">International tourists shun the US</span>
                            <span className="text-gray-500 text-xs">1d ago • 12,330 readers</span>
                        </motion.li>
                        <motion.li
                            variants={fadeIn}
                            className="flex flex-col cursor-pointer p-4 py-1 hover:bg-[rgba(0,0,0,0.08)]"
                        >
                            <span className="font-semibold">GCC hiring zooms ahead of IT</span>
                            <span className="text-gray-500 text-xs">2d ago • 5,108 readers</span>
                        </motion.li>
                        <motion.li
                            variants={fadeIn}
                            className="flex flex-col cursor-pointer p-4 py-1 hover:bg-[rgba(0,0,0,0.08)]"
                        >
                            <span className="font-semibold">CEO exits on the rise</span>
                            <span className="text-gray-500 text-xs">2d ago • 3,708 readers</span>
                        </motion.li>
                        <motion.li
                            variants={fadeIn}
                            className="flex flex-col cursor-pointer p-4 py-1 hover:bg-[rgba(0,0,0,0.08)]"
                        >
                            <span className="font-semibold">Motorola debuts AI-infused phones</span>
                            <span className="text-gray-500 text-xs">11d ago • 1,760 readers</span>
                        </motion.li>
                        <motion.li
                            variants={fadeIn}
                            className="flex flex-col cursor-pointer p-4 py-1 hover:bg-[rgba(0,0,0,0.08)]">
                            <span className="font-semibold">India tops digital banking charts</span>
                            <span className="text-gray-500 text-xs">2d ago • 1,382 readers</span>
                        </motion.li>
                    </motion.ul>
                    <motion.button
                        variants={fadeIn}
                        className="mt-4 ml-2 px-2 transition-all rounded-sm cursor-pointer hover:bg-[rgba(0,0,0,0.08)] text-gray-800 text-sm flex items-center">
                        Show more <span className="material-icons ml-1"><ExpandMore /></span>
                    </motion.button>
                </motion.div>
                <motion.div
                    initial={{opacity: 0 }}
                    animate={{opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }}
                    whileHover={{ y: -2 }}
                    className='w-[300px] flex h-fit px-2 p-1 border border-gray-300 items-center absolute bottom-0 right-6 bg-white rounded-t-xl shadow-xl'
                >
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        src={data.profileImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <motion.span
                        animate={{
                            scale: [1, 1.2, 1],
                            backgroundColor: ["#01754f", "#02A66E", "#01754f"]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                        className='bg-[#01754f] w-[18px] h-[10px] rounded-full self-end -ml-3 mb-0.5 border-2 border-white'
                    />
                    <p className='px-3 font-semibold text-gray-700 text-sm'>Messaging</p>
                    <span className='w-full flex gap-3 justify-end px-3'>
                        <motion.svg
                            whileHover={{ scale: 1.2, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            id="overflow-web-ios-small"
                            aria-hidden="true"
                            role="none"
                            data-supported-dps="16x16"
                            fill="currentColor"
                        >
                            <path d="M3 9.5A1.5 1.5 0 114.5 8 1.5 1.5 0 013 9.5zM11.5 8A1.5 1.5 0 1013 6.5 1.5 1.5 0 0011.5 8zm-5 0A1.5 1.5 0 108 6.5 1.5 1.5 0 006.5 8z"></path>
                        </motion.svg>
                        <motion.svg
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            transition={{ duration: 0.3 }}
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            id="compose-small"
                            aria-hidden="true"
                            role="none"
                            data-supported-dps="16x16"
                            fill="currentColor"
                        >
                            <path d="M15 2.53a1.51 1.51 0 01-.44 1L9.15 9 6 10l1-3.12 5.44-5.44A1.5 1.5 0 0115 2.53zM12 11a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h3V2H5a3 3 0 00-3 3v6a3 3 0 003 3h6a3 3 0 003-3V8h-2z"></path>
                        </motion.svg>
                        <motion.svg
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 2 }}
                            transition={{ duration: 0.2 }}
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            id="chevron-up-small"
                            aria-hidden="true"
                            role="none"
                            data-supported-dps="16x16"
                            fill="currentColor"
                        >
                            <path d="M15 11L8 6.39 1 11V8.61L8 4l7 4.61z"></path>
                        </motion.svg>
                    </span>
                </motion.div>
            </div>
        </div>
    );
};

export default Content;