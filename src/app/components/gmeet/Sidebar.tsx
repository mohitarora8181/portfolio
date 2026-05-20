import React, { useState, useEffect } from 'react';
import {
    Person,
    Close,
    Search,
    Add,
    MoreVert,
    ExpandMore
} from '@mui/icons-material';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const PeopleSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <div
            className={`fixed top-0 right-0 bottom-0 bg-white w-80 shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                } z-50`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-medium text-gray-800">People</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <Close className="text-gray-600" />
                    </button>
                </div>

                {/* Add people button */}
                <div className="p-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors w-full">
                        <Add fontSize="small" />
                        <span>Add people</span>
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 mb-2">
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                        <Search className="text-gray-400 mr-2" fontSize="small" />
                        <input
                            type="text"
                            placeholder="Search for people"
                            className="bg-transparent outline-none flex-1 text-sm"
                        />
                    </div>
                </div>

                {/* In the meeting section */}
                <div className="px-4 py-2">
                    <p className="text-xs text-gray-500 font-medium">IN THE MEETING</p>
                </div>

                {/* Contributors section */}
                <div className="px-4 border-t">
                    <div className="flex justify-between items-center py-3">
                        <h3 className="text-sm font-medium text-gray-700">Contributors</h3>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm">1</span>
                            <ExpandMore fontSize="small" className="text-gray-500" />
                        </div>
                    </div>

                    {/* Participant */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                                <span className="text-white font-medium">MA</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Mohit Arora (You)</p>
                                <p className="text-xs text-gray-500">Meeting host</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                                <span className="text-xs px-1">...</span>
                            </button>
                            <button className="p-1 rounded-full hover:bg-gray-100">
                                <MoreVert fontSize="small" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filler space */}
                <div className="flex-grow"></div>
            </div>
        </div>
    );
};

export default PeopleSidebar;