import { db, getEmployeesSelectOptions, getManagersSelectOptions } from '@/services/db'
import React from 'react'
import { VacationForm } from './VacationForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const [employees, managers] = await Promise.all([
    getEmployeesSelectOptions(),
    getManagersSelectOptions(),
  ])

  return (
    <>
      <VacationForm employees={employees} managers={managers} />
      {children}
    </>
  )
}
