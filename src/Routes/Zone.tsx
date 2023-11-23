import { type SyntheticEvent } from 'react'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { Input } from '../components/Input'
import { Label } from '../components/Label'
import { useLocation } from 'wouter'
import { NextButton } from '../components/NextButton'

export const Zone = () => {
  const [,setLocation] = useLocation()

  const {
    zone,
    LH,
    b,
    l,
    s,
    lu,
    c,
    cu,
    LWL,
    xp,
    xs,
    material,
    z,
    hp,
    hs,
    setHp,
    setHs,
    setZ,
    setB,
    setL,
    setS,
    setLu,
    setC,
    setCu,
    setXp,
    setXs
  } = useScantlingsContext()

  const goBack = () => { history.back() }

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocation(`/${material}/${zone}/results`)
  }

  return (
    <section className='flex flex-col items-center h-full w-full'>
      <div className='w-full'>
      <button className='cursor-pointer w-20 justify-self-start relative border border-transparent hover:border-slate-900 transition-colors rounded-lg px-3 py-0.5' onClick={goBack}>Ir atras</button>
        <h2 className='mb-8 text-xl font-medium text-center'>Zona seleccionada: {zone}</h2>
      </div>
      <form className='lg:grid grid-cols-2 gap-4 xl:max-w-7xl lg:max-h-80 flex flex-col max-w-xs h-full sm:max-w-lg lg:max-w-4xl' onSubmit={handleSubmit}>
        <Label question="Digite el lado más corto del panel 'b', entre los 2 rigidizadores más proximos (mm): " htmlFor={'b'}/>
        <Input min={0} name='b' value={b} setter={setB}/>

        <Label question="Digite el lado más largo del panel 'l', entre los 2 rigidizadores más proximos (mm): " htmlFor={'l'}/>
        <Input min={0} name='l' value={l} setter={setL} max={330 * LH}/>

        <Label question="Ingrese la separación entre cuadernas 's' (mm): " htmlFor={'s'}/>
        <Input min={0} name='s' value={s} setter={setS}/>

        <Label question="Ingrese la longitud no soportada de los rigidizadores 'lu' (mm): " htmlFor={'lu'}/>
        <Input min={0} name='lu' value={lu} setter={setLu} max={330 * LH}/>

        <Label question="Ingrese la corona del panel 'c' (mm): " htmlFor={'c'}/>
        <Input min={0} name='c' value={c} setter={setC} max={330 * LH}/>

        <Label question="Ingrese la corona del rigidizador curvo 'cu' (mm): " htmlFor={'cu'}/>
        <Input min={0} name='cu' value={cu} setter={setCu} max={330 * LH}/>

        <Label question="Ingrese la distancia con respecto a popa del centro del panel analizado 'x_p' (metros): " htmlFor={'xp'}/>
        <Input min={0} name='xp' value={xp} setter={setXp} max={LWL}/>

        <Label question="Ingrese la distancia con respecto a popa del centro del refuerzo analizado 'x_s' (metros): " htmlFor={'xs'}/>
        <Input min={0} name='xs' value={xs} setter={setXs} max={LWL}/>

        {
          zone === 'Cubierta' &&
          <>
            <Label question="Ingrese el francobordo de su embarcación (metros): " htmlFor={'z'}/>
            <Input min={0} name='z' value={z} setter={setZ} />

            <Label question="Ingrese la altura del centro del panel por encima de la linea de flotación (metros): " htmlFor={'hp'}/>
            <Input min={0} name='hp' value={hp} setter={setHp} max={z}/>

            <Label question="Ingrese la altura del centro del refuerzo por encima de la linea de flotación (metros): " htmlFor={'hs'}/>
            <Input min={0} name='hs' value={hs} setter={setHs} max={z}/>
          </>
        }

        <NextButton/>
      </form>
    </section>
  )
}
