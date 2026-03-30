import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Tv, FileText, LogOut, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import styles from './AdminLayout.module.css'

const NAV = [
  { to: '/admin',          label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { to: '/admin/channels', label: 'Canales',    icon: Tv },
  { to: '/admin/logs',     label: 'Logs',       icon: FileText },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <Tv size={20} strokeWidth={1.5} className={styles.brandIcon} />
            <span className={`${styles.brandText} display-title`}>EDGAR<span className={styles.brandAccent}>AI</span></span>
          </div>
          <p className={styles.adminLabel}>Panel Administrativo</p>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Icon size={17} />
              <span>{label}</span>
              <ChevronRight size={14} className={styles.navArrow} />
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{user?.email?.[0]?.toUpperCase()}</div>
            <div className={styles.userMeta}>
              <p className={styles.userEmail}>{user?.email}</p>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
