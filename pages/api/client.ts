import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/services/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await db
      .insertInto('clients')
      .values({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        createdAt: req.body.createdAt,
      })
      .execute()
  } else if (req.method === 'PUT') {
    await db
      .updateTable('clients')
      .set({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        createdAt: req.body.createdAt,
      })
      .where('id', '=', req.body.id)
      .execute()
  } else if (req.method === 'DELETE') {
    if (typeof req.query.id !== 'string')
      return res.status(400).send('Parameter "id" should be of type "string"')
    await db.deleteFrom('clients').where('id', '=', req.query.id).execute()
  } else {
    return res.status(400).send('Invalid Request')
  }

  res.status(200).send(undefined)
}
