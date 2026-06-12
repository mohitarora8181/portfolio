import { useEffect, useState } from 'react'

export default function Toast({ message }) {
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 2600)
    return () => clearTimeout(t)
  }, [])

  if (gone) return null
  return <div className="toast">{message}</div>
}
