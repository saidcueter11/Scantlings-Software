import { type SyntheticEvent } from 'react'

interface InputProps {
  min: number
  max: number
  value: number
  handleChange?: (e: SyntheticEvent<HTMLInputElement>) => void
}

export const Input = ({ min, max, value, handleChange }: InputProps) => {
  return <input className='border border-slate-400/80 rounded-lg px-3 py-0.5' type='number' min={min} max={max} value={value} onChange={handleChange} required/>
}
