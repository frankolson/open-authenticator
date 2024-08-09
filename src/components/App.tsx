import React from 'react';
import { RouterProvider as Router } from 'src/hooks/useRouter';
import NewAccount from 'src/views/NewAccount';
import Home from 'src/views/Home';
import EditAccount from 'src/views/EditAccount';
import Providers from './Providers';

export default function App() {
  const routes = [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/accounts/new',
      element: <NewAccount />,
    },
    {
      path: '/accounts/:id',
      element: <EditAccount />
    }
  ]

  return (
    <Providers>
      <div className="app">
        <Router routes={routes} />
      </div>
    </Providers>
  );
};
