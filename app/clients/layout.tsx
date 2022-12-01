import { NavBar, NavLink } from '@/components/NavBar'
import React from 'react'
import { ClientForm } from './ClientForm'

const navLinks: Array<NavLink> = [
  {
    title: 'Form',
    href: '/clients',
  },
  {
    title: 'Search',
    href: '/clients/search',
  },
]

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar links={navLinks} exact />
      <ClientForm />
      {children}
    </>
  )
}
