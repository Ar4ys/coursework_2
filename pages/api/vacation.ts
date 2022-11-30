import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/services/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await db
      .insertInto('vacations')
      .values({
        employeeId: req.body.employeeId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        type: req.body.type,
        status: req.body.status,
        managerId: req.body.managerId,
        note: req.body.note,
      })
      .execute()
  } else if (req.method === 'PUT') {
    await db
      .updateTable('vacations')
      .set({
        employeeId: req.body.employeeId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        type: req.body.type,
        status: req.body.status,
        managerId: req.body.managerId,
        note: req.body.note,
      })
      .where('id', '=', req.body.id)
      .execute()
  } else if (req.method === 'DELETE') {
    if (typeof req.query.id !== 'string')
      return res.status(400).send('Parameter "id" should be of type "string"')
    await db.deleteFrom('vacations').where('id', '=', req.query.id).execute()
  } else {
    return res.status(400).send('Invalid Request')
  }

  res.status(200).send(undefined)
}
