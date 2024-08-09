import { Plus } from '@phosphor-icons/react';
import React from 'react';
import AccountList from 'src/components/AccountList';
import { useRouter } from 'src/hooks/useRouter';

export default function Home() {
  const { navigate } = useRouter();
  
  return (
    <div className='view'>
      <div className='view-header'>
        <div></div>
        
        <button onClick={() => navigate("/accounts/new")}>
          <Plus /> Add Account
        </button>
      </div>
      <div className='view-content'>
        <AccountList />
      </div>
    </div>
  );
}