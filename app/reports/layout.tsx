import React from 'react'
import { getEmployeesSelectOptions, getProjectsSelectOptions } from '@/services/db'
import { NavBar, NavLink } from '@/components/NavBar'
import { ReportForm } from './ReportForm'

const navLinks: Array<NavLink> = [
  {
    title: 'Form',
    href: '/reports',
  },
  {
    title: 'Search',
    href: '/reports/search',
  },
]

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const [employees, projects] = await Promise.all([
    getEmployeesSelectOptions(),
    getProjectsSelectOptions(),
  ])

  return (
    <>
      <NavBar links={navLinks} exact />
      <ReportForm authors={employees} projects={projects} />
      {children}
    </>
  )
}
