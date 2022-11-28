'use client'
import { FC } from 'react'
import { clsx } from 'clsx'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const Button: FC<ButtonProps> = ({ variant = 'primary', className, ...props }) => {
  return <button className={clsx(styles.button, styles[variant], className)} {...props} />
}
