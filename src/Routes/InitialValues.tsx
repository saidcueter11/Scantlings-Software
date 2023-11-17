import { Label } from '../components/Label'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { type SyntheticEvent } from 'react'
import { CATEGORIA_EMBARCACION, PLATING_MATERIALS, ZONES } from '../constants'
import { useLocation } from 'wouter'
import { useScantlingsContext } from '../Context/ScantlingsContext'

export const InitialValues = () => {
  const [, setLocation] = useLocation()
  const {
    LH,
    LWL,
    BWL,
    BC,
    V,
    mLDC,
    B04,
    material,
    setLH,
    setBWL,
    setBC,
    setLWL,
    setB04,
    setV,
    setmLDC,
    setCategory,
    setMaterial,
    setZone
  } = useScantlingsContext()

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setmLDC(mLDC * 1000)
    setLocation(material)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
        <Label question="Ingrese la eslora maxima 'LH' de su embarcación (metros):" htmlFor='LH'/>
        <Input min={2.5} max={24} value={LH} setter={setLH} name='LH'/>

        <Label question="Ingrese la eslora de la linea de flotación o eslora de escantillón 'LWL' (metros):" htmlFor='LWL'/>
        <Input min={2.5} max={LH} value={LWL} setter={setLWL} name='LWL'/>

        <Label question="Ingrese la manga de la linea de flotación 'BWL' (metros): " htmlFor='BWL'/>
        <Input min={0} value={BWL} setter={setBWL} name='BWL'/>

        <Label question="Ingrese la manga del lomo o 'chine' 'BC' (metros): " htmlFor='BC'/>
        <Input min={0} value={BC} setter={setBC} name='BC'/>

        <Label question="Ingrese la velocidad maxima de diseño 'V' de la embarcación (Nudos): " htmlFor='V'/>
        <Input min={2.36 * Math.sqrt(LWL)} value={V} setter={setV} name='V'/>

        <Label question="Ingrese el desplazamiento de la embarcación 'mLDC' (Toneladas): " htmlFor='mLDC'/>
        <Input min={0} value={mLDC} setter={setmLDC} name='mLDC'/>

        <Label question={`Ingrese el ángulo de astilla muerta 'B04' en el LCG, o a ${0.4 * LWL >= 0 ? (0.4 * LWL).toFixed(3) : 0} metros de la popa (°grados):`} htmlFor='B04'/>
        <Input min={0} value={B04} setter={setB04} name='B04'/>

        <Label question="Seleccione la categoria para el diseño de su embarcación:" htmlFor='categoria'/>
        <Select array={CATEGORIA_EMBARCACION} setterCategory={setCategory}/>

        <Label question="Seleccione el material para el escantillonado de su embarcación" htmlFor='material'/>
        <Select array={PLATING_MATERIALS} setter={setMaterial}/>

        <Label question="Seleccione la zona donde desea realizar los calculos" htmlFor='zona'/>
        <Select array={ZONES} setter={setZone}/>

        <button className={`bg-slate-600 rounded-lg p-3 mt-5 text-slate-50 transition-opacity col-span-2 w-36 justify-self-center ${material.length === 0 ? 'opacity-40' : 'opacity-100'}`} disabled={material.length === 0}>Siguiente</button>
      </form>
    </>
  )
}
