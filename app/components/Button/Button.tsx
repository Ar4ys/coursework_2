'use client'
import { FC } from 'react'
import { clsx } from 'clsx'
import { ClipLoader } from '../ClipLoader'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'clear'
  loading?: boolean | null
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  type = 'button',
  loading,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(styles.button, styles[variant], loading && styles.loading, className)}
      type={type}
      disabled={Boolean(loading)}
      {...props}
    >
      {children}
      <ClipLoader className={styles.loader} loading={Boolean(loading)} />
    </button>
  )
}
