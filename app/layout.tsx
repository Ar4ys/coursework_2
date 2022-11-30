import { NavBar, NavLink } from '@/components/NavBar'
import styles from './layout.module.css'
import './globals.css'

const navLinks: Array<NavLink> = [
  {
    title: 'Work Reports',
    href: '/reports',
  },
  {
    title: 'Clients',
    href: '/clients',
  },
  {
    title: 'Projects',
    href: '/projects',
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className={styles.navbarWrapper}>
          <NavBar links={navLinks} />
        </div>
        {children}
        <div id="app-modal-container" />
      </body>
    </html>
  )
}
