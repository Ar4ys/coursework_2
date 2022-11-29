import Image from 'next/image'
import styles from './page.module.css'

export default function Reports() {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Author</th>
            <th>Project</th>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
            <th>Hours</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Yurko Arthur</td>
            <td>Coursework</td>
            <td>Design</td>
            <td>Made simple design in penpot</td>
            <td>27.11.2022</td>
            <td>4h</td>
            <td>Options</td>
          </tr>
          <tr>
            <td>Yurko Arthur</td>
            <td>Coursework</td>
            <td>Design</td>
            <td>Made simple design in penpot</td>
            <td>27.11.2022</td>
            <td>4h</td>
            <td>Options</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
