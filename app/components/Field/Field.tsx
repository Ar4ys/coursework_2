'use client'
import type { FC } from 'react'
import { Text, TextProps } from '../Text'
import styles from './Field.module.css'

export interface FieldProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
  label?: string
  labelProps?: TextProps
  children?: React.ReactNode
  required?: boolean
}

export const Field: FC<FieldProps> = ({ label, labelProps, children, required, ...props }) => {
  return (
    <label {...props}>
      {label && (
        <Text variant="h5" {...labelProps}>
          {label}
          {required && <span className={styles.requiredStar}>*</span>}
        </Text>
      )}
      {children}
    </label>
  )
}
