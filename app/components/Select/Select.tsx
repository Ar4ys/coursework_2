'use client'
import clsx from 'clsx'
import type { FC } from 'react'
import { Field, FieldProps } from '../Field'
import type { TextProps } from '../Text'
import styles from './Select.module.css'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  selectClassName?: string
  labelProps?: TextProps
  wrapperProps?: FieldProps
  allowEmpty?: boolean
  options: Array<OptionProps>
}

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export const Select: FC<SelectProps> = ({
  label,
  labelProps,
  wrapperProps,
  options,
  placeholder,
  className,
  selectClassName,
  required,
  defaultValue,
  allowEmpty,
  ...props
}) => {
  return (
    <Field
      {...wrapperProps}
      labelProps={labelProps}
      label={label}
      className={className}
      required={required}
    >
      <select
        {...props}
        className={clsx(styles.select, selectClassName)}
        defaultValue={defaultValue ?? ''}
        required={required}
      >
        {placeholder && (
          <option value="" disabled={!allowEmpty} hidden={!allowEmpty}>
            {placeholder}
          </option>
        )}
        {options.map(optionProps => (
          <option key={optionProps.value?.toString()} {...optionProps}>
            {optionProps.title ?? optionProps.value}
          </option>
        ))}
      </select>
    </Field>
  )
}
