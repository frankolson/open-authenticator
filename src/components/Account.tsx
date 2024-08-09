import React, { useEffect } from 'react';
import { TOTP } from 'totp-generator';
import { Gear } from '@phosphor-icons/react';
import { AccountType } from 'src/types';
import Code from './Code';
import ExpirationTimer from './ExpirationTimer';
import { useRouter } from 'src/hooks/useRouter';

interface Props {
  account: AccountType;
}

export default function Account({ account }: Props) {
  const RECHECK_INTERVAL = 1000;
  const SECOND_INTERVAL = 30;
  const { navigate } = useRouter();
  const { issuer, label, secret } = account;
  const [code, setCode] = React.useState(extractOTP(secret).otp);
  const [percent, setPercent] = React.useState(extractOTP(secret).remaining);

  useEffect(() => {
    const interval = setInterval(() => {
      const { otp, remaining } = extractOTP(secret);
      setCode(otp);
      setPercent((remaining / SECOND_INTERVAL) * 100);
    }, RECHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [secret]);

  function extractOTP(secret: string) {
    const { otp, expires } = TOTP.generate(secret);
    const remaining = Math.floor((expires - Date.now()) / 1000);
    return { otp, remaining };
  }

  const accountName = issuer ? `${issuer}: ${label}` : label;

  return (
    <div className="account">
      <div className="account-header">
        {accountName}
      </div>

      <div className="account-content">
        <div className="totp">
          <ExpirationTimer percent={percent} />
          <Code code={code} />
        </div>

        <button
          className="button-icon"
          style={{ alignSelf: 'end', paddingBottom: '0', paddingRight: '0' }}
          onClick={() => navigate(`/accounts/${account.id}`)}
        >
          <Gear />
        </button> 
      </div>
    </div>
  );
}