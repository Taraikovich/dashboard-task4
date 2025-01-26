'use client';

import { createUser, State } from '@/app/lib/actions';
import React, { useActionState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';

const RegistrationForm = () => {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createUser, initialState);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Registration</Card.Title>
        <Form action={formAction}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="first_name">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  placeholder="Enter first name"
                />
                {state.errors?.first_name?.map((error, idx) => (
                  <Alert key={idx} variant="danger" className="mt-1">
                    {error}
                  </Alert>
                ))}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="last_name">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  placeholder="Enter last name"
                />
                {state.errors?.last_name?.map((error, idx) => (
                  <Alert key={idx} variant="danger" className="mt-1">
                    {error}
                  </Alert>
                ))}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="organization">
            <Form.Label>Organization</Form.Label>
            <Form.Control
              type="text"
              name="organization"
              placeholder="Enter organization"
            />
            {state.errors?.organization?.map((error, idx) => (
              <Alert key={idx} variant="danger" className="mt-1">
                {error}
              </Alert>
            ))}
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter email" />
            {state.errors?.email?.map((error, idx) => (
              <Alert key={idx} variant="danger" className="mt-1">
                {error}
              </Alert>
            ))}
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                />
                {state.errors?.password?.map((error, idx) => (
                  <Alert key={idx} variant="danger" className="mt-1">
                    {error}
                  </Alert>
                ))}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                />
                {state.errors?.confirmPassword?.map((error, idx) => (
                  <Alert key={idx} variant="danger" className="mt-1">
                    {error}
                  </Alert>
                ))}
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Register
          </Button>
          <Alert variant="danger" className="mt-1">
            {state.message}
          </Alert>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegistrationForm;
