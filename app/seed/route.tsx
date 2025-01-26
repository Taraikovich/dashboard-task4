import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';

const client = await db.connect();

const users = [
  {
    firstName: 'Igor',
    lastName: 'Silva',
    organisation: 'NextMail',
    email: 'user@nextmail.com',
    password: '123456',
    lastSeen: new Date().toISOString(),
    status: 'active',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    organisation: 'TechCorp',
    email: 'john.doe@techcorp.com',
    password: 'password123',
    lastSeen: new Date().toISOString(),
    status: 'active',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    organisation: 'CreativeWorks',
    email: 'jane.smith@creativeworks.com',
    password: 'qwerty123',
    lastSeen: new Date().toISOString(),
    status: 'active',
  },
  {
    firstName: 'Michael',
    lastName: 'Johnson',
    organisation: 'FutureTech',
    email: 'michael.johnson@futuretech.com',
    password: '123456789',
    lastSeen: new Date().toISOString(),
    status: 'active',
  },
  {
    firstName: 'Sarah',
    lastName: 'Williams',
    organisation: 'Innovators',
    email: 'sarah.williams@innovators.com',
    password: 'mypassword',
    lastSeen: new Date().toISOString(),
    status: 'active',
  },
  {
    firstName: 'David',
    lastName: 'Brown',
    organisation: 'NextGen',
    email: 'david.brown@nextgen.com',
    password: 'brown123',
    lastSeen: new Date().toISOString(),
    status: 'active',
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    organisation: 'Tech Solutions',
    email: 'emily.davis@techsolutions.com',
    password: 'tech123',
    lastSeen: new Date().toISOString(),
    status: 'active',
  },
  {
    firstName: 'Daniel',
    lastName: 'Miller',
    organisation: 'Miller Enterprises',
    email: 'daniel.miller@millerent.com',
    password: 'miller123',
    lastSeen: new Date().toISOString(),
    status: 'active',
  },
  {
    firstName: 'Olivia',
    lastName: 'Martinez',
    organisation: 'Martinez Ltd.',
    email: 'olivia.martinez@martinezltd.com',
    password: 'martinez123',
    lastSeen: new Date().toISOString(),
    status: 'active',
  },
  {
    firstName: 'Lucas',
    lastName: 'Garcia',
    organisation: 'Garcia Innovations',
    email: 'lucas.garcia@garciainnovations.com',
    password: 'lucas123',
    lastSeen: new Date().toISOString(),
    status: 'active',
  },
];

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        organisation VARCHAR(255),
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(255) DEFAULT 'active'
      );
  `;

  await client.sql`
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (first_name, last_name, organisation, email, password )
        VALUES (${user.firstName}, ${user.lastName}, ${user.organisation}, ${user.email}, ${hashedPassword})
        ON CONFLICT (email) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
