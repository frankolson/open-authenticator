import React, { createContext, useContext, useState } from 'react'
import { getAccounts, getAccount, addAccount, setAccount, removeAccount } from 'src/lib/storage'
import { AccountType } from 'src/types'

interface AccountsState {
  accounts: AccountType[]
  getAccount: (id: string) => AccountType
  createAccount: (values: Omit<AccountType, 'id'>) => AccountType
  updateAccount: (account: AccountType) => AccountType
  deleteAccount: (id: string) => void
}

interface AccountsProviderProps {
  children: React.ReactNode
}

const AccountsStateContext = createContext<AccountsState | undefined>(undefined)

export function AccountsStateProvider({ children }: AccountsProviderProps) {
  const [accounts, setAccounts] = useState<AccountType[]>(getAccounts())

  function createAccount(values: Omit<AccountType, 'id'>) {
    const newAccount = addAccount(values)
    setAccounts(getAccounts())
    
    return newAccount
  }

  function updateAccount(account: AccountType) {
    const updatedAccount = setAccount(account)
    setAccounts(getAccounts())

    return updatedAccount
  }

  function deleteAccount(id: string) {
    removeAccount(id)
    setAccounts(getAccounts())
  }

  return (
    <AccountsStateContext.Provider
      value={{
        accounts,
        getAccount,
        createAccount,
        updateAccount,
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