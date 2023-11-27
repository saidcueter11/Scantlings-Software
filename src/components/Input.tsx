import { useScantlingsContext } from '../Context/ScantlingsContext'

interface InputProps {
  min: number
  max?: number
  value: number
  name: string
  setter: (value: number) => void
}

export const Input = ({ min, max, value, setter, name }: InputProps) => {
  const { handleChangeInput } = useScantlingsContext()
  return <input
    className='border border-slate-400/80 rounded-lg px-3 py-0.5'
    step='any'
    id={name}
    type='number'
    min={min}
    max={max}
    value={value}
    onChange={(e) => { handleChangeInput(e, setter) }}
    required
/>
}
