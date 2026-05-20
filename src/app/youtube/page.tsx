'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../components/youtube/Navbar'
import Sidebar from '../components/youtube/Sidebar'
import MainContent from '../components/youtube/MainContent'

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth > 746) {
        setIsSidebarOpen(true);
      }
    }
  }, [])

  return (
    <div className='w-full h-full flex flex-col'>
      <Navbar setIsSidebarOpen={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className='pt-10 flex flex-1'>
        {isSidebarOpen && (
          <aside className='flex-shrink-0 w-[220px] h-full py-8 p-2'>
            <Sidebar />
          </aside>
        )}
        <main className={`h-full py-4 ${isSidebarOpen ? 'w-[calc(100%-220px)]' : 'w-full'}`}>
          <MainContent />
        </main>
      </div>
    </div>
  )
}

export default Page