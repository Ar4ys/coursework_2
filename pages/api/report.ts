import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/services/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await db
      .insertInto('reports')
      .values({
        date: req.body.date,
        duration: req.body.duration,
        employeeId: req.body.employeeId,
        type: req.body.type,
        note: req.body.note,
        projectId: req.body.projectId,
      })
      .execute()
  } else if (req.method === 'PUT') {
    await db
      .updateTable('reports')
      .set({
        date: req.body.date,
        duration: req.body.duration,
        employeeId: req.body.employeeId,
        type: req.body.type,
        note: req.body.note,
        projectId: req.body.projectId,
      })
      .where('id', '=', req.body.id)
      .execute()
  } else if (req.method === 'DELETE') {
    if (typeof req.query.id !== 'string')
      return res.status(400).send('Parameter "id" should be of type "string"')
    await db.deleteFrom('reports').where('id', '=', req.query.id).execute()
  } else {
    return res.status(400).send('Invalid Request')
  }

  res.status(200).send(undefined)
}
