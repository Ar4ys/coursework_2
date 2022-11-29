'use client'
import type { FC } from 'react'
import { Field, FieldProps } from '../Field'
import type { TextProps } from '../Text'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelProps?: TextProps
  wrapperProps?: FieldProps
}

export const Input: FC<InputProps> = ({ label, labelProps, wrapperProps, ...props }) => {
  return (
    <Field {...wrapperProps} labelProps={labelProps} label={label}>
      <input title={label} {...props} />
    </Field>
  )
}
