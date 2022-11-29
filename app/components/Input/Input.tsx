'use client'
import clsx from 'clsx'
import type { FC } from 'react'
import { Field, FieldProps } from '../Field'
import type { TextProps } from '../Text'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  inputClassName?: string
  labelProps?: TextProps
  wrapperProps?: FieldProps
}

export const Input: FC<InputProps> = ({
  label,
  labelProps,
  wrapperProps,
  className,
  inputClassName,
  ...props
}) => {
  return (
    <Field {...wrapperProps} labelProps={labelProps} label={label} className={className}>
      <input title={label} {...props} className={clsx(styles.input, inputClassName)} />
    </Field>
  )
}
