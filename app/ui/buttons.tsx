'use client';

import { Button, ButtonGroup } from 'react-bootstrap';
import { checkStatus, setStatus } from '../lib/actions';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export function DeleteButton({ ids }: { ids: string[] }) {
  const changeStatus = async (status: 'active' | 'blocked' | 'deleted') => {
    const userStatus = await checkStatus();

    if (userStatus !== 'active') {
      alert('You are blocked');
      return;
    }

    ids.forEach((id) => {
      setStatus(id, status);
    });
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <ButtonGroup>
          <Button variant="danger" onClick={changeStatus.bind(null, 'deleted')}>
            <i className="bi bi-trash3-fill"></i> Delete
          </Button>

          <Button
            variant="warning"
            onClick={changeStatus.bind(null, 'blocked')}
          >
            <i className="bi bi bi-lock-fill"></i> Block
          </Button>

          <Button variant="success" onClick={changeStatus.bind(null, 'active')}>
            <i className="bi bi-unlock-fill"></i> Unblock
          </Button>
        </ButtonGroup>
      </Container>
    </Navbar>
  );
}
