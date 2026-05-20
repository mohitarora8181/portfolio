import React from 'react';
import { Add, Menu, Mic, NotificationsOutlined, Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import data from '@/myData.json';

type NavbarProps = {
  setIsSidebarOpen: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ setIsSidebarOpen }) => {
  return (
    <motion.div
      className="w-full fixed z-1000 flex items-center justify-between bg-white text-black p-2 px-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          onClick={setIsSidebarOpen}
          className="p-2 rounded-full cursor-pointer hover:bg-gray-200 items-center flex justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="w-12 h-12" />
        </motion.span>
        <motion.div
          className="text-xl font-bold cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <img
            className="h-5"
            src="https://upload.wikimedia.org/wikipedia/commons/2/20/YouTube_2024.svg"
            alt="YouTube Logo"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="flex gap-4 flex-grow max-w-2xl max-sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center max-h-10 w-full rounded-full border border-[#c6c6c6] overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            className="flex-grow px-4 py-2 rounded-l-md bg-white text-black focus:outline-none"
          />
          <motion.button
            className="px-5 py-2 h-full cursor-pointer rounded-r-md bg-[#f0f0f0] hover:bg-[#f8f8f8]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-5 h-5" />
          </motion.button>
        </div>
        <motion.span
          className="p-2 rounded-full cursor-pointer bg-[#f0f0f0] hover:bg-[#f8f8f8] items-center flex justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Mic className="w-12 h-12" />
        </motion.span>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 pr-5 justify-end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="h-full p-1.5 px-3 rounded-full text-sm cursor-pointer bg-[#f0f0f0] hover:bg-[#f8f8f8] items-center flex justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Add />
          Create
        </motion.span>
        <motion.span
          className="p-2 max-sm:hidden rounded-full cursor-pointer hover:bg-gray-200 items-center flex justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <NotificationsOutlined sx={{ strokeWidth: 1 }} className="w-12 h-12" />
        </motion.span>
        <motion.span
          className="rounded-full cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.1 }}
        >
          <img className="w-8 h-8" src={data.profileImage} alt="Profile" />
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;