import { getClientsSelectOptions } from '@/services/db'
import React from 'react'
import { ProjectForm } from './ProjectForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const clients = await getClientsSelectOptions()
  return (
    <>
      <ProjectForm clients={clients} />
      {children}
    </>
  )
}
