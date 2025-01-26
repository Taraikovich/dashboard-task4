'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

const Authbuttons = () => {
  const { data: session, status } = useSession();

  if (!session) {
    return <p>User is not logged in.</p>;
  } else {
    return <p>User is logged in. {session ? session.user?.email : status}</p>;
  }
};

export default Authbuttons;
