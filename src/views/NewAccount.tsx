import React, { useState, FormEvent, useCallback } from 'react';
import { useAccountsState } from 'src/hooks/useAccounts';
import QRScanner from '../components/QRScanner';
import { OTPDataType } from 'src/types';

interface Props {
  setShowAddAccount: (show: boolean) => void;
}

interface FormProps {
  onSubmit: (data: OTPDataType) => void;
}

function Form({ onSubmit }: FormProps) {
  const [issuer, setIssuer] = useState('');
  const [label, setLabel] = useState('');
  const [secret, setSecret] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ scheme: 'totp', issuer, label, secret });
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
  const { createAccount } = useAccountsState();
  const debounceTime = 1000;
  const [showScanner, setShowScanner] = useState(true);
  const isSubmittingRef = React.useRef(false);
  const lastSubmissionTimeRef = React.useRef(0);

  const handleSubmit = useCallback((otpData: OTPDataType) => {
    const now = Date.now();
    if (shouldDebounceSubmission(now)) return;

    isSubmittingRef.current = true;
    lastSubmissionTimeRef.current = now;

    createAccount(otpData);
    setShowAddAccount(false);

    setTimeout(() => {
      isSubmittingRef.current = false;
    }, debounceTime);
  }, [createAccount, setShowAddAccount]);

  function shouldDebounceSubmission(now: number) {
    const timeSinceLastSubmission = now - lastSubmissionTimeRef.current;

    return isSubmittingRef.current || (timeSinceLastSubmission < debounceTime);
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
        ? <QRScanner onDetected={handleSubmit} />
        : <Form onSubmit={handleSubmit} />
      }
    </div>
  );
}