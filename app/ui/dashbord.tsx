'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Table, Form } from 'react-bootstrap';
import { User } from '../lib/definitions';
import moment from 'moment-timezone';
import { DeleteButton } from './buttons';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const Dashbord = ({ users }: { users: User[] }) => {
  const [checked, setCecked] = useState<string[]>([]);

  const selectAllRef = useRef<HTMLInputElement>(null);

  const allSelected = users.length === checked.length;
  const someSelected = checked.length > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = !allSelected && someSelected;
    }
  }, [allSelected, someSelected]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setCecked(users.map((user) => user.id));
    } else {
      setCecked([]);
    }
  };

  const toggleSelect = (checked: boolean, id: string) => {
    if (checked) {
      setCecked((prevData) => [...prevData, id]);
    } else {
      setCecked((prevData) => prevData.filter((itemId) => itemId !== id));
    }
  };

  return (
    <Container>
      <DeleteButton ids={checked} />

      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>
                  <Form.Check
                    type="checkbox"
                    ref={selectAllRef}
                    checked={allSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ width: '50px', textAlign: 'center' }}>
                    <Form.Check
                      type="checkbox"
                      checked={checked.includes(user.id)}
                      onChange={(e) => toggleSelect(e.target.checked, user.id)}
                    />
                  </td>
                  <td>
                    <p>
                      {user.first_name} {user.last_name}
                    </p>
                    <p style={{ color: 'gray' }}>{user.organisation}</p>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {moment
                      .tz(new Date(user.last_seen), 'Asia/Tbilisi')
                      .fromNow()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Navbar>
    </Container>
  );
};

export default Dashbord;
