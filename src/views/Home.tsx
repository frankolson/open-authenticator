import React from 'react';
import AccountList from 'src/components/AccountList';

interface Props {
  openNewAccountView: () => void;
}

export default function Home({ openNewAccountView }: Props) {
  return (
    <>
      <button onClick={() => openNewAccountView()}>
        &#43; Add Account
      </button>
      <AccountList />
    </>
  );
}