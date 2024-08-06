import React from 'react';
import { useAccountsState } from 'src/hooks/useAccounts';
import Account from './Account';

export default function AccountList() {
  const { accounts } = useAccountsState();

  return (
    <div className="accounts">
      {accounts.map((account) => (
        <Account key={account.id} account={account} />
      ))}
    </div>
  );
}