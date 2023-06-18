import { useRef, useEffect } from 'react'

export function useHorizontalScroll() {
  const elRef = useRef()
  useEffect(() => {
    const el = elRef.current
    if (el) {
      const onWheel = (e) => {
        const movePixel = e.deltaY > 0 ? 190 : -190
        if (e.deltaY === 0) return
        e.preventDefault()
        el.scrollTo({
          left: el.scrollLeft + movePixel,
          behavior: 'smooth',
        })
      }
      el.addEventListener('wheel', onWheel)
      return () => el.removeEventListener('wheel', onWheel)
    }
    return undefined
  }, [])
  return elRef
}
