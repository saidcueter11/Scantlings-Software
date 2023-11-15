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
  sigmaU: number
  sigmaY: number
  sigmaUf: number
  sigmaUt: number
  sigmaUc: number
  tauU: number
  tauNu: number
  eio: number
  ei: number
  eo: number
  category: string
  material: string
  zone: string
  b: number
  l: number
  lu: number
  s: number
  c: number
  cu: number
  setLH: (value: number) => void
  setLWL: (value: number) => void
  setBWL: (value: number) => void
  setBC: (value: number) => void
  setV: (value: number) => void
  setmLDC: (value: number) => void
  setB04: (value: number) => void
  setSigmaU: (value: number) => void
  setSigmaY: (value: number) => void
  setSigmaUf: (value: number) => void
  setSigmaUt: (value: number) => void
  setSigmaUc: (value: number) => void
  setTauU: (value: number) => void
  setTauNu: (value: number) => void
  setEio: (value: number) => void
  setEi: (value: number) => void
  setEo: (value: number) => void
  setCategory: (value: string) => void
  setMaterial: (value: string) => void
  setZone: (value: string) => void
  setB: (value: number) => void
  setL: (value: number) => void
  setLu: (value: number) => void
  setS: (value: number) => void
  setC: (value: number) => void
  setCu: (value: number) => void
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
  const [sigmaU, setSigmaU] = useState(0)
  const [sigmaY, setSigmaY] = useState(sigmaU)
  const [sigmaUf, setSigmaUf] = useState(0)
  const [sigmaUt, setSigmaUt] = useState(0)
  const [sigmaUc, setSigmaUc] = useState(0)
  const [tauU, setTauU] = useState(0)
  const [tauNu, setTauNu] = useState(0)
  const [eio, setEio] = useState(0)
  const [ei, setEi] = useState(0)
  const [eo, setEo] = useState(0)
  const [b, setB] = useState(0)
  const [l, setL] = useState(0)
  const [lu, setLu] = useState(0)
  const [s, setS] = useState(0)
  const [c, setC] = useState(0)
  const [cu, setCu] = useState(0)

  const [category, setCategory] = useState('Oceano')
  const [material, setMaterial] = useState('Acero')
  const [zone, setZone] = useState('Fondo')

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
    sigmaU,
    sigmaY,
    sigmaUf,
    sigmaUt,
    sigmaUc,
    tauU,
    tauNu,
    eio,
    ei,
    eo,
    b,
    l,
    lu,
    s,
    c,
    cu,
    setLH,
    setLWL,
    setBWL,
    setBC,
    setV,
    setmLDC,
    setB04,
    setSigmaU,
    setSigmaY,
    setSigmaUf,
    setSigmaUt,
    setSigmaUc,
    setTauU,
    setTauNu,
    setEio,
    setEi,
    setEo,
    setCategory,
    setMaterial,
    setZone,
    setB,
    setL,
    setLu,
    setS,
    setC,
    setCu,
    handleChangeInput,
    handleChangeSelect
  }

  return <ScantlingsContext.Provider value={contextValue}>{children}</ScantlingsContext.Provider>
}
