import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { clsx } from 'clsx'
import React from 'react'
import styles from './layout.module.css'

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <form className={styles.form}>
        <Input name="date" label="Date" type="date" />
        <div className={clsx(styles.left)}>
          <div className={clsx(styles.top)}>
            <Select
              className={styles.flexGrow}
              name="author"
              label="Author"
              options={[{ value: 'Test' }, { value: 'Test1' }]}
            />
            <Select
              className={styles.flexGrow}
              name="project"
              label="Project"
              options={[{ value: 'Test' }, { value: 'Test1' }]}
            />
            <Select
              className={styles.flexGrow}
              name="category"
              label="Category"
              options={[{ value: 'Test' }, { value: 'Test1' }]}
            />
          </div>
          <Input name="description" label="Description" type="text" />
        </div>
        <div className={clsx(styles.right)}>
          <Input
            inputClassName={styles.timeInput}
            inputMode="decimal"
            name="time"
            label="Time"
            type="number"
            min={0}
          />
          <Button type="reset">Test</Button>
        </div>
      </form>
      {children}
    </div>
  )
}
