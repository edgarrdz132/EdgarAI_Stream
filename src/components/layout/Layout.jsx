import React, { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, User, Menu, X, LogOut, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import styles from './Layout.module.css'

const EDGAR_IMG = 'https://jelxossqzywochqsszsq.supabase.co/storage/v1/object/public/assets/edgarai.jpg'

const NAV_LINKS = [
  { label: 'Películas',   path: '/peliculas' },
  { label: 'Series',      path: '/series' },
  { label: 'Anime',       path: '/anime' },
  { label: 'Caricaturas', path: '/caricaturas' },
  { label: 'Juegos', path: '/telenovelas' },
  { label: 'En Vivo',     path: '/en-vivo' },   // ← corregido
]

export default function Layout() {
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal]   = useState('')
  const searchRef = useRef(null)
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`)
      setSearchVal('')
      setSearchOpen(false)
    }
  }

  return (
    <div className={styles.page}>
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navInner}>
          {/* Logo con mascota */}
          <Link to="/" className={styles.logo}>
            <div style={{ width: 32, height: 32, borderRadius: 7, overflow: 'hidden', border: '1.5px solid rgba(229,9,20,0.5)', flexShrink: 0 }}>
              <img src={EDGAR_IMG} alt="EdgarAI" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.parentElement.innerHTML = '🎭' }} />
            </div>
              <span className={styles.logoText}>
 		 <span style={{ display: 'block', lineHeight: 1 }}>EDGAR<span className={styles.logoAccent}>AI</span></span>
 		 <span style={{ display: 'block', lineHeight: 1.2, fontSize: '11px', letterSpacing: 6, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>STREAM</span>
		</span>
          </Link>

          {/* Desktop nav */}
          <ul className={styles.navLinks}>
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`${styles.navLink} ${location.pathname === link.path ? styles.navLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className={styles.navActions}>
            <div className={`${styles.searchWrapper} ${searchOpen ? styles.searchOpen : ''}`}>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Buscar películas, series..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className={styles.searchInput}
                />
              </form>
              <button className={styles.iconBtn} onClick={() => setSearchOpen(!searchOpen)} aria-label="Buscar">
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>
            </div>

            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <button className={styles.iconBtn} aria-label="Perfil">
                  <User size={18} />
                </button>
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownEmail}>{user?.email}</p>
                    <span className={`${styles.roleBadge} ${user?.role === 'admin' ? styles.roleBadgeAdmin : ''}`}>
                      {user?.role}
                    </span>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link to="/profile" className={styles.dropdownItem}><User size={14} /> Mi perfil</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className={styles.dropdownItem}><Shield size={14} /> Panel Admin</Link>
                  )}
                  <div className={styles.dropdownDivider} />
                  <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                    <LogOut size={14} /> Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className={styles.loginBtn}>Entrar</Link>
            )}

            <button className={`${styles.iconBtn} ${styles.hamburger}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={styles.mobileMenu}>
            {NAV_LINKS.map((link) => (
              <Link key={link.path} to={link.path} className={styles.mobileLink}>{link.label}</Link>
            ))}
          </div>
        )}
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <img src={EDGAR_IMG} alt="EdgarAI" style={{ width: 22, height: 22, borderRadius: 5, objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none' }} />
            <span>EDGARAI STREAM</span>
          </div>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} EdgarAI Stream. Plataforma de streaming premium.</p>
        </div>
      </footer>
    </div>
  )
}
