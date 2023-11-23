import React from 'react'

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-screen flex justify-center items-center flex-col gap-4 relative">
      <nav className='w-full fixed top-0'>
        <img className='h-16 ml-8 mt-3' src="/src/assets/LOGOTIPO ECOTEA-06.png" alt="" />
      </nav>
      <h1 className='mb-2 text-3xl font-bold'>Scantlings Software</h1>
      <div className='min-h-[537px] max-h-full max-w-6xl flex flex-col items-center justify-center'>
        {children}
      </div>
    </main>
  )
}
