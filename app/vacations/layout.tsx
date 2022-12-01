import React from 'react'
import { getEmployeesSelectOptions, getManagersSelectOptions } from '@/services/db'
import { NavBar, NavLink } from '@/components/NavBar'
import { VacationForm } from './VacationForm'

const navLinks: Array<NavLink> = [
  {
    title: 'Form',
    href: '/vacations',
  },
  {
    title: 'Search',
    href: '/vacations/search',
  },
]

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const [employees, managers] = await Promise.all([
    getEmployeesSelectOptions(),
    getManagersSelectOptions(),
  ])

  return (
    <>
      <NavBar links={navLinks} exact />
      <VacationForm employees={employees} managers={managers} />
      {children}
    </>
  )
}
