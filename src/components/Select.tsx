import { useScantlingsContext } from '../Context/ScantlingsContext'

interface SelectProps {
  array: string[]
  setter?: (value: string) => void
  setterCategory?: (value: 'Oceano' | 'Offshore' | 'Inshore' | 'Aguas protegidas') => void
}

export const Select = ({ array, setter, setterCategory }: SelectProps) => {
  const { handleChangeSelect, handleChangeSelectCategory } = useScantlingsContext()

  return (
    <select className="border border-slate-400/80 rounded-lg px-3 py-0.5 bg-transparent" onChange={(e) => { setterCategory !== undefined ? handleChangeSelectCategory(e, setterCategory) : setter !== undefined && handleChangeSelect(e, setter) }}>
      {array.map((item, i) => <option value={item} key={i} selected={i === 0}>{item}</option>)}
    </select>
  )
}
