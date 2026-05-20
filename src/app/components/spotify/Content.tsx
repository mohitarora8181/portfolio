import React from 'react'
import { Add, PlayArrow } from '@mui/icons-material'
import { motion } from 'framer-motion'

const Content = () => {
    return (
        <div className='flex h-full pt-16'>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className='w-[420px] min-w-[420px] max-sm:w-full max-sm:min-w-0 bg-black p-2 pt-0 flex flex-col gap-2 group/playlist'
            >
                <div className='bg-[#121212] rounded-lg p-4'>
                    <div className='flex items-center justify-between text-gray-400'>
                        <div className='flex items-center gap-2'>
                            <motion.span
                                whileHover={{ scale: 1.1 }}
                                className='hover:text-white opacity-0 -ml-5 group-hover/playlist:ml-0 group-hover/playlist:opacity-100 cursor-pointer hover:bg-[#1f1f1f] p-2 pr-0 rounded-full transition-all'
                            >
                                <svg width={16} height={16} fill='currentcolor' viewBox="0 0 16 16"><path d="M10.97 5.47a.75.75 0 1 1 1.06 1.06L10.56 8l1.47 1.47a.75.75 0 1 1-1.06 1.06l-2-2a.75.75 0 0 1 0-1.06l2-2Z"></path><path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1Zm.5 1.5H5v13H1.5v-13Zm13 13h-8v-13h8v13Z"></path></svg>
                            </motion.span>
                            <span className='font-bold text-white'>Your Library</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <Add className='hover:text-white cursor-pointer' />
                            </motion.div>
                            <motion.span
                                whileHover={{ scale: 1.1 }}
                                className='hover:text-white cursor-pointer hover:bg-[#1f1f1f] p-2 rounded-full transition-all'
                            >
                                <svg width={16} height={16} fill='currentcolor' aria-hidden="true" viewBox="0 0 16 16" ><path d="M6.53 9.47a.75.75 0 0 1 0 1.06l-2.72 2.72h1.018a.75.75 0 0 1 0 1.5H1.25v-3.579a.75.75 0 0 1 1.5 0v1.018l2.72-2.72a.75.75 0 0 1 1.06 0zm2.94-2.94a.75.75 0 0 1 0-1.06l2.72-2.72h-1.018a.75.75 0 1 1 0-1.5h3.578v3.579a.75.75 0 0 1-1.5 0V3.81l-2.72 2.72a.75.75 0 0 1-1.06 0z"></path></svg>
                            </motion.span>
                        </div>
                    </div>

                    <div className='mt-4 space-y-2'>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className='bg-[#242424] p-4 rounded-lg max-sm:hidden'
                        >
                            <h3 className='text-white font-bold'>Create your first playlist</h3>
                            <p className='text-sm text-white mt-1'>It&apos;s easy, we&apos;ll help you</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='mt-4 bg-white text-black px-4 py-1 rounded-full text-sm font-bold hover:scale-105 transition-transform'
                            >
                                Create playlist
                            </motion.button>
                        </motion.div>

                        <div className='flex gap-2 py-2 overflow-x-auto scrollbar-hide'>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='bg-[#242424] cursor-pointer text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-[#2a2a2a]'
                            >
                                Playlists
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='bg-[#242424] cursor-pointer text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-[#2a2a2a]'
                            >
                                Artists
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='bg-[#242424] cursor-pointer text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-[#2a2a2a]'
                            >
                                Albums
                            </motion.button>
                        </div>

                        <div className='space-y-2 max-h-[300px] max-sm:max-h-[400px] scrollbar-none overflow-y-auto'>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,23,25,24,26].map((item) => (
                                <motion.div
                                    key={item}
                                    whileHover={{ backgroundColor: '#1a1a1a' }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2}}
                                    className='flex items-center gap-3 p-2 rounded-lg cursor-pointer group/lst'
                                >
                                    <span className='relative w-12 h-12 rounded-full overflow-hidden'>
                                        <img
                                            src={`https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228`}
                                            alt="Playlist"
                                            className='w-full h-full object-cover'
                                        />
                                        <span
                                            className='absolute bg-[rgb(0,0,0,0.5)] opacity-0 group-hover/lst:opacity-100 w-full h-full left-0 top-0 p-2.5 flex justify-between items-center'
                                        >
                                            <PlayArrow
                                                className='text-white w-12 h-12 transition-full'
                                                sx={{ fontSize: 30 }}
                                            />
                                        </span>
                                    </span>
                                    <div className='flex-1 min-w-0'>
                                        <h4 className='text-white text-sm font-medium truncate'>
                                            My Playlist #{item}
                                        </h4>
                                        <p className='text-gray-400 text-xs truncate'>
                                            Playlist • Your Name
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='flex-1 bg-[#121212] overflow-y-auto scrollbar-none max-sm:hidden'
            >
                <div className='p-4'>
                    <h2 className='text-2xl font-bold text-white mb-4'>Made For You</h2>
                    <div className='grid grid-cols-4 gap-3 pb-24'>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: item * 0.05 }}
                                whileHover={{ backgroundColor: '#282828', y: -5 }}
                                className='bg-[#181818] group/item p-4 rounded-lg transition-colors cursor-pointer'
                            >
                                <div className='relative'>
                                    <img
                                        src="https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
                                        alt="Playlist"
                                        className='w-full aspect-square object-cover rounded-md shadow-lg'
                                    />
                                    <button
                                        className='absolute group-hover/item:opacity-100 group-hover/item:translate-y-0 opacity-0 translate-y-2 bottom-2 right-2 w-12 h-12 bg-[#1ed760] rounded-full items-center justify-center shadow-xl transition-transform'
                                    >
                                        <PlayArrow className='text-black' sx={{ fontSize: 30 }} />
                                    </button>
                                </div>
                                <h3 className='text-white font-bold mt-4 text-sm'>Daily Mix 1</h3>
                                <p className='text-gray-400 mt-1 text-sm'>Pritam, B Praak, Arijit Singh and more</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className='w-[420px] min-w-[420px] bg-black p-2 max-sm:hidden'
            >
                <div className='bg-[#121212] rounded-lg p-4 h-full'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-white font-bold'>Friend Activity</h3>
                        <motion.div whileHover={{ scale: 1.1, rotate: 90 }}>
                            <Add className='text-gray-400 hover:text-white cursor-pointer' />
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className='text-center text-gray-400 mt-8'
                    >
                        <p className='text-sm'>Let friends and followers on Spotify see what you&apos;re listening to.</p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default Content
