import React from 'react'
import { getEmployeesSelectOptions, getManagersSelectOptions } from '@/services/db'
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
