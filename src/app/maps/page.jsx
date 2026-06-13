'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'
import { PROFILE, SECTIONS, RANDOM_PLACES } from '../components/gmaps/sections.js'
import TopBar from '../components/gmaps/TopBar.jsx'
import DetailPanel from '../components/gmaps/DetailPanel.jsx'
import Toast from '../components/gmaps/Toast.jsx'

const MapView = dynamic(() => import('../components/gmaps/MapView.jsx'), {
  ssr: false,
  loading: () => <div className="map map-loading">Loading map...</div>,
})

export default function App() {
  const [activeId, setActiveId] = useState(null)
  // flyTarget changes identity on every request so the map re-flies even to the same place
  const [flyTarget, setFlyTarget] = useState(null)
  const [toast, setToast] = useState(null)

  const activeSection = useMemo(
    () => SECTIONS.find((s) => s.id === activeId) ?? null,
    [activeId],
  )

  const showToast = useCallback((message) => {
    setToast({ message, key: Date.now() })
  }, [])

  const selectSection = useCallback(
    (section) => {
      setActiveId(section.id)
      setFlyTarget({ ...section.location, key: Date.now() })
      showToast(`Travelling to ${section.location.place}…`)
    },
    [showToast],
  )

  const flyTo = useCallback(
    (coords, zoom, placeName) => {
      setFlyTarget({ coords, zoom, key: Date.now() })
      if (placeName) showToast(`Travelling to ${placeName}…`)
    },
    [showToast],
  )

  const surpriseMe = useCallback(() => {
    const place = RANDOM_PLACES[Math.floor(Math.random() * RANDOM_PLACES.length)]
    setActiveId(null)
    setFlyTarget({ coords: place.coords, zoom: 12, key: Date.now() })
    showToast(`✨ Surprise! Off to ${place.name}`)
  }, [showToast])

  return (
    <div className="app">
      <MapView
        sections={SECTIONS}
        activeSection={activeSection}
        flyTarget={flyTarget}
        onMarkerClick={selectSection}
      />
      <TopBar
        profile={PROFILE}
        sections={SECTIONS}
        activeId={activeId}
        onSelect={selectSection}
        onSurprise={surpriseMe}
      />
      {activeSection && (
        <DetailPanel
          section={activeSection}
          onBack={() => setActiveId(null)}
          onFlyTo={flyTo}
        />
      )}
      {toast && <Toast key={toast.key} message={toast.message} />}
    </div>
  )
}
