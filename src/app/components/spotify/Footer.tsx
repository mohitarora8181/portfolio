import React, { useState } from 'react'
import {
    PlayArrow,
    Pause,
    VolumeUp,
} from '@mui/icons-material'
import { Slider } from '@mui/material'
import { motion } from 'framer-motion'
import { getFeaturedProjects, getPortfolioData } from '@/src/services/portfolioData'

const data = getPortfolioData()
const nowPlaying = getFeaturedProjects()[0] ?? data.projects[0]

const Footer = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(70)

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    return (
        <motion.div 
            className='fixed bottom-0 w-full bg-black h-[90px] border-t border-[#282828] px-4 flex items-center justify-between'
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className='flex items-center gap-4 w-[30%] min-w-[180px] max-sm:hidden'>
                <motion.img
                    src={`https://picsum.photos/seed/${nowPlaying.id}/160/160`}
                    alt={nowPlaying.name}
                    className='h-14 w-14 rounded object-cover'
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                />
                <div className='flex flex-col'>
                    <motion.span 
                        className='text-sm text-white hover:underline cursor-pointer'
                        whileHover={{ color: '#1db954' }}
                    >
                        {nowPlaying.name}
                    </motion.span>
                    <motion.span 
                        className='text-xs text-gray-400 hover:underline cursor-pointer'
                        whileHover={{ color: '#ffffff' }}
                    >
                        {nowPlaying.tagline}
                    </motion.span>
                </div>
            </div>

            <div className='flex flex-col items-center max-w-[722px] max-sm:w-full w-[40%]'>
                <div className='flex items-center gap-6 mb-1'>
                    <motion.span 
                        className="text-gray-400 hover:text-white cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg width={16} height={16} fill='currentcolor' aria-hidden="true" viewBox="0 0 16 16"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path><path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path></svg>
                    </motion.span>
                    <motion.span 
                        className="text-gray-400 hover:text-white cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg width={16} height={16} fill='currentcolor' aria-hidden="true" viewBox="0 0 16 16"><path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path></svg>
                    </motion.span>
                    <motion.div
                        className='w-8 h-8 flex items-center justify-center bg-white rounded-full cursor-pointer hover:scale-105'
                        onClick={handlePlayPause}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isPlaying ? (
                            <Pause className='text-black' />
                        ) : (
                            <PlayArrow className='text-black' />
                        )}
                    </motion.div>
                    <motion.span 
                        className="text-gray-400 hover:text-white cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg width={16} height={16} fill='currentcolor' aria-hidden="true" viewBox="0 0 16 16"><path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path></svg>
                    </motion.span>
                    <motion.span 
                        className="text-gray-400 hover:text-white cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg width={16} height={16} fill='currentcolor' aria-hidden="true" viewBox="0 0 16 16"><path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z"></path></svg>
                    </motion.span>
                </div>
                <div className='flex items-center gap-2 w-full'>
                    <span className='text-xs text-gray-400'>0:07</span>
                    <Slider
                        size="small"
                        value={progress}
                        onChange={(_, value) => setProgress(value as number)}
                        sx={{
                            color: '#fff',
                            height: 4,
                            '& .MuiSlider-thumb': {
                                width: 8,
                                height: 8,
                                display: 'none',
                                '&:hover, &.Mui-focusVisible': {
                                    boxShadow: 'none',
                                },
                            },
                            '&:hover .MuiSlider-thumb': {
                                display: 'block',
                            },
                            '&:hover .MuiSlider-track': {
                                backgroundColor: '#1db954',
                            }
                        }}
                    />
                    <span className='text-xs text-gray-400'>3:52</span>
                </div>
            </div>

            <div className='flex items-center gap-3 w-[30%] min-w-[180px] justify-end max-sm:hidden'>
                <motion.span 
                    className="text-[#1db954] hover:text-white cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width={16} height={16} fill='currentcolor' aria-hidden="true" viewBox="0 0 16 16"><path d="M11.196 8 6 5v6l5.196-3z"></path><path d="M15.002 1.75A1.75 1.75 0 0 0 13.252 0h-10.5a1.75 1.75 0 0 0-1.75 1.75v12.5c0 .966.783 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75V1.75zm-1.75-.25a.25.25 0 0 1 .25.25v12.5a.25.25 0 0 1-.25.25h-10.5a.25.25 0 0 1-.25-.25V1.75a.25.25 0 0 1 .25-.25h10.5z"></path></svg>
                </motion.span>
                <motion.span 
                    className="text-gray-400 hover:text-white cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width={16} height={16} aria-hidden="true" fill="currentcolor" viewBox="0 0 16 16">
                        <path d="M13.426 2.574a2.831 2.831 0 0 0-4.797 1.55l3.247 3.247a2.831 2.831 0 0 0 1.55-4.797zM10.5 8.118l-2.619-2.62A63303.13 63303.13 0 0 0 4.74 9.075L2.065 12.12a1.287 1.287 0 0 0 1.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 1 1 4.786 4.786l-3.974 3.493-3.06 2.689a2.787 2.787 0 0 1-3.933-3.933l2.676-3.045 3.505-3.99z"></path>
                    </svg>
                </motion.span>
                <motion.span 
                    className="text-gray-400 hover:text-white cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width={16} height={16} aria-hidden="true" fill="currentcolor" viewBox="0 0 16 16">
                        <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z"></path>
                    </svg>
                </motion.span>

                <motion.span 
                    className="text-gray-400 hover:text-white cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width={16} height={16} aria-hidden="true" fill="currentcolor" viewBox="0 0 16 16">
                        <path d="M2 3.75C2 2.784 2.784 2 3.75 2h8.5c.966 0 1.75.784 1.75 1.75v6.5A1.75 1.75 0 0 1 12.25 12h-8.5A1.75 1.75 0 0 1 2 10.25v-6.5zm1.75-.25a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25h-8.5zM.25 15.25A.75.75 0 0 1 1 14.5h14a.75.75 0 0 1 0 1.5H1a.75.75 0 0 1-.75-.75z"></path>
                    </svg>
                </motion.span>
                <div className='flex items-center gap-2'>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <VolumeUp className='text-gray-400 hover:text-white cursor-pointer' sx={{ fontSize: 20 }} />
                    </motion.div>
                    <Slider
                        size="small"
                        value={volume}
                        onChange={(_, value) => setVolume(value as number)}
                        sx={{
                            color: '#fff',
                            width: 96,
                            height: 4,
                            '& .MuiSlider-thumb': {
                                width: 8,
                                height: 8,
                                display: 'none',
                                '&:hover, &.Mui-focusVisible': {
                                    boxShadow: 'none',
                                },
                            },
                            '&:hover .MuiSlider-thumb': {
                                display: 'block',
                            },
                            '&:hover .MuiSlider-track': {
                                backgroundColor: '#1db954',
                            }
                        }}
                    />
                </div>


                <motion.span 
                    className="text-gray-400 hover:text-white cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg data-encore-id="icon" role="presentation" aria-label="Volume medium" aria-hidden="false" className="e-9812-icon e-9812-baseline" id="volume-icon" viewBox="0 0 16 16">
                        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"></path>
                    </svg>
                </motion.span>

                <motion.span 
                    className="text-gray-400 hover:text-white cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width={16} height={16} aria-hidden="true" fill="currentcolor" viewBox="0 0 16 16">
                        <path d="M16 2.45c0-.8-.65-1.45-1.45-1.45H1.45C.65 1 0 1.65 0 2.45v11.1C0 14.35.65 15 1.45 15h5.557v-1.5H1.5v-11h13V7H16V2.45z"></path>
                        <path d="M15.25 9.007a.75.75 0 0 1 .75.75v4.493a.75.75 0 0 1-.75.75H9.325a.75.75 0 0 1-.75-.75V9.757a.75.75 0 0 1 .75-.75h5.925z"></path>
                    </svg>
                </motion.span>

                <motion.span 
                    className="text-gray-400 hover:text-white cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width={16} height={16} aria-hidden="true" fill="currentcolor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.25 3C0.25 2.0335 1.0335 1.25 2 1.25H5.375V2.75H2C1.86193 2.75 1.75 2.86193 1.75 3V5.42857H0.25V3ZM14 2.75H10.625V1.25H14C14.9665 1.25 15.75 2.0335 15.75 3V5.42857H14.25V3C14.25 2.86193 14.1381 2.75 14 2.75ZM1.75 10.5714V13C1.75 13.1381 1.86193 13.25 2 13.25H5.375V14.75H2C1.0335 14.75 0.25 13.9665 0.25 13V10.5714H1.75ZM14.25 13V10.5714H15.75V13C15.75 13.9665 14.9665 14.75 14 14.75H10.625V13.25H14C14.1381 13.25 14.25 13.1381 14.25 13Z" fill="currentColor"></path>
                    </svg>
                </motion.span>
            </div>
        </motion.div>
    )
}

export default Footer
