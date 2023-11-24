import { createContext, useContext, type ReactNode, type SyntheticEvent, useState } from 'react'

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
  category: 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas'
  material: string
  zone: string
  b: number
  l: number
  lu: number
  s: number
  c: number
  cu: number
  xp: number
  xs: number
  type: 'Displacement' | 'Planning'
  skin: string
  z: number
  hp: number
  hs: number
  setZ: (value: number) => void
  setHp: (value: number) => void
  setHs: (value: number) => void
  setSkin: (value: string) => void
  setType: (value: 'Displacement' | 'Planning') => void
  setXs: (value: number) => void
  setXp: (value: number) => void
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
  setCategory: (value: 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas') => void
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
  handleChangeSelectCategory: (e: SyntheticEvent<HTMLSelectElement>, setterCategory: (value: 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas') => void) => void
}

export const ScantlingsContext = createContext<ScantlingsContextType | undefined>(undefined)

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
  const [xp, setXp] = useState(LWL)
  const [xs, setXs] = useState(LWL)
  const [z, setZ] = useState(0)
  const [hp, setHp] = useState(0)
  const [hs, setHs] = useState(0)
  const [skin, setSkin] = useState('Fibra de vidrio E con filamentos cortados')
  const [category, setCategory] = useState<'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas'>('Oceano')
  const [material, setMaterial] = useState('Acero')
  const [zone, setZone] = useState('Fondo')
  const [type, setType] = useState<'Displacement' | 'Planning'>('Planning')

  const handleChangeInput = (e: SyntheticEvent<HTMLInputElement>, setter: (value: number) => void) => {
    const value = e.currentTarget.value
    if (value === '') {
      setter(0) // Set to default value when input is empty
    } else if (/^\d*\.?\d*$/.test(value)) {
      setter(value === '.' ? 0 : Number.parseFloat(value))
    }
  }

  const handleChangeSelect = (e: SyntheticEvent<HTMLSelectElement>, setter: (value: string) => void) => {
    const { value } = e.currentTarget
    setter(value)
  }

  const handleChangeSelectCategory = (
    e: SyntheticEvent<HTMLSelectElement>,
    setterCategory: (value: 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas') => void
  ) => {
    const { value } = e.currentTarget
    setterCategory(value as 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas')
  }

  const contextValue: ScantlingsContextType = {
    skin,
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
    xp,
    xs,
    type,
    z,
    hp,
    hs,
    setHp,
    setHs,
    setZ,
    setSkin,
    setType,
    setXp,
    setXs,
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
    handleChangeSelect,
    handleChangeSelectCategory
  }

  return <ScantlingsContext.Provider value={contextValue}>{children}</ScantlingsContext.Provider>
}
export function useScantlingsContext () {
  const context = useContext(ScantlingsContext)
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyContextProvider')
  }
  return context
}
