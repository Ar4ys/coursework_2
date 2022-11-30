import { FC } from 'react'
import { clsx } from 'clsx'
import styles from './PageLoader.module.css'
import { ClipLoader, ClipLoaderProps } from '../ClipLoader'
import { Text } from '../Text'

interface PageLoader extends ClipLoaderProps {}

export const PageLoader: FC<PageLoader> = ({ className, ...props }) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <ClipLoader dark {...props} />
      <Text variant="h3">Loading...</Text>
    </div>
  )
}
