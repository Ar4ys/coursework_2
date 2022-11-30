import { getClientsSelectOptions } from '@/services/db'
import React from 'react'
import styles from './layout.module.css'
import { ProjectForm } from './ProjectForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const clients = await getClientsSelectOptions()
  return (
    <div className={styles.wrapper}>
      <ProjectForm clients={clients} />
      {children}
    </div>
  )
}
