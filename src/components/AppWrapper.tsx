import React from 'react'

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-screen flex justify-center items-center flex-col gap-4 relative">
      <h1 className='mb-8 text-3xl font-bold'>Scantlings Software</h1>
      <div className='min-h-[537px] flex flex-col items-center justify-center'>
        {children}
      </div>
    </main>
  )
}
