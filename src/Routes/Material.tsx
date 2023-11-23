import { useLocation, useParams } from 'wouter'
import { Label } from '../components/Label'
import { Input } from '../components/Input'
import { useScantlingsContext } from '../Context/ScantlingsContext'
import { type SyntheticEvent } from 'react'
import { Select } from '../components/Select'
import { SKIN_TYPE } from '../constants'
import { NextButton } from '../components/NextButton'

export const Material = () => {
  const params = useParams()
  const [,setLocation] = useLocation()
  const goBack = () => { history.back() }
  const {
    material,
    zone,
    sigmaU,
    sigmaY,
    sigmaUf,
    sigmaUt,
    sigmaUc,
    tauU,
    tauNu,
    ei,
    eio,
    eo,
    setEi,
    setEio,
    setSigmaU,
    setSigmaUc,
    setSigmaUf,
    setSigmaUt,
    setSigmaY,
    setTauU,
    setEo,
    setTauNu,
    setSkin
  } = useScantlingsContext()

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocation(`${material}/${zone}`)
  }

  return (
    <section className='flex flex-col items-center h-full w-full'>
      <div className=''>
        <button className='cursor-pointer w-20 justify-self-start absolute top-28 left-96 border border-transparent hover:border-slate-900 transition-colors rounded-lg px-3 py-0.5' onClick={goBack}>Ir atras</button>
        <h2 className='mb-8 text-xl font-medium'>Material seleccionado: {material}</h2>
      </div>
      <form className='grid grid-cols-2 gap-4 max-w-7xl max-h-80' onSubmit={handleSubmit}>
        {
          (params.material === 'Acero' || params.material === 'Aluminio') && (
            <>
              <Label question={`Ingrese la resistencia última a la tracción 'sigma_u' del ${params.material} en (MPa): `} htmlFor='sigma_u'/>
              <Input min={0} name='sigma_u' value={sigmaU} setter={setSigmaU} />

              <Label question={`Ingrese el límite elástico por tracción del ${params.material} en (MPa): `} htmlFor='sigma_y'/>
              <Input min={0} max={sigmaU} name='sigma_y' value={sigmaY} setter={setSigmaY} />
            </>
          )
        }

        {
          ((params.material?.includes('FRP-Single')) ?? false) && (
            <>
              <Label question={'Ingrese la resistencia última a la flexión (MPa): '} htmlFor='sigma_uf'/>
              <Input min={0} name='sigma_uf' value={sigmaUf} setter={setSigmaUf}/>

              <Label question={'Ingrese la resistencia última de tensión del laminado (MPa): '} htmlFor='sigma_ut'/>
              <Input min={0} name='sigma_ut' value={sigmaUt} setter={setSigmaUt}/>

              <Label question={'Ingrese la resistencia última de compresión del laminado (MPa): '} htmlFor='sigma_uc'/>
              <Input min={0} name='sigma_uc' value={sigmaUc} setter={setSigmaUc}/>

              <Label question={'Ingrese la resistencia última al cortante de la fibra (MPa): '} htmlFor='tau_u'/>
              <Input min={0} name='tau_u' value={tauU} setter={setTauU}/>

              <Label question={'Ingrese el Módulo de Elasticidad de la fibra (MPa): '} htmlFor='eio'/>
              <Input min={0} name='eio' value={eio} setter={setEio}/>

              <Label question='Seleccione el tipo de fibra de diseño' htmlFor='skin'/>
              <Select array={SKIN_TYPE} setter={setSkin}/>
            </>
          )
        }

        {
          params.material === 'FRP-Sandwich' && (
            <>
              <Label question='Ingrese la resistencia última de tensión del laminado exterior (MPa):' htmlFor='sigma_ut'/>
              <Input min={0} name='sigma_ut' value={sigmaUt} setter={setSigmaUt}/>

              <Label question='Ingrese la resistencia última de compresión del laminado interior (MPa): ' htmlFor='sigma_uc'/>
              <Input min={0} name='sigma_uc' value={sigmaUc} setter={setSigmaUc}/>

              <Label question='Ingrese la resistencia última al cortante de la fibra (MPa): ' htmlFor='tau_u'/>
              <Input min={0} name='tau_u' value={tauU} setter={setTauU}/>

              <Label question={`Ingrese la resistencia última a la tracción 'sigma_u' del ${params.material} en (MPa):ese la resistencia última al cortante del nucleo (MPa): `} htmlFor='tau_nu'/>
              <Input min={0} name='tau_nu' value={tauNu} setter={setTauNu}/>

              <Label question={'Ingrese el Módulo de elasticidad de la fibra interna (MPa): '} htmlFor='ei'/>
              <Input min={0} name='ei' value={ei} setter={setEi}/>

              <Label question={'Ingrese el Módulo de elasticidad de la fibra externa (MPa): '} htmlFor='eo`'/>
              <Input min={0} name='eo' value={eo} setter={setEo}/>

              <Label question='Seleccione el tipo de fibra de diseño' htmlFor='skin'/>
              <Select array={SKIN_TYPE} setter={setSkin}/>
            </>
          )
        }
        <NextButton/>
      </form>
    </section>
  )
}
