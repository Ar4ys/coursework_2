import React from 'react'
import { NavBar, NavLink } from '@/components/NavBar'

const navLinks: Array<NavLink> = [
  {
    title: 'Chart',
    href: '/summary',
  },
  {
    title: 'Table',
    href: '/summary/table',
  },
]

export default async function SummaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar links={navLinks} exact />
      {children}
    </>
  )
}
