'use client'
import { FC, FormEventHandler, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clients } from 'kysely-codegen'
import { Selectable } from 'kysely'
import ky from 'ky'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { formDataToObject } from '@/services/form'
import styles from './ProjectForm.module.css'
import { Select } from '@/components/Select'

interface ProjectFormCreate {
  editing?: false
  values?: undefined
}

interface ProjectFormEdit {
  editing: true
  values: Record<string, any>
}

type ProjectFormProps = (ProjectFormEdit | ProjectFormCreate) & {
  clients: Array<Pick<Selectable<Clients>, 'id' | 'firstName' | 'lastName'>>
  onSubmit?: () => void
}

export const ProjectForm: FC<ProjectFormProps> = ({ clients, editing, values, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { refresh } = useRouter()

  const clientsOptions = clients.map(({ id, firstName, lastName }) => ({
    title: `${firstName} ${lastName}`,
    value: id,
  }))

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async event => {
      event.preventDefault()
      setLoading(true)
      const data = formDataToObject(event.currentTarget)
      await ky('/api/project', {
        method: editing ? 'put' : 'post',
        json: {
          ...data,
          techStack: data.techStack.split(',').map(tech => tech.trim()),
          id: editing ? values.id : undefined,
        },
      })
      setLoading(false)
      formRef.current?.reset()
      refresh()
      onSubmit?.()
    },
    [editing, values?.id, refresh, onSubmit],
  )

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <Input
        className={styles.flexGrow}
        name="title"
        label="Title"
        defaultValue={editing ? values.title : undefined}
        required
      />
      <Select
        className={styles.flexGrow}
        defaultValue={editing ? values.clientId : undefined}
        name="clientId"
        label="Client"
        placeholder="Select client..."
        options={clientsOptions}
        required
      />
      <Input
        className={styles.flexGrow}
        name="techStack"
        label="Tech Stack"
        defaultValue={editing ? values.techStack.join(', ') : undefined}
      />
      <Button className={styles.button} type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  )
}
