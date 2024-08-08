export type OTPDataType = {
  scheme: 'totp' | 'hotp'
  issuer: string | null
  label: string
  secret: string
}

export type AccountType = OTPDataType & {
  id: string
}