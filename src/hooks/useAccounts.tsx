import React, { createContext, useContext, useState } from 'react'
import crypto from 'socket:crypto'
import { AccountType } from '../types'

interface AccountsState {
  accounts: AccountType[]
  createAccount: (values: Omit<AccountType, 'id'>) => void
  deleteAccount: (id: string) => void
}

interface AccountsProviderProps {
  children: React.ReactNode
}

const AccountsStateContext = createContext<AccountsState | undefined>(undefined)

export function AccountsStateProvider({ children }: AccountsProviderProps) {
  const [accounts, setAccounts] = useState<AccountType[]>([])

  function createAccount(values: Omit<AccountType, 'id'>) {
    const id = crypto.webcrypto.randomUUID()
    setAccounts([...accounts, { id, ...values }])
  }

  function deleteAccount(id: string) {
    setAccounts((previousAccounts) =>(
      previousAccounts.filter((account) => account.id !== id)
    ))
  }

  return (
    <AccountsStateContext.Provider
      value={{
        accounts,
        createAccount,
        deleteAccount
      }}
    >
      {children}
    </AccountsStateContext.Provider>
  )
}

export function useAccountsState() {
  const context = useContext(AccountsStateContext)
  if (context === undefined) {
    throw new Error('useAccountsState must be used within a AccountsStateProvider')
  }
  
  return context
}