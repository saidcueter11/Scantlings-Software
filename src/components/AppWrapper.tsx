import React from 'react'

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='w-full overflow-x-hidden overflow-y-scroll h-screen pb-10'>
      <nav className='w-full sticky top-0 backdrop-blur-sm'>
        <img className='h-16 ml-8 mt-3' src="/LOGOTIPO ECOTEA-06.png" alt="" />
      </nav>
      <main className="flex justify-center items-center flex-col gap-4">
        <h1 className='mb-2 text-3xl font-bold'>Scantlings Software</h1>
        <div className='max-h-full max-w-6xl flex flex-col items-center justify-center'>
          {children}
        </div>
      </main>
    </main>
  )
}
