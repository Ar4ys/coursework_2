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
  links: Array<NavLink>
}

export const NavBar: FC<NavBarProps> = ({ className, links }) => {
  const pathname = usePathname()
  return (
    <nav className={clsx(styles.navbar, className)}>
      {links.map(({ href, title }) => (
        <Link
          key={href}
          href={href}
          className={clsx(styles.link, pathname === href && styles.active)}
        >
          {title}
        </Link>
      ))}
    </nav>
  )
}
