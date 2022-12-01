'use client'
import { FC, useCallback } from 'react'
import ky from 'ky'

import { usePageForm } from '@/hooks/PageForm'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import styles from './ClientForm.module.css'

interface ClientFormCreate {
  editing?: false
  values?: undefined
}

interface ClientFormEdit {
  editing: true
  values: Record<string, any>
}

type ClientFormProps = (ClientFormEdit | ClientFormCreate) & {
  onSubmit?: () => void
}

export const ClientForm: FC<ClientFormProps> = ({ editing, values, onSubmit }) => {
  const { isLoading, isSearching, formRef, getDefault, getDefaultDate, handleSubmit } = usePageForm(
    {
      editing,
      values,
      onSubmit: useCallback(
        async newValues => {
          await ky('/api/client', {
            method: editing ? 'put' : 'post',
            json: {
              ...newValues,
              id: editing ? values.id : undefined,
            },
          })
          onSubmit?.()
        },
        [editing, onSubmit, values?.id],
      ),
    },
  )

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <Input
        className={styles.flexGrow}
        name="firstName"
        label="First Name"
        defaultValue={getDefault('firstName')}
        required={!isSearching}
      />
      <Input
        className={styles.flexGrow}
        name="lastName"
        label="Last Name"
        defaultValue={getDefault('lastName')}
        required={!isSearching}
      />
      <Input
        className={styles.flexGrow}
        name="createdAt"
        label="Since"
        type="date"
        defaultValue={getDefaultDate('createdAt')?.toISODate()}
        required={!isSearching}
      />
      <Button className={styles.button} type="submit" loading={isLoading}>
        Submit
      </Button>
    </form>
  )
}
