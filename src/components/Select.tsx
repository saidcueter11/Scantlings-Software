import { useScantlingsContext } from '../Context/ScantlingsContext'

interface SelectProps {
  array: string[]
  setter: (value: string) => void
}

export const Select = ({ array, setter }: SelectProps) => {
  const { handleChangeSelect } = useScantlingsContext()
  return (
    <select className="border border-slate-400/80 rounded-lg px-3 py-0.5 bg-transparent" onChange={(e) => { handleChangeSelect(e, setter) }}>
      {array.map((item, i) => <option value={item} key={i}>{item}</option>)}
    </select>
  )
}
