'use client'
import type { FC } from 'react'
import { Text, TextProps } from '../Text'

export interface FieldProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
  label?: string
  labelProps?: TextProps
  children?: React.ReactNode
}

export const Field: FC<FieldProps> = ({ label, labelProps, children, ...props }) => {
  return (
    <label {...props}>
      {label && (
        <Text variant="h5" {...labelProps}>
          {label}
        </Text>
      )}
      {children}
    </label>
  )
}
