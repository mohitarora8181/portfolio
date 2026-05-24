import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { getPortfolioData } from "@/src/services/portfolioData";
import { ArrowDropDown } from '@mui/icons-material';
import { motion } from 'framer-motion';

const data = getPortfolioData();

type NavbarProps = {
    query: string;
    onQueryChange: (query: string) => void;
};

const Navbar = ({ query, onQueryChange }: NavbarProps) => {
    return (
        <motion.div 
            className="w-full z-20 sticky top-0 border-b border-gray-200 bg-white"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mx-auto flex h-[52px] max-w-[1188px] px-10 items-center justify-between max-sm:h-auto max-sm:justify-center max-sm:px-0">
            <div className="flex items-center space-x-2 max-sm:justify-between max-sm:w-full max-sm:px-2 max-sm:py-1.5">
                <motion.svg 
                    className='h-[40px] w-[40px]' 
                    viewBox="0 0 24 24" 
                    data-supported-dps="24x24" 
                    fill="#0a66c2" 
                    focusable="false"
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </motion.svg>
                <motion.div 
                    className="flex h-[34px] items-center rounded-[1.6rem] bg-[#fff] border-1 border-[rgb(0,0,0,0.3)] px-3"
                    initial={{ width: "200px" }}
                    animate={{ width: "280px" }}
                    transition={{ duration: 0.3 }}
                    whileFocus={{ backgroundColor: "#e6e6e6" }}
                >
                    <SearchIcon sx={{ fontSize: "20px" }} className="text-black" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                    className="ml-2 w-[230px] bg-transparent text-sm outline-none"
                    />
                </motion.div>
            </div>
            <div className="flex h-full max-sm:grid max-sm:grid-cols-5 items-end gap-0 max-sm:h-fit bg-white max-sm:fixed max-sm:bottom-0 max-sm:left-0">
                <motion.div 
                    className="flex min-w-[78px] flex-col items-center border-b-2 border-black px-2 pb-1 pt-1 text-[rgb(0,0,0,0.6)] transition-all hover:text-black max-sm:border-none"
                    whileHover={{ y: -2 }}
                >
                    <motion.svg 
                        viewBox="0 0 24 24" 
                        data-supported-dps="24x24" 
                        fill="rgb(0 0 0/.9)" 
                        width="24" 
                        height="24" 
                        focusable="false"
                    >
                        <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
                    </motion.svg>
                    <span className="text-xs text-nowrap">Home</span>
                </motion.div>
                <motion.div 
                    className="flex min-w-[78px] flex-col items-center px-2 pb-1 pt-1 text-[rgb(0,0,0,0.6)] transition-all hover:text-black"
                    whileHover={{ y: -2 }}
                >
                    <svg viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentcolor" width="24" height="24" focusable="false">
                        <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
                    </svg>
                    <span className="text-xs text-nowrap">My Network</span>
                </motion.div>
                <motion.div 
                    className="flex min-w-[78px] flex-col items-center px-2 pb-1 pt-1 text-[rgb(0,0,0,0.6)] transition-all hover:text-black"
                    whileHover={{ y: -2 }}
                >
                    <svg viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" width="24" height="24" focusable="false">
                        <path d="M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm10 9a4 4 0 003-1.38V17a3 3 0 01-3 3H5a3 3 0 01-3-3v-4.38A4 4 0 005 14z"></path>
                    </svg>
                    <span className="text-xs text-nowrap">Jobs</span>
                </motion.div>
                <motion.div 
                    className="flex min-w-[78px] flex-col items-center px-2 pb-1 pt-1 text-[rgb(0,0,0,0.6)] transition-all hover:text-black"
                    whileHover={{ y: -2 }}
                >
                    <svg viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" width="24" height="24" focusable="false">
                        <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                    </svg>
                    <span className="text-xs text-nowrap">Messaging</span>
                </motion.div>
                <motion.div 
                    className="flex min-w-[78px] flex-col items-center px-2 pb-1 pt-1 text-[rgb(0,0,0,0.6)] transition-all hover:text-black"
                    whileHover={{ y: -2 }}
                >
                    <motion.svg 
                        viewBox="0 0 24 24" 
                        data-supported-dps="24x24" 
                        fill="currentColor" 
                        width="24" 
                        height="24" 
                        focusable="false"
                        whileTap={{ rotate: 15 }}
                    >
                        <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
                    </motion.svg>
                    <span className="text-xs text-nowrap">Notifications</span>
                </motion.div>
                <motion.div 
                    className="flex min-w-[58px] max-sm:hidden flex-col items-center px-2 pb-1 pt-1 text-[rgb(0,0,0,0.6)] transition-all hover:text-black"
                    whileHover={{ y: -2 }}
                >
                    <motion.div
                        className={`w-6 h-6 bg-gray-300 flex justify-center items-center self-center rounded-full overflow-hidden`}
                        whileHover={{ scale: 1.1 }}
                    >
                        <img className="w-8 h-8" src={data.meta.avatar} alt={data.meta.name} />
                    </motion.div>
                    <span className="text-xs text-nowrap flex items-center">Me <ArrowDropDown sx={{fontSize:"1rem"}}/></span>
                </motion.div>
                <motion.div 
                    className="flex min-w-[92px] max-sm:hidden flex-col items-center border-l border-gray-200 px-2 pb-1 pt-1 text-[rgb(0,0,0,0.6)] transition-all hover:text-black"
                    whileHover={{ y: -2 }}
                >
                    <svg viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" width="24" height="24" focusable="false">
                        <path d="M3 3h4v4H3zm7 4h4V3h-4zm7-4v4h4V3zM3 14h4v-4H3zm7 0h4v-4h-4zm7 0h4v-4h-4zM3 21h4v-4H3zm7 0h4v-4h-4zm7 0h4v-4h-4z"></path>
                    </svg>
                    <span className="text-xs text-nowrap flex items-center">For Business <ArrowDropDown sx={{fontSize:"1rem"}}/></span>
                </motion.div>
                <motion.div 
                    className="flex min-w-[105px] max-sm:hidden flex-col items-center px-2 pb-1 pt-1 text-[rgb(0,0,0,0.6)] transition-all hover:text-black"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.svg 
                        viewBox="0 0 24 24" 
                        width="24" 
                        height="24" 
                        id="premium-chip-medium" 
                        aria-hidden="true" 
                        role="none" 
                        data-supported-dps="24x24"
                        animate={{ 
                            rotateY: [0, 180, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 10
                        }}
                    >
                        <path d="M20 20a3.36 3.36 0 001-2.39V6.38A3.38 3.38 0 0017.62 3H6.38A3.36 3.36 0 004 4z" fill="#f8c77e"></path>
                        <path d="M4 4a3.36 3.36 0 00-1 2.38v11.24A3.38 3.38 0 006.38 21h11.24A3.36 3.36 0 0020 20z" fill="#e7a33e"></path>
                    </motion.svg>
                    <span className="text-xs text-nowrap">Try Premium for ₹0</span>
                </motion.div>
            </div>
            </div>
        </motion.div>
    );
};

export default Navbar;
