'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../components/youtube/Navbar'
import Sidebar from '../components/youtube/Sidebar'
import MainContent from '../components/youtube/MainContent'

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth > 746) {
        setIsSidebarOpen(true);
      }
    }
  }, [])

  return (
    <div className='min-h-screen w-full bg-white text-black'>
      <Navbar setIsSidebarOpen={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className='flex pt-14'>
        {isSidebarOpen && (
          <aside className='w-[220px] flex-shrink-0 p-2 pt-4 max-sm:hidden'>
            <Sidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </aside>
        )}
        <main className={`${isSidebarOpen ? 'w-[calc(100%-220px)] max-sm:w-full' : 'w-full'}`}>
          <MainContent
            sidebarOpen={isSidebarOpen}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </main>
      </div>
    </div>
  )
}

export default Page
