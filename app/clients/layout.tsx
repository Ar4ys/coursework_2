import React from 'react'
import styles from './layout.module.css'
import { ClientForm } from './ClientForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <ClientForm />
      {children}
    </div>
  )
}
