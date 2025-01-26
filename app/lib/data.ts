import { db } from '@vercel/postgres';

import { User } from './definitions';

export async function fetchUsers(limit = 5, offset = 0) {
  const client = await db.connect();

  try {
    const { rows: users } = await client.sql<User>`
        SELECT *
        FROM users
        WHERE status = 'active' OR status = 'blocked'
        ORDER BY id
        LIMIT ${limit} OFFSET ${offset};`;

    const { rows: countRows } = await client.sql`
        SELECT COUNT(*) FROM users;
        `;

    return { users, count: parseInt(countRows[0].count) };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users data.');
  } finally {
    client.release();
  }
}
