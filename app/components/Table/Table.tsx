import { FC, ReactNode, Suspense } from 'react'
import { PageLoader } from '../PageLoader'
import styles from './Table.module.css'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  header?: ReactNode | Array<string | number>
  suspense?: boolean
}

export const Table: FC<TableProps> = ({ header, suspense, children }) => {
  return (
    <table className={styles.table}>
      {header && (
        <thead>
          <tr>
            {Array.isArray(header) ? header.map(value => <th key={value}>{value}</th>) : header}
          </tr>
        </thead>
      )}
      <tbody>
        {suspense ? (
          <Suspense
            fallback={
              <tr>
                <td className={styles.loader}>
                  <PageLoader />
                </td>
              </tr>
            }
          >
            {children}
          </Suspense>
        ) : (
          children
        )}
      </tbody>
    </table>
  )
}
