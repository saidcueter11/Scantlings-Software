import React from 'react'

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-screen flex justify-center items-center flex-col gap-4">
      {children}
    </main>
  )
}
