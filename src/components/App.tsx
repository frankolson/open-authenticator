import React, { useEffect } from 'react';
import application from 'socket:application';
import { TOTP } from "totp-generator";
import { AccountsStateProvider, useAccountsState } from 'src/hooks/useAccounts';
import { ClipboardProvider, useClipboard } from 'src/hooks/useClipboard';

const SECOND_INTERVAL = 30;

function Code({ secret }: { secret: string }) {
  const [percent, setPercent] = React.useState(0);
  const [code, setCode] = React.useState('');
  const { copy } = useClipboard();
  const formattedCode = code.replace(/(.{3})/g, '$1 ').trim();

  useEffect(() => {
    const interval = setInterval(() => {
      const { otp, expires } = TOTP.generate(secret);
      const remaining = Math.floor((expires - Date.now()) / 1000);
      setCode(otp);
      setPercent((remaining / SECOND_INTERVAL) * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  function handleCopy() {
    copy(code);
  }

  return (
    <div
      className="account-totp"
      onClick={handleCopy}
    >
      {code && (
        <>
          <div>{formattedCode}</div>
          <RemainingTimeCircle percent={percent} />
        </>
      )}
    </div>
  );
}

function RemainingTimeCircle({ percent }: { percent: number }) {
  const SIZE = 50;

  function Circle({ color, percentage }: { color: string, percentage?: number }) {
    const radius = SIZE/4;
    const circumference = 2 * Math.PI * radius;
    const strokePercent = ((100 - (percentage || 100)) / 100) * circumference;

    return (
      <circle
        r={radius}
        cx={SIZE/2}
        cy={SIZE/2}
        fill="transparent"
        // remove colour as 0% sets full circumference
        stroke={strokePercent !== circumference ? color : ""} 
        strokeWidth={"0.25rem"}
        strokeDasharray={circumference}
        strokeDashoffset={percentage ? strokePercent : 0}
      />
    )
  }
  
  return (
    <svg width={SIZE} height={SIZE}>
      <g transform={`rotate(-90 ${SIZE/2} ${SIZE/2})`}>
        <Circle color="lightgrey" />
        <Circle
          color={percent > 25 ? "green" : "red"}
          percentage={percent}
        />
      </g>
    </svg>
  );
}

function ListAccounts() {
  const { accounts } = useAccountsState();

  return (
    <div className="accounts">
      {accounts.map((account) => (
        <div key={account.id} className="account">
          <div className="account-info">
            <div className="account-issuer">{account.issuer}</div>
            <div className="account-label">{account.label}</div>
          </div>
          <Code secret={account.secret}/>
        </div>
      ))}
    </div>
  );
}

function AddAccount({ setShowAddAccount }: { setShowAddAccount: (show: boolean) => void }) {
  const [issuer, setIssuer] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [secret, setSecret] = React.useState('');
  const { createAccount } = useAccountsState();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    createAccount({ issuer, label, secret });
    setIssuer('');
    setLabel('');
    setSecret('');
    setShowAddAccount(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="account-form"
    >
      <input
        type="text"
        placeholder="Issuer"
        value={issuer}
        onChange={(event) => setIssuer(event.target.value)}
      />
      <input
        type="text"
        placeholder="Label"
        value={label}
        onChange={(event) => setLabel(event.target.value)}
      />
      <input
        type="text"
        placeholder="Secret"
        value={secret}
        onChange={(event) => setSecret(event.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
}

export default function App() {
  const [showAddAccount, setShowAddAccount] = React.useState(false);

  React.useEffect(() => {
    async function initalizeMenu() {
      const menu = `
        Edit:
          Undo: z + CommandOrControl
          Redo: Z + CommandOrControl + Shift
          ---
          Cut: x + CommandOrControl
          Copy: c + CommandOrControl
          Paste: v + CommandOrControl
          ---
          Select All: a + CommandOrControl
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
          <button onClick={() => setShowAddAccount(!showAddAccount)}>
            {showAddAccount ? 'Hide' : 'Add Account'}
          </button>
          
          {showAddAccount && <AddAccount setShowAddAccount={setShowAddAccount} />}
          <ListAccounts />
        </div>
      </ClipboardProvider>
    </AccountsStateProvider>
  );
};
