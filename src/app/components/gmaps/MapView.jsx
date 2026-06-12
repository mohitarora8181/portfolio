import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { PROFILE } from './sections.js'

// Carto Voyager looks closest to Google Maps, but isn't reachable on every
// network — probe one tile and fall back to standard OSM if it fails.
const TILE_PROVIDERS = {
  carto: {
    url: 'https://{s}.basemap.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: 'abc',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
}

function useTileProvider() {
  const [provider, setProvider] = useState('osm')
  useEffect(() => {
    const probe = new Image()
    probe.onload = () => setProvider('carto')
    probe.src = 'https://a.basemap.cartocdn.com/rastertiles/voyager/3/4/3.png'
  }, [])
  return provider
}

// Google-Maps-style pin as an inline SVG divIcon, tinted per section
function pinIcon(color, emoji, active) {
  const size = active ? 52 : 40
  return L.divIcon({
    className: 'pin-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    html: `
      <div class="pin ${active ? 'pin-active' : ''}" style="width:${size}px;height:${size}px">
        <svg viewBox="0 0 24 24" width="${size}" height="${size}">
          <path fill="${color}" stroke="#fff" stroke-width="1"
            d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/>
        </svg>
        <span class="pin-emoji" style="font-size:${size * 0.32}px">${emoji}</span>
      </div>`,
  })
}

// Imperative bridge: react-leaflet renders the map; this drives flyTo on demand
function FlyController({ flyTarget }) {
  const map = useMap()
  useEffect(() => {
    if (!flyTarget) return
    map.flyTo(flyTarget.coords, flyTarget.zoom ?? 12, {
      duration: 2.4,
      easeLinearity: 0.15,
    })
  }, [flyTarget, map])
  return null
}

function ResizeController() {
  const map = useMap()
  useEffect(() => {
    const refresh = () => map.invalidateSize()
    const first = window.setTimeout(refresh, 0)
    const second = window.setTimeout(refresh, 250)
    window.addEventListener('resize', refresh)

    return () => {
      window.clearTimeout(first)
      window.clearTimeout(second)
      window.removeEventListener('resize', refresh)
    }
  }, [map])
  return null
}

export default function MapView({ sections, activeSection, flyTarget, onMarkerClick }) {
  const { home } = PROFILE
  const provider = useTileProvider()
  // Any active section with 2+ sub-item stops gets pins + a directions route
  const stops = activeSection?.stops?.length > 1 ? activeSection.stops : null

  return (
    <MapContainer
      className="map"
      center={home.coords}
      zoom={home.zoom}
      zoomControl={false}
      worldCopyJump
    >
      <TileLayer
        key={provider}
        attribution={TILE_PROVIDERS[provider].attribution}
        url={TILE_PROVIDERS[provider].url}
        subdomains={TILE_PROVIDERS[provider].subdomains}
        maxZoom={19}
      />
      <ResizeController />
      <FlyController flyTarget={flyTarget} />

      {sections.map((section) => (
        <Marker
          key={section.id}
          position={section.location.coords}
          icon={pinIcon(section.color, section.icon, activeSection?.id === section.id)}
          eventHandlers={{ click: () => onMarkerClick(section) }}
          zIndexOffset={activeSection?.id === section.id ? 1000 : 0}
        >
          <Tooltip direction="top" offset={[0, -42]}>
            {section.title}
          </Tooltip>
        </Marker>
      ))}

      {/* Sub-item pins + directions route for the open section */}
      {stops && (
        <>
          <Polyline
            positions={stops.map((s) => s.coords)}
            pathOptions={{
              color: activeSection.color,
              weight: 4,
              dashArray: '1 10',
              lineCap: 'round',
            }}
          />
          {stops.map((stop) => (
            <Marker
              key={stop.id}
              position={stop.coords}
              icon={pinIcon(activeSection.color, activeSection.icon, false)}
              eventHandlers={{ click: () => onMarkerClick(activeSection) }}
            >
              <Tooltip direction="top" offset={[0, -34]}>
                {stop.label}
                {stop.sub ? ` · ${stop.sub}` : ''}
              </Tooltip>
            </Marker>
          ))}
        </>
      )}
    </MapContainer>
  )
}
