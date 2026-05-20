'use client'

import React from 'react'
import Navbar from '../components/linkedin/Navbar'
import Content from '../components/linkedin/Content'

const page = () => {
    return (
        <div className='w-full h-full bg-[#f4f2ee] overflow-y-scroll max-sm:overflow-x-hidden max-sm:relative'>
            <Navbar />
            <div className='w-full h-full px-40 max-sm:px-0'>
                <Content />
            </div>
        </div>
    )
}

export default page
