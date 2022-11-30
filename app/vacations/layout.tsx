import { db, getEmployeesSelectOptions, getManagersSelectOptions } from '@/services/db'
import React from 'react'
import styles from './layout.module.css'
import { VacationForm } from './VacationForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const [employees, managers] = await Promise.all([
    getEmployeesSelectOptions(),
    getManagersSelectOptions(),
  ])

  return (
    <div className={styles.wrapper}>
      <VacationForm employees={employees} managers={managers} />
      {children}
    </div>
  )
}
