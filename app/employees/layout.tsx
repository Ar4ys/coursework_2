import React from 'react'
import { EmployeeForm } from './EmployeeForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EmployeeForm />
      {children}
    </>
  )
}
