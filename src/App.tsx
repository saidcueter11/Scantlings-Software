import { type SyntheticEvent, useState } from 'react'
import './App.css'
import { Label } from './components/Label'
import { Input } from './components/Input'

const PLATING_MATERIALS = ['Acero', 'Aluminio', 'FRP-Single Skin', 'FRP-Sandwich']
const CATEGORIA_EMBARCACION = ['Oceano', 'Offshore', 'Inshore', 'Aguas protegidas']

function App () {
  const [LH, setLH] = useState(0)

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget ?? 0
    console.log(e.currentTarget.value)
    setLH(Number.parseFloat(value))
  }

  return (
    <>
      <form className='w-full h-screen flex justify-center items-center flex-col gap-4'>
        <section className='grid grid-cols-4 gap-3'>
          <Label question="Ingrese la eslora maxima 'LH' de su embarcación (metros):"/>
          <Input min={2.5} max={24} value={LH} handleChange={handleChange} />

          <Label question="Ingrese la eslora de la linea de flotación o eslora de escantillón 'LWL' (metros):"/>
          <Input min={2.5} max={LH} value={0} />
          <Label question="Seleccione la categoria para el diseño de su embarcación:" />
          <select className='border border-slate-400/80 rounded-lg px-3 py-0.5 bg-transparent' name="" id="">
            {
              CATEGORIA_EMBARCACION.map((categoria, index) => <option key={index}>{categoria}</option>)
            }
          </select>

          <Label question="Seleccione el material para el escantillonado de su embarcación" />
          <select name="Material" id="" className='border border-slate-400/80 rounded-lg px-3 py-0.5 bg-transparent'>
            {
              PLATING_MATERIALS.map((material, index) => <option key={index}>{material}</option>)
            }
          </select>
        </section>
        <button className='bg-slate-400/90 rounded-lg p-3 text-slate-50'>Siguiente</button>
      </form>
    </>
  )
}

export default App
