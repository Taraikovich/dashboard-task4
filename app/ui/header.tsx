'use client';

import Link from 'next/link';
import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';

export default function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/">Dashboard-task4</Navbar.Brand>

        <Link href="/login">
          <Button variant="primary">Log in</Button>
        </Link>
        <Link href="/signup">
          <Button variant="primary">Sign up</Button>
        </Link>
      </Container>
    </Navbar>
  );
}
