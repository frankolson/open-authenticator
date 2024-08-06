import React from "react";
import { AccountsStateProvider } from 'src/hooks/useAccounts';
import { ClipboardProvider } from 'src/hooks/useClipboard';

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <AccountsStateProvider>
      <ClipboardProvider>
        {children}
      </ClipboardProvider>
    </AccountsStateProvider>
  );
}