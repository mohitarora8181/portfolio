import React, { useEffect, useMemo, useState } from 'react';
import { Add, PlayArrow, Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
    spotifyActivity,
    spotifyAlbums,
    spotifyPlaylists,
    spotifyProfile,
} from './spotifyPortfolio';
import type { SpotifyAlbum, SpotifyPlaylist } from './spotifyPortfolio';

const filterOptions = ['All', 'Projects', 'Experience', 'Skills'];

type ContentProps = {
    query: string;
    onQueryChange: (query: string) => void;
    onNowPlayingChange: (item: SpotifyAlbum | SpotifyPlaylist) => void;
};

const Content = ({ query, onQueryChange, onNowPlayingChange }: ContentProps) => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null);
    const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);

    const selectFilter = (filter: string) => {
        setActiveFilter(filter);
        setSelectedPlaylist(null);
        setSelectedAlbum(null);
    };

    const selectPlaylist = (playlist: SpotifyPlaylist) => {
        setActiveFilter('Skills');
        setSelectedPlaylist(playlist);
        setSelectedAlbum(null);
        onNowPlayingChange(playlist);
    };

    const selectAlbum = (album: SpotifyAlbum) => {
        setSelectedAlbum(album);
        setSelectedPlaylist(null);
        onNowPlayingChange(album);
    };

    useEffect(() => {
        if (!selectedPlaylist && !selectedAlbum) {
            onNowPlayingChange(spotifyAlbums[0]);
        }
    }, [activeFilter, selectedAlbum, selectedPlaylist, onNowPlayingChange]);

    const visibleAlbums = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return spotifyAlbums.filter((album) => {
            const matchesFilter =
                activeFilter === 'All' ||
                (activeFilter === 'Projects' && album.id.startsWith('proj_')) ||
                (activeFilter === 'Experience' && album.id.startsWith('exp_'));

            const matchesQuery = !normalizedQuery || [
                album.title,
                album.subtitle,
                album.description,
                ...album.chips,
            ].join(' ').toLowerCase().includes(normalizedQuery);

            return matchesFilter && matchesQuery;
        });
    }, [activeFilter, query]);

    const visiblePlaylists = useMemo(() => {
        if (activeFilter !== 'All' && activeFilter !== 'Skills') return [];
        const normalizedQuery = query.trim().toLowerCase();

        return spotifyPlaylists.filter((playlist) => !normalizedQuery || [
            playlist.title,
            playlist.subtitle,
            ...playlist.tracks,
        ].join(' ').toLowerCase().includes(normalizedQuery));
    }, [activeFilter, query]);

    return (
        <div className='flex h-full overflow-hidden pb-[90px] pt-16 max-sm:block max-sm:overflow-y-auto max-sm:pb-[96px]'>
            <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className='flex w-[380px] min-w-[380px] flex-col gap-2 bg-black p-2 pt-0 max-sm:w-full max-sm:min-w-0'
            >
                <section className='rounded-lg bg-[#121212] p-4'>
                    <div className='flex items-center justify-between text-gray-400'>
                        <div className='flex items-center gap-2'>
                            <span className='font-bold text-white'>Your Library</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <button className='grid h-8 w-8 place-items-center rounded-full hover:bg-[#1f1f1f]'>
                                <Add className='hover:text-white' />
                            </button>
                        </div>
                    </div>

                    <div className='mt-4 rounded-lg bg-[#242424] p-4 max-sm:hidden'>
                        <h3 className='text-sm font-bold text-white'>{spotifyProfile.name}</h3>
                        <p className='mt-1 text-sm text-gray-300'>{spotifyProfile.tagline}</p>
                        <a
                            href={spotifyProfile.resumeUrl}
                            target='_blank'
                            className='mt-4 inline-flex rounded-full bg-white px-4 py-1 text-sm font-bold text-black hover:scale-105'
                        >
                            Open resume
                        </a>
                    </div>

                    <div className='mt-4 flex gap-2 overflow-x-auto py-2 scrollbar-none'>
                        {filterOptions.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => selectFilter(filter)}
                                className={`rounded-full px-3 py-1 text-sm font-medium ${
                                    activeFilter === filter
                                        ? 'bg-white text-black'
                                        : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <label className='mt-2 flex items-center rounded-md bg-[#242424] px-3 text-gray-400'>
                        <Search sx={{ fontSize: 18 }} />
                        <input
                            value={query}
                            onChange={(event) => onQueryChange(event.target.value)}
                            placeholder='Search portfolio library'
                            className='w-full bg-transparent p-2 text-sm text-white outline-none placeholder:text-gray-500'
                        />
                    </label>

                    <div className='mt-4 max-h-[calc(100dvh-390px)] space-y-1 overflow-y-auto scrollbar-none max-sm:max-h-none'>
                        {activeFilter !== 'Skills' && visibleAlbums.slice(0, 4).map((album) => (
                            <motion.button
                                key={album.id}
                                whileHover={{ backgroundColor: '#1a1a1a' }}
                                type='button'
                                onClick={() => selectAlbum(album)}
                                className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left ${
                                    selectedAlbum?.id === album.id ? 'bg-[#2a2a2a]' : ''
                                }`}
                            >
                                <span className='relative h-12 w-12 overflow-hidden rounded-md'>
                                    <img src={album.cover} alt={album.title} className='h-full w-full object-cover' />
                                    <span className='absolute inset-0 grid place-items-center bg-black/50 opacity-0 group-hover:opacity-100'>
                                        <PlayArrow className='text-white' sx={{ fontSize: 30 }} />
                                    </span>
                                </span>
                                <div className='min-w-0 flex-1'>
                                    <h4 className='truncate text-sm font-medium text-white'>{album.title}</h4>
                                    <p className='truncate text-xs text-gray-400'>{album.subtitle}</p>
                                </div>
                            </motion.button>
                        ))}
                        {visiblePlaylists.map((playlist) => (
                            <motion.button
                                key={playlist.id}
                                whileHover={{ backgroundColor: '#1a1a1a' }}
                                type='button'
                                onClick={() => selectPlaylist(playlist)}
                                className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left ${
                                    selectedPlaylist?.id === playlist.id ? 'bg-[#2a2a2a]' : ''
                                }`}
                            >
                                <span className='relative h-12 w-12 overflow-hidden rounded-md'>
                                    <img src={playlist.cover} alt={playlist.title} className='h-full w-full object-cover' />
                                    <span className='absolute inset-0 grid place-items-center bg-black/50 opacity-0 group-hover:opacity-100'>
                                        <PlayArrow className='text-white' sx={{ fontSize: 30 }} />
                                    </span>
                                </span>
                                <div className='min-w-0 flex-1'>
                                    <h4 className='truncate text-sm font-medium text-white'>{playlist.title}</h4>
                                    <p className='truncate text-xs text-gray-400'>{playlist.subtitle}</p>
                                </div>
                            </motion.button>
                        ))}
                        {visiblePlaylists.length === 0 && visibleAlbums.length === 0 && (
                            <p className='py-8 text-center text-sm text-gray-500'>No matching portfolio items.</p>
                        )}
                    </div>
                </section>
            </motion.aside>

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className='flex-1 overflow-y-auto rounded-tl-lg bg-[#121212] scrollbar-none max-sm:block max-sm:overflow-visible max-sm:rounded-none'
            >
                <section className='bg-gradient-to-b from-[#2a2a2a] to-[#121212] p-6'>
                    <div className='flex items-end gap-5 max-sm:items-start max-sm:gap-3'>
                        <img
                            src={selectedPlaylist?.cover ?? selectedAlbum?.cover ?? spotifyProfile.avatar}
                            alt=''
                            className='h-36 w-36 rounded-md object-cover shadow-2xl max-sm:h-24 max-sm:w-24'
                        />
                        <div>
                            <p className='text-xs font-bold uppercase text-white'>
                                {selectedPlaylist ? 'Playlist' : selectedAlbum ? 'Portfolio album' : 'Portfolio playlist'}
                            </p>
                            <h1 className='mt-2 text-6xl font-black text-white max-sm:text-3xl'>
                                {selectedPlaylist?.title ?? selectedAlbum?.title ?? spotifyProfile.name}
                            </h1>
                            <p className='mt-3 text-sm text-gray-300'>
                                {selectedPlaylist?.subtitle ?? selectedAlbum?.description ?? spotifyProfile.tagline}
                            </p>
                            <p className='mt-2 text-sm text-gray-400'>
                                {selectedPlaylist
                                    ? `${selectedPlaylist.tracks.length} tracks`
                                    : selectedAlbum
                                        ? selectedAlbum.subtitle
                                        : `${spotifyAlbums.length} albums • ${spotifyPlaylists.length} playlists`}
                            </p>
                        </div>
                    </div>
                </section>

                <section className='p-6'>
                    {selectedPlaylist ? (
                        <>
                            <h2 className='mb-4 text-2xl font-bold text-white'>{selectedPlaylist.title}</h2>
                            <div className='overflow-hidden rounded-lg border border-white/5'>
                                {selectedPlaylist.tracks.map((track, index) => (
                                    <button
                                        key={track}
                                        type='button'
                                        className='grid w-full grid-cols-[40px_1fr_120px] items-center gap-3 border-b border-white/5 px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10'
                                    >
                                        <span className='text-gray-500'>{index + 1}</span>
                                        <span className='truncate font-medium text-white'>{track}</span>
                                        <span className='justify-self-end text-xs text-gray-500'>{selectedPlaylist.subtitle}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : activeFilter === 'Skills' ? (
                        <>
                            <h2 className='mb-4 text-2xl font-bold text-white'>Skill Playlists</h2>
                            <div className='grid grid-cols-4 gap-4 pb-10 max-xl:grid-cols-3'>
                                {visiblePlaylists.map((playlist) => (
                                    <motion.button
                                        key={playlist.id}
                                        type='button'
                                        onClick={() => selectPlaylist(playlist)}
                                        whileHover={{ backgroundColor: '#282828', y: -4 }}
                                        className='group cursor-pointer rounded-lg bg-[#181818] p-4 text-left transition-colors'
                                    >
                                        <div className='relative'>
                                            <img src={playlist.cover} alt={playlist.title} className='aspect-square w-full rounded-md object-cover shadow-lg' />
                                            <span className='absolute bottom-2 right-2 grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-[#1ed760] opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100'>
                                                <PlayArrow className='text-black' sx={{ fontSize: 30 }} />
                                            </span>
                                        </div>
                                        <h3 className='mt-4 truncate text-sm font-bold text-white'>{playlist.title}</h3>
                                        <p className='mt-1 line-clamp-2 text-sm text-gray-400'>{playlist.tracks.join(', ')}</p>
                                        <p className='mt-3 truncate text-xs font-semibold text-gray-500'>{playlist.subtitle}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className='mb-4 text-2xl font-bold text-white'>
                                {selectedAlbum ? selectedAlbum.title : 'Made For You'}
                            </h2>
                            {selectedAlbum && (
                                <div className='mb-6 space-y-5 rounded-lg bg-[#181818] p-5'>
                                    <div className='flex flex-wrap gap-2'>
                                        {selectedAlbum.meta.map((item) => (
                                            <div key={`${item.label}-${item.value}`} className='rounded-md bg-[#242424] px-3 py-2'>
                                                <p className='text-[11px] font-bold uppercase text-gray-500'>{item.label}</p>
                                                <p className='mt-1 text-sm font-semibold capitalize text-white'>{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className='text-xs font-bold uppercase text-gray-500'>
                                            {selectedAlbum.kind === 'project' ? 'Project details' : 'Experience details'}
                                        </p>
                                        <p className='mt-2 text-sm leading-6 text-gray-300'>{selectedAlbum.description}</p>
                                    </div>
                                    {selectedAlbum.details.length > 0 && (
                                        <div>
                                            <p className='text-xs font-bold uppercase text-gray-500'>Highlights</p>
                                            <div className='mt-2 overflow-hidden rounded-lg border border-white/5'>
                                                {selectedAlbum.details.map((detail, index) => (
                                                    <div
                                                        key={`${selectedAlbum.id}-${detail}`}
                                                        className='grid grid-cols-[36px_1fr] gap-3 border-b border-white/5 px-4 py-3 text-sm text-gray-300 last:border-b-0'
                                                    >
                                                        <span className='text-gray-500'>{index + 1}</span>
                                                        <span className='leading-6'>{detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className='mt-3 flex flex-wrap gap-2'>
                                        {selectedAlbum.chips.map((chip) => (
                                            <span key={chip} className='rounded-full bg-[#2a2a2a] px-3 py-1 text-xs font-semibold text-gray-300'>
                                                {chip}
                                            </span>
                                        ))}
                                    </div>
                                    {selectedAlbum.links.length > 0 && (
                                        <div className='flex flex-wrap gap-2'>
                                            {selectedAlbum.links.map((link) => (
                                                <a
                                                    key={`${selectedAlbum.id}-${link.label}`}
                                                    href={link.href}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='rounded-full bg-white px-4 py-2 text-xs font-bold capitalize text-black hover:scale-105'
                                                >
                                                    Open {link.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className='grid grid-cols-4 gap-4 pb-10 max-xl:grid-cols-3'>
                                {visibleAlbums.map((album) => (
                                    <motion.button
                                        key={album.id}
                                        type='button'
                                        onClick={() => selectAlbum(album)}
                                        whileHover={{ backgroundColor: '#282828', y: -4 }}
                                        className={`group cursor-pointer rounded-lg p-4 text-left transition-colors ${
                                            selectedAlbum?.id === album.id ? 'bg-[#282828]' : 'bg-[#181818]'
                                        }`}
                                    >
                                        <div className='relative'>
                                            <img src={album.cover} alt={album.title} className='aspect-square w-full rounded-md object-cover shadow-lg' />
                                            <span className='absolute bottom-2 right-2 grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-[#1ed760] opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100'>
                                                <PlayArrow className='text-black' sx={{ fontSize: 30 }} />
                                            </span>
                                        </div>
                                        <h3 className='mt-4 truncate text-sm font-bold text-white'>{album.title}</h3>
                                        <p className='mt-1 line-clamp-2 text-sm text-gray-400'>{album.description}</p>
                                        <p className='mt-3 truncate text-xs font-semibold text-gray-500'>{album.subtitle}</p>
                                    </motion.button>
                                ))}
                            </div>
                            {visibleAlbums.length === 0 && (
                                <p className='py-16 text-center text-sm text-gray-500'>No matching portfolio albums.</p>
                            )}
                        </>
                    )}
                </section>
            </motion.main>

            <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className='w-[360px] min-w-[360px] bg-black p-2 max-sm:hidden'
            >
                <section className='h-full rounded-lg bg-[#121212] p-4'>
                    <div className='mb-4 flex items-center justify-between'>
                        <h3 className='font-bold text-white'>Portfolio Activity</h3>
                        <Add className='cursor-pointer text-gray-400 hover:text-white' />
                    </div>
                    <div className='space-y-4'>
                        {spotifyActivity.map((activity) => (
                            <button key={activity.id} type='button' className='flex w-full gap-3 rounded-lg p-2 text-left hover:bg-white/10'>
                                <img
                                    src={`https://picsum.photos/seed/activity-${activity.id}/80/80`}
                                    alt=''
                                    className='h-10 w-10 rounded-full object-cover'
                                />
                                <div className='min-w-0'>
                                    <p className='truncate text-sm font-semibold text-white'>{activity.title}</p>
                                    <p className='line-clamp-2 text-xs text-gray-400'>{activity.subtitle}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </motion.aside>
        </div>
    );
};

export default Content;
