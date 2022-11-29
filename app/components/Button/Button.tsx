'use client'
import { FC } from 'react'
import { clsx } from 'clsx'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'clear'
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  type = 'button',
  className,
  ...props
}) => {
  return (
    <button className={clsx(styles.button, styles[variant], className)} type={type} {...props} />
  )
}
