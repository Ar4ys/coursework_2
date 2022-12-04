'use client'
import { FC } from 'react'
import { usePageForm } from '@/hooks/PageForm'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import styles from './SummaryForm.module.css'

export const SummaryForm: FC = () => {
  const { isLoading, formRef, getDefaultDate, handleSubmit } = usePageForm({
    searching: true,
  })

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <Input
        className={styles.flexGrow}
        name="from"
        label="From"
        type="date"
        defaultValue={getDefaultDate('from')?.toISODate()}
      />
      <Input
        className={styles.flexGrow}
        name="to"
        label="To"
        type="date"
        defaultValue={getDefaultDate('to')?.toISODate()}
      />
      <Button className={styles.button} type="submit" loading={isLoading}>
        Generate
      </Button>
    </form>
  )
}
