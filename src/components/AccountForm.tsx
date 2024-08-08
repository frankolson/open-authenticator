import React, { useCallback, useState } from 'react';
import { useAccountsState } from 'src/hooks/useAccounts';
import { OTPDataType } from 'src/types';

export type FormData = OTPDataType & {
  id: string | undefined;
}

interface Props {
  accountId?: string;
  onSubmit: (account: FormData) => void;
}

export default function EditAccount({ accountId, onSubmit }: Props) {
  const { getAccount } = useAccountsState();
  const account = accountId ? getAccount(accountId) : null;
  const [label, setLabel] = useState(account?.label || '');
  const [issuer, setIssuer] = useState(account?.issuer || null);
  const [secret, setSecret] = useState(account?.secret || '');
  const scheme = 'totp';

  function handleSubmit() {
    onSubmit({ id: account?.id, scheme, issuer, label, secret });
  }

  const isValid = useCallback(() => {
    return !!label && !!secret;
  }, [label, secret]);

  return (
    <form onSubmit={handleSubmit} className='account-form'>
      <div className='account-form-fields'>
        <label>Label</label>
        <input
          type='text'
          value={label}
          onChange={(event) => setLabel(event.target.value)}
        />
      
        {/* Only allow editing issuer and secret for new accounts */}
        {!account && (
          <>
            <label>Issuer</label>
            <input
              type='text'
              value={issuer || ''}
              onChange={(event) => setIssuer(event.target.value || null)}
            />

            <label>Secret key</label>
            <input
              type='text'
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
            />
          </>
        )}
      </div>

      <button type='submit' disabled={!isValid()}>
        {account ? 'Save' : 'Add'}
      </button>
    </form>
  );
}