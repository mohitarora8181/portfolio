'use client'
import React, { useCallback, useState } from 'react'
import Navbar from '../components/spotify/Navbar'
import Footer from '../components/spotify/Footer'
import Content from '../components/spotify/Content'
import { nowPlaying as defaultNowPlaying } from '../components/spotify/spotifyPortfolio'
import type { SpotifyAlbum, SpotifyPlaylist } from '../components/spotify/spotifyPortfolio'

const Page = () => {
  const [query, setQuery] = useState('')
  const [nowPlaying, setNowPlaying] = useState<SpotifyAlbum | SpotifyPlaylist>(defaultNowPlaying)
  const updateNowPlaying = useCallback((item: SpotifyAlbum | SpotifyPlaylist) => {
    setNowPlaying(item)
  }, [])

  return (
    <div className='h-dvh w-full bg-black overflow-hidden'>
      <Navbar query={query} onQueryChange={setQuery} />
      <Content query={query} onQueryChange={setQuery} onNowPlayingChange={updateNowPlaying} />
      <Footer nowPlaying={nowPlaying} />
    </div>
  )
}

export default Page
