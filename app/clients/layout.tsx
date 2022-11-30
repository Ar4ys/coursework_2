import React from 'react'
import { ClientForm } from './ClientForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientForm />
      {children}
    </>
  )
}
