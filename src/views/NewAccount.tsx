import React, { useState, useCallback } from 'react';
import { useAccountsState } from 'src/hooks/useAccounts';
import QRScanner from '../components/QRScanner';
import AccountForm, { FormData } from '../components/AccountForm';
import { OTPDataType } from 'src/types';

interface Props {
  setShowAddAccount: (show: boolean) => void;
}

export default function AddAccount({ setShowAddAccount }: Props) {
  const { createAccount, updateAccount } = useAccountsState();
  const debounceTime = 1000;
  const [showScanner, setShowScanner] = useState(true);
  const isSubmittingRef = React.useRef(false);
  const lastSubmissionTimeRef = React.useRef(0);

  const handleQRSubmit = useCallback((otpData: OTPDataType) => {
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

  function handleManualSubmit(data: FormData) {
    createAccount(data);
  }

  return (
    <div className="view">
      <div className="view-header">
        <button onClick={() => setShowScanner(!showScanner)}>
          {showScanner ? 'Manual Input' : 'QR Scanner'}
        </button>

        <button onClick={() => setShowAddAccount(false)}>
          X
        </button>
      </div>

      <div className="view-content">
        {showScanner
          ? <QRScanner onDetected={handleQRSubmit} />
          : <AccountForm onSubmit={handleManualSubmit} />
        }
      </div>
    </div>
  );
}