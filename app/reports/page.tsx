import styles from './page.module.css'
import { ReportRowOptions } from './ReportRowOptions'

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
            <td>
              <ReportRowOptions />
            </td>
          </tr>
          <tr>
            <td>Yurko Arthur</td>
            <td>Coursework</td>
            <td>Design</td>
            <td>Made simple design in penpot</td>
            <td>27.11.2022</td>
            <td>4h</td>
            <td>
              <ReportRowOptions />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
