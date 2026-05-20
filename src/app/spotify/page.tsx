'use client'
import React from 'react'
import Navbar from '../components/spotify/Navbar'
import Footer from '../components/spotify/Footer'
import Content from '../components/spotify/Content'

const page = () => {
  return (
    <div className='w-full h-full bg-black overflow-hidden'>
      <Navbar />
      <Content />
      <Footer />
    </div>
  )
}

export default page
