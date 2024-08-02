import React, { createContext, useContext, useState } from 'react'

interface ClipboardState {
  copy: (text: string) => void
}

interface ClipboardProviderProps {
  children: React.ReactNode
}

const ClipboardContext = createContext<ClipboardState | undefined>(undefined)

export function ClipboardProvider({ children }: ClipboardProviderProps) {
  const ALERT_DURATION = 3000 // 3 seconds
  const [showCopiedAlert, setShowCopiedAlert] = useState(false)

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    setShowCopiedAlert(true)
    setInterval(() => setShowCopiedAlert(false), ALERT_DURATION)
  }

  return (
    <ClipboardContext.Provider
      value={{
        copy
      }}
    >
      {children}
      {/* The copied alert is not pushing to the bottom of the screen... */}
      {showCopiedAlert && <div className='copied-alert'>Copied!</div>}
    </ClipboardContext.Provider>
  )
}

export function useClipboard() {
  const context = useContext(ClipboardContext)
  if (context === undefined) {
    throw new Error('useClipboard must be used within a ClipboardProvider')
  }
  
  return context
}