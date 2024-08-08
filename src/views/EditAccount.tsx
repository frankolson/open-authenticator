import React from 'react';
import AccountForm, { FormData } from 'src/components/AccountForm';
import { useAccountsState } from 'src/hooks/useAccounts';
import { AccountType } from 'src/types';

interface Props {
  accountId: string;
  handleClose: () => void;
}

export default function EditAccount({ accountId, handleClose }: Props) {
  const { updateAccount, deleteAccount } = useAccountsState();

  function handleSubmit(account: FormData) {
    updateAccount(account as AccountType);
    handleClose();
  }

  function handleDelete() {
    deleteAccount(accountId);
    handleClose();
  }

  return (
    <div className='view'>
      <div className='view-header'></div>
      <div className='view-content'>
        <AccountForm
          accountId={accountId}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}