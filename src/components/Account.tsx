import React, { useEffect } from 'react';
import { TOTP } from 'totp-generator';
import { AccountType } from 'src/types';
import Code from './Code';
import ExpirationTimer from './ExpirationTimer';

interface Props {
  account: AccountType;
}

export default function Account({ account }: Props) {
  const RECHECK_INTERVAL = 1000;
  const SECOND_INTERVAL = 30;
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

  return (
    <div className="account">
      <div className="account-info">
        <div className="account-issuer">{issuer}</div>
        <div className="account-label">{label}</div>
      </div>
      <div className="account-totp">
        <Code code={code} />
        <ExpirationTimer percent={percent} />
      </div>
    </div>
  );
}