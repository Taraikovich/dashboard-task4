'use server';

import { db, sql } from '@vercel/postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { signOut } from '@/auth';

export async function signOute() {
  await signOut({ redirectTo: '/' });
}

export type State = {
  errors?: {
    first_name?: string[];
    last_name?: string[];
    organization?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  first_name: z
    .string({
      invalid_type_error: 'Please provide a valid first name.',
      required_error: 'first name is required.',
    })
    .min(2, 'First name must be at least 2 characters long.'),
  last_name: z
    .string({
      invalid_type_error: 'Please provide a valid last name.',
      required_error: 'Last name is required.',
    })
    .min(2, 'First name must be at least 2 characters long.'),
  organization: z.string({}),
  email: z
    .string({
      invalid_type_error: 'Please provide a valid email address.',
      required_error: 'Email is required.',
    })
    .email('Invalid email address format.'),
  password: z
    .string({
      invalid_type_error: 'Password must be a string.',
      required_error: 'Password is required.',
    })
    .min(8, 'Password must be at least 8 characters long.')
    .max(32, 'Password must be no longer than 32 characters.'),
  confirmPassword: z.string({
    required_error: 'Please confirm your password.',
  }),
});

const CreateUser = FormSchema.omit({}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  }
);

export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    organization: formData.get('organization'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }

  const { first_name, last_name, organization, email, password } =
    validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`INSERT INTO users (first_name, last_name, organisation, email, password)
              VALUES (${first_name}, ${last_name}, ${organization}, ${email}, ${hashedPassword})`;
  } catch (error: unknown) {
    if ((error as { code?: string }).code === '23505') {
      return { message: 'Email already exists!' };
    }

    return { message: 'Database Error: Failed to create user.' };
  }
  redirect('/login');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function checkStatus() {
  const session = await auth();
  const userEmail = session?.user?.email;

  try {
    const status = await sql`
            SELECT status
            FROM users
            WHERE email=${userEmail};
        `;

    if (status.rows[0].status === 'block') {
      await signOut({ redirectTo: '/login' }); // redirect to login page after sign out
      throw new Error('User is blocked, logged out.');
    }

    return status.rows[0].status;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to get status. Error: ${error}`);
  }
}

export async function setStatus(
  userId: string,
  status: 'active' | 'blocked' | 'deleted'
) {
  const client = await db.connect();

  try {
    await client.sql`
            UPDATE users
            SET status=${status}
            WHERE id=${userId};
        `;

    revalidatePath('/');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete user.');
  } finally {
    client.release();
  }
}
