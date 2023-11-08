import { createContext, useContext, type ReactNode, type SyntheticEvent, useState } from 'react'

// Define the context interface
export interface ScantlingsContextType {
  LH: number
  LWL: number
  BWL: number
  BC: number
  V: number
  mLDC: number
  B04: number
  category: string
  material: string
  zone: string
  setLH: (value: number) => void
  setLWL: (value: number) => void
  setBWL: (value: number) => void
  setBC: (value: number) => void
  setV: (value: number) => void
  setmLDC: (value: number) => void
  setB04: (value: number) => void
  setCategory: (value: string) => void
  setMaterial: (value: string) => void
  setZone: (value: string) => void
  handleChangeInput: (e: SyntheticEvent<HTMLInputElement>, setter: (value: number) => void) => void
  handleChangeSelect: (e: SyntheticEvent<HTMLSelectElement>, setter: (value: string) => void) => void
}

// Create the context
export const ScantlingsContext = createContext<ScantlingsContextType | undefined>(undefined)

// Create a custom hook to access the context
export function useScantlingsContext () {
  const context = useContext(ScantlingsContext)
  if (context == null) {
    throw new Error('useMyContext must be used within a MyContextProvider')
  }
  return context
}

// Create the context provider
interface MyContextProviderProps {
  children: ReactNode
}

export function ScantlingsContextProvider ({ children }: MyContextProviderProps) {
  const [LH, setLH] = useState(0)
  const [LWL, setLWL] = useState(0)
  const [BWL, setBWL] = useState(0)
  const [BC, setBC] = useState(0)
  const [V, setV] = useState(0)
  const [mLDC, setmLDC] = useState(0)
  const [B04, setB04] = useState(0)
  const [category, setCategory] = useState('')
  const [material, setMaterial] = useState('')
  const [zone, setZone] = useState('')

  const handleChangeInput = (e: SyntheticEvent<HTMLInputElement>, setter: (value: number) => void) => {
    const { value } = e.currentTarget
    setter(Number.parseFloat(value))
  }

  const handleChangeSelect = (e: SyntheticEvent<HTMLSelectElement>, setter: (value: string) => void) => {
    const { value } = e.currentTarget
    setter(value)
  }

  const contextValue: ScantlingsContextType = {
    LH,
    LWL,
    BWL,
    BC,
    V,
    mLDC,
    B04,
    category,
    material,
    zone,
    setLH,
    setLWL,
    setBWL,
    setBC,
    setV,
    setmLDC,
    setB04,
    setCategory,
    setMaterial,
    setZone,
    handleChangeInput,
    handleChangeSelect
  }

  return <ScantlingsContext.Provider value={contextValue}>{children}</ScantlingsContext.Provider>
}
