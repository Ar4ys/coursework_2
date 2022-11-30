'use client'
import { FC, FormEventHandler, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ky from 'ky'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { formDataToObject } from '@/services/form'
import styles from './ClientForm.module.css'
import { DateTime } from 'luxon'

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
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { refresh } = useRouter()

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async event => {
      event.preventDefault()
      setLoading(true)
      await ky('/api/client', {
        method: editing ? 'put' : 'post',
        json: {
          ...formDataToObject(event.currentTarget),
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
        name="firstName"
        label="First Name"
        defaultValue={editing ? values.firstName : undefined}
        required
      />
      <Input
        className={styles.flexGrow}
        name="lastName"
        label="Last Name"
        defaultValue={editing ? values.lastName : undefined}
        required
      />
      <Input
        className={styles.flexGrow}
        name="createdAt"
        label="Since"
        type="date"
        defaultValue={
          editing ? DateTime.fromISO(values.createdAt).toISODate() : DateTime.now().toISODate()
        }
        required
      />
      <Button className={styles.button} type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  )
}
