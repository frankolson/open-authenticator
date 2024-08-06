import React, { useState, FormEvent } from 'react';
import { useAccountsState } from 'src/hooks/useAccounts';
import QRScanner from '../components/QRScanner';

interface Props {
  setShowAddAccount: (show: boolean) => void;
}

interface FormProps {
  onSubmit: (data: { issuer: string, label: string, secret: string }) => void;
}

function Form({ onSubmit }: FormProps) {
  const [issuer, setIssuer] = useState('');
  const [label, setLabel] = useState('');
  const [secret, setSecret] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ issuer, label, secret });
    setIssuer('');
    setLabel('');
    setSecret('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="account-new-form"
    >
      <input
        type="text"
        placeholder="Issuer"
        value={issuer}
        onChange={(event) => setIssuer(event.target.value)}
      />
      <input
        type="text"
        placeholder="Label"
        value={label}
        onChange={(event) => setLabel(event.target.value)}
      />
      <input
        type="text"
        placeholder="Secret"
        value={secret}
        onChange={(event) => setSecret(event.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
}

export default function AddAccount({ setShowAddAccount }: Props) {
  const [showScanner, setShowScanner] = useState(true);
  const { createAccount } = useAccountsState();

  function handleSubmit({ issuer, label, secret }: { issuer: string, label: string, secret: string }) {
    createAccount({ issuer, label, secret });
    setShowAddAccount(false);
  }

  return (
    <div className="account-new">
      <div className="account-new-header">
        <button onClick={() => setShowScanner(!showScanner)}>
          {showScanner ? 'Manual Input' : 'QR Scanner'}
        </button>

        <button onClick={() => setShowAddAccount(false)}>
          X
        </button>
      </div>

      {showScanner
        ? <QRScanner onSubmit={handleSubmit} />
        : <Form onSubmit={handleSubmit} />
      }
    </div>
  );
}