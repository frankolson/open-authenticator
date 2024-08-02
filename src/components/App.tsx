import React, { useEffect } from 'react';
import application from 'socket:application';
import { TOTP } from "totp-generator";
import { AccountsStateProvider, useAccountsState } from 'src/hooks/useAccounts';
import { ClipboardProvider, useClipboard } from 'src/hooks/useClipboard';
import AddAccount from './AddAccount';

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
          <button onClick={() => setShowAddAccount(!showAddAccount)}>
            {showAddAccount ? 'Cancel' : 'Add Account'}
          </button>
          
          {showAddAccount
            ? <AddAccount setShowAddAccount={setShowAddAccount} />
            : <ListAccounts />
          }
        </div>
      </ClipboardProvider>
    </AccountsStateProvider>
  );
};
