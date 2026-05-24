'use client'

import React, { useState } from 'react'
import Navbar from '../components/linkedin/Navbar'
import Content from '../components/linkedin/Content'
import type { LinkedInSection } from '../components/linkedin/linkedinPortfolio'

const Page = () => {
    const [query, setQuery] = useState('')
    const [activeSection, setActiveSection] = useState<LinkedInSection>('All')

    return (
        <div className='w-full min-h-screen bg-[#f4f2ee] max-sm:overflow-x-hidden max-sm:relative'>
            <Navbar query={query} onQueryChange={setQuery} />
            <div className='w-full'>
                <Content
                    query={query}
                    onQueryChange={setQuery}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
            </div>
        </div>
    )
}

export default Page
