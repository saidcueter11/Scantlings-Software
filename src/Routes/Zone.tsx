import { useScantlingsContext } from '../Context/ScantlingsContext'
import { Input } from '../components/Input'
import { Label } from '../components/Label'

export const Zone = () => {
  const {
    zone,
    LH,
    b,
    l,
    s,
    lu,
    c,
    cu,
    setB,
    setL,
    setS,
    setLu,
    setC,
    setCu
  } = useScantlingsContext()

  const goBack = () => { history.back() }
  const handleSubmit = () => {

  }

  return (
    <section className='flex flex-col items-center h-full w-full'>
      <div className=''>
        <button className='cursor-pointer w-20 justify-self-start absolute top-28 left-96 border border-transparent hover:border-slate-900 transition-colors rounded-lg px-3 py-0.5' onClick={goBack}>Ir atras</button>
        <h2 className='mb-8 text-xl font-medium'>Material seleccionado: {zone}</h2>
      </div>
      <form className='grid grid-cols-2 gap-4 max-w-7xl max-h-80' onSubmit={handleSubmit}>
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
        <button className={'bg-slate-600 rounded-lg p-3 mt-5 text-slate-50 transition-opacity col-span-2 w-36 justify-self-center'}>Siguiente</button>
      </form>
    </section>
  )
}
