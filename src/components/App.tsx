import React from 'react';
import AddAccount from '../views/NewAccount';
import Home from 'src/views/Home';
import Providers from './Providers';

export default function App() {
  const [showAddAccount, setShowAddAccount] = React.useState(false);

  return (
    <Providers>
      <div className="app">
        {showAddAccount ? (
          <AddAccount setShowAddAccount={setShowAddAccount} />
        ) : (
          <Home openNewAccountView={() => setShowAddAccount(true)} />
        )}
      </div>
    </Providers>
  );
};
