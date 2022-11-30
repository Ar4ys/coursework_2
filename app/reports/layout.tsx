import React from 'react'
import { getEmployeesSelectOptions, getProjectsSelectOptions } from '@/services/db'
import { ReportForm } from './ReportForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const [employees, projects] = await Promise.all([
    getEmployeesSelectOptions(),
    getProjectsSelectOptions(),
  ])

  return (
    <>
      <ReportForm authors={employees} projects={projects} />
      {children}
    </>
  )
}
