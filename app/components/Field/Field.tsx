'use client'
import { clsx } from 'clsx'
import type { FC } from 'react'
import { Text, TextProps } from '../Text'
import styles from './Field.module.css'

export interface FieldProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
  label?: string
  labelProps?: TextProps
  children?: React.ReactNode
}

export const Field: FC<FieldProps> = ({ label, labelProps, children, ...props }) => {
  return (
    <label {...props}>
      {label && (
        <Text variant="h5" {...labelProps} className={clsx(styles.label, labelProps?.className)}>
          {label}
        </Text>
      )}
      {children}
    </label>
  )
}
