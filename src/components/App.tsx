import React from 'react';
import application from 'socket:application';
import { AccountsStateProvider } from 'src/hooks/useAccounts';
import { ClipboardProvider } from 'src/hooks/useClipboard';
import AddAccount from '../views/NewAccount';
import Home from 'src/views/Home';

export default function App() {
  const [showAddAccount, setShowAddAccount] = React.useState(false);

  React.useEffect(() => {
    async function initalizeMenu() {
      const menu = `
        Open Authenticator:
          About Open Authenticator: _
          ---
          Quit: q + CommandOrControl
        ;

        Edit:
          Undo: z + CommandOrControl
          Redo: z + CommandOrControl + Shift
          ---
          Cut: x + CommandOrControl
          Copy: c + CommandOrControl
          Paste: v + CommandOrControl
          ---
          Select All: a + CommandOrControl
        ;

        Developer:
          Reload: r + CommandOrControl
          Toggle Developer Tools: i + CommandOrControl + OptionOrAlt
        ;
      `
      await application.setSystemMenu({ index: 0, value: menu });
    }

    initalizeMenu();
  }, []);

  return (
    <AccountsStateProvider>
      <ClipboardProvider>
        <div className="app">
          {showAddAccount ? (
            <AddAccount setShowAddAccount={setShowAddAccount} />
          ) : (
            <Home openNewAccountView={() => setShowAddAccount(true)} />
          )}
        </div>
      </ClipboardProvider>
    </AccountsStateProvider>
  );
};
