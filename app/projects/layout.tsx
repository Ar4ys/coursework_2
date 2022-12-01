import React from 'react'
import { getClientsSelectOptions } from '@/services/db'
import { NavBar, NavLink } from '@/components/NavBar'
import { ProjectForm } from './ProjectForm'

const navLinks: Array<NavLink> = [
  {
    title: 'Form',
    href: '/projects',
  },
  {
    title: 'Search',
    href: '/projects/search',
  },
]

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const clients = await getClientsSelectOptions()
  return (
    <>
      <NavBar links={navLinks} exact />
      <ProjectForm clients={clients} />
      {children}
    </>
  )
}
