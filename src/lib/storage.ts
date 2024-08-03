import crypto from 'socket:crypto'
import { AccountType } from "src/types"

export function getAccounts() {
  const rawValue = localStorage.getItem('accounts')
  if (!rawValue) return []
  return JSON.parse(rawValue) as AccountType[]
}

export function addAccount(account: Omit<AccountType, 'id'>) {
  const accounts = getAccounts()
  const id = crypto.webcrypto.randomUUID()
  const newAccount = { id, ...account }
  localStorage.setItem('accounts', JSON.stringify([
    ...accounts, newAccount
  ]))
}

export function removeAccount(id: string) {
  const accounts = getAccounts()
  const newAccounts = accounts.filter(account => account.id !== id)
  localStorage.setItem('accounts', JSON.stringify(newAccounts))
}