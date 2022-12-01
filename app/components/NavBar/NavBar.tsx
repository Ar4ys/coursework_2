'use client'
import { FC } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { clsx } from 'clsx'
import styles from './NavBar.module.css'

export interface NavLink {
  href: string
  title: string
}

interface NavBarProps {
  className?: string
  exact?: boolean
  links: Array<NavLink>
}

export const NavBar: FC<NavBarProps> = ({ className, links, exact }) => {
  const pathname = usePathname()
  return (
    <nav className={clsx(styles.navbar, className)}>
      {links.map(({ href, title }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            styles.link,
            (exact ? pathname === href : pathname?.startsWith(href)) && styles.active,
          )}
        >
          {title}
        </Link>
      ))}
    </nav>
  )
}
