import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ChannelCard from './ChannelCard'
import styles from './ChannelRow.module.css'

export default function ChannelRow({ label, slug, channels = [], style }) {
  const rowRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft]   = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (dir) => {
    const el = rowRef.current
    if (!el) return
    el.scrollBy({ left: dir * 400, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = rowRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
  }

  return (
    <section className={styles.section} style={style}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={`${styles.label} display-title`}>{label}</h2>
        <Link to={`/category/${slug}`} className={styles.viewAll}>
          Ver todo →
        </Link>
      </div>

      {/* Scroll container */}
      <div className={styles.wrapper}>
        {canScrollLeft && (
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => scroll(-1)}>
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          ref={rowRef}
          className={styles.row}
          onScroll={onScroll}
        >
          {channels.map((ch, i) => (
            <ChannelCard
              key={ch.id}
              channel={ch}
              index={i}
            />
          ))}
        </div>

        {canScrollRight && (
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => scroll(1)}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </section>
  )
}
