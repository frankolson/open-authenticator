import React, { useState, useCallback } from 'react';
import { useAccountsState } from 'src/hooks/useAccounts';
import QRScanner from '../components/QRScanner';
import AccountForm, { FormData } from '../components/AccountForm';
import { OTPDataType } from 'src/types';
import { useRouter } from 'src/hooks/useRouter';
import { CaretLeft } from '@phosphor-icons/react';

export default function AddAccount() {
  const { createAccount } = useAccountsState();
  const { goBack } = useRouter();
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
    goBack();

    setTimeout(() => {
      isSubmittingRef.current = false;
    }, debounceTime);
  }, [createAccount, goBack]);

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
        <div>
          <button onClick={() => goBack()}>
            <CaretLeft /> Back
          </button>
        </div>

        <button onClick={() => setShowScanner(!showScanner)}>
          {showScanner ? 'Manual Input' : 'QR Scanner'}
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