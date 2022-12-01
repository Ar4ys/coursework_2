'use client'
import { FC, FormEventHandler, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clients } from 'kysely-codegen'
import { Selectable } from 'kysely'
import ky from 'ky'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { usePageForm } from '@/hooks/PageForm'
import styles from './ProjectForm.module.css'

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
  const { isLoading, isSearching, formRef, getDefault, getDefaultArray, handleSubmit } =
    usePageForm({
      editing,
      values,
      onSubmit: useCallback(
        async newValues => {
          await ky('/api/project', {
            method: editing ? 'put' : 'post',
            json: {
              ...newValues,
              techStack: newValues.techStack.split(',').map(tech => tech.trim()),
              id: editing ? values.id : undefined,
            },
          })
          onSubmit?.()
        },
        [editing, onSubmit, values?.id],
      ),
    })

  const clientsOptions = clients.map(({ id, firstName, lastName }) => ({
    title: `${firstName} ${lastName}`,
    value: id,
  }))

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <Input
        className={styles.flexGrow}
        name="title"
        label="Title"
        defaultValue={getDefault('title')}
        required={!isSearching}
      />
      <Select
        className={styles.flexGrow}
        defaultValue={getDefault('clientId')}
        name="clientId"
        label="Client"
        placeholder="Select client..."
        options={clientsOptions}
        required={!isSearching}
      />
      <Input
        className={styles.flexGrow}
        name="techStack"
        label="Tech Stack"
        defaultValue={getDefaultArray('techStack').join(', ')}
      />
      <Button className={styles.button} type="submit" loading={isLoading}>
        Submit
      </Button>
    </form>
  )
}
