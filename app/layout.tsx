import { NavBar, NavLink } from '@/components/NavBar'
import { GlobalKeyboardListener } from '@/components/GlobalKeyboardListener'
import styles from './layout.module.css'
import './globals.css'

const navLinks: Array<NavLink> = [
  {
    title: 'Work Reports',
    href: '/reports',
  },
  {
    title: 'Vacations',
    href: '/vacations',
  },
  {
    title: 'Clients',
    href: '/clients',
  },
  {
    title: 'Employees',
    href: '/employees',
  },
  {
    title: 'Projects',
    href: '/projects',
  },
  {
    title: 'Summary Report',
    href: '/summary',
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <GlobalKeyboardListener />
        <div className={styles.navbarWrapper}>
          <NavBar links={navLinks} />
        </div>
        <main className={styles.mainWrapper}>{children}</main>
        <div id="app-modal-container" />
      </body>
    </html>
  )
}
