import { FC } from 'react'
import { clsx } from 'clsx'
import styles from './ClipLoader.module.css'

export interface ClipLoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  loading?: boolean
  size?: number | string
  dark?: boolean
}

const sizeToCssValue = (size: string | number) => (typeof size === 'number' ? `${size}px` : size)

export const ClipLoader: FC<ClipLoaderProps> = ({
  loading = true,
  size,
  className,
  dark,
  ...props
}) => {
  return loading ? (
    <span
      style={size ? { width: sizeToCssValue(size), height: sizeToCssValue(size) } : undefined}
      className={clsx(styles.clipLoader, dark && styles.dark, className)}
      {...props}
    />
  ) : null
}
