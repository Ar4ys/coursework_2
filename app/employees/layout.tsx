import React from 'react'
import { NavBar, NavLink } from '@/components/NavBar'
import { EmployeeForm } from './EmployeeForm'

const navLinks: Array<NavLink> = [
  {
    title: 'Form',
    href: '/employees',
  },
  {
    title: 'Search',
    href: '/employees/search',
  },
]

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar links={navLinks} exact />
      <EmployeeForm />
      {children}
    </>
  )
}
