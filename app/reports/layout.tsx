import { db, getEmployeesSelectOptions, getProjectsSelectOptions } from '@/services/db'
import React from 'react'
import styles from './layout.module.css'
import { ReportForm } from './ReportForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const [employees, projects] = await Promise.all([
    getEmployeesSelectOptions(),
    getProjectsSelectOptions(),
  ])

  return (
    <div className={styles.wrapper}>
      <ReportForm authors={employees} projects={projects} />
      {children}
    </div>
  )
}
