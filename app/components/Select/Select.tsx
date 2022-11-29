'use client'
import type { FC } from 'react'
import { Field, FieldProps } from '../Field'
import type { TextProps } from '../Text'
import styles from './Select.module.css'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  labelProps?: TextProps
  wrapperProps?: FieldProps
  options: Array<OptionProps>
}

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export const Select: FC<SelectProps> = ({ label, labelProps, wrapperProps, options, ...props }) => {
  return (
    <Field {...wrapperProps} labelProps={labelProps} label={label}>
      <select {...props}>
        {options.map(optionProps => (
          <option key={optionProps.value?.toString()} {...optionProps}>
            {optionProps.title ?? optionProps.value}
          </option>
        ))}
      </select>
    </Field>
  )
}
