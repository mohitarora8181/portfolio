import React, { useMemo, useState } from 'react';
import { Add, Menu, Mic, NotificationsOutlined, Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getPortfolioData } from '@/src/services/portfolioData';
import { youtubeVideos } from './youtubePortfolio';

const data = getPortfolioData();

type NavbarProps = {
  setIsSidebarOpen: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ setIsSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return youtubeVideos
      .filter((video) => {
        const searchableText = [
          video.title,
          video.description,
          video.channel,
          video.meta,
          video.section,
          ...video.chips,
        ].join(' ').toLowerCase();

        return searchableText.includes(query);
      })
      .slice(0, 6);
  }, [searchQuery]);

  return (
    <motion.div
      className="fixed left-0 top-0 z-[1000] flex w-full items-center justify-between gap-2 bg-white p-2 px-3 text-black"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex min-w-0 items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          onClick={setIsSidebarOpen}
          className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-gray-200 max-sm:p-1.5"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="w-12 h-12" />
        </motion.span>
        <motion.div
          className="min-w-0 cursor-pointer text-xl font-bold"
          whileHover={{ scale: 1.05 }}
        >
          <img
            className="h-5 max-sm:h-4"
            src="https://upload.wikimedia.org/wikipedia/commons/2/20/YouTube_2024.svg"
            alt="YouTube Logo"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative flex flex-grow max-w-2xl gap-4 max-sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex max-h-10 w-full items-center overflow-hidden rounded-full border border-[#c6c6c6] bg-white">
          <input
            type="text"
            placeholder="Search portfolio videos"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
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
        {searchQuery.trim() && (
          <motion.div
            className="absolute left-0 top-12 z-[1100] w-[calc(100%-56px)] overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-2xl"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            {searchResults.length > 0 ? (
              searchResults.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-[#f2f2f2]"
                  onClick={() => setSearchQuery(video.title)}
                >
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="h-14 w-24 flex-none rounded-md object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-black">{video.title}</span>
                    <span className="mt-1 block truncate text-xs text-gray-600">{video.section} | {video.meta}</span>
                    <span className="mt-1 block truncate text-xs text-gray-500">{video.description}</span>
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No matching portfolio videos found.
              </div>
            )}
          </motion.div>
        )}
        <motion.span
          className="p-2 rounded-full cursor-pointer bg-[#f0f0f0] hover:bg-[#f8f8f8] items-center flex justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Mic className="w-12 h-12" />
        </motion.span>
      </motion.div>

      <motion.div
        className="flex shrink-0 items-center justify-end gap-2 pr-5 max-sm:gap-1 max-sm:pr-0"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="flex h-full cursor-pointer items-center justify-center rounded-full bg-[#f0f0f0] p-1.5 px-3 text-sm hover:bg-[#f8f8f8] max-sm:h-9 max-sm:w-9 max-sm:px-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Add />
          <span className="max-sm:hidden">Create</span>
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
          <img className="w-8 h-8" src={data.meta.avatar} alt={data.meta.name} />
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;
