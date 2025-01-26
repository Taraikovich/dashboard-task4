'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { Form, Button, Alert } from 'react-bootstrap';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <Form
      action={formAction}
      className="mt-5"
      style={{ maxWidth: '400px', margin: 'auto' }}
    >
      <h1 className="mb-4 text-center">Please log in to continue</h1>
      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
        />
      </Form.Group>

      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Enter password"
          required
          minLength={6}
        />
      </Form.Group>

      <input type="hidden" name="redirectTo" value={callbackUrl} />

      <Button
        type="submit"
        variant="primary"
        className="w-100"
        aria-disabled={isPending}
      >
        Log in
      </Button>

      <div className="mt-3" aria-live="polite" aria-atomic="true">
        {errorMessage && (
          <Alert variant="danger">
            <p className="mb-0">{errorMessage}</p>
          </Alert>
        )}
      </div>
    </Form>
  );
}
