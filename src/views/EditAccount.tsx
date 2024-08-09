import React from 'react';
import AccountForm, { FormData } from 'src/components/AccountForm';
import { useAccountsState } from 'src/hooks/useAccounts';
import { useLocation } from 'src/hooks/useLocation';
import { useRouter } from 'src/hooks/useRouter';
import { AccountType } from 'src/types';

export default function EditAccount() {
  const { navigate } = useRouter();
  const { params: { accountId } } = useLocation();
  const { updateAccount, deleteAccount } = useAccountsState();

  function handleSubmit(account: FormData) {
    updateAccount(account as AccountType);
    navigate('/');
  }

  function handleDelete() {
    deleteAccount(accountId);
    navigate('/');
  }

  return (
    <div className='view'>
      <div className='view-header'>
        <div>
          <button onClick={() => navigate('/')}>
            &#x2190; Back
          </button>
        </div>
        
        <button onClick={handleDelete}>
          Delete
        </button>
      </div>
      
      <div className='view-content'>
        <AccountForm
          accountId={accountId}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}