import React from 'react';
import { motion } from 'framer-motion';

type FilterBarProps = {
    activeFilter: string;
    filters: string[];
    onChange: (filter: string) => void;
    sidebarOpen: boolean;
};

const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, filters, onChange, sidebarOpen }) => {
    return (
        <motion.div
            className={`sticky top-[56px] z-20 flex gap-3 overflow-x-auto bg-white px-5 py-3 scrollbar-none ${
                sidebarOpen ? 'max-sm:w-full' : 'w-full'
            }`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onChange(filter)}
                    className={`rounded-lg px-4 py-2 text-nowrap text-sm transition ${
                        activeFilter === filter
                            ? 'bg-black text-white'
                            : 'bg-[#f0f0f0] text-gray-800 hover:bg-[#e4e4e4]'
                    }`}
                >
                    {filter}
                </button>
            ))}
        </motion.div>
    );
};

export default FilterBar;
