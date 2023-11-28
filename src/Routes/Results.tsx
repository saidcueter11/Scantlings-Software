import { useScantlingsContext } from '../Context/ScantlingsContext'
import { useBottomCalculator } from '../hooks/bottomCalculator'
import { useCraftCalculator } from '../hooks/craftCalculator'
import { useLocation } from 'wouter'
// import { useSideCalculator } from '../hooks/sideCalculator'
// import { useDeckCalculator } from '../hooks/deckCalculator'
import { BottomResultsTable } from '../components/BottomResultsTable'

export const Results = () => {
  const context = useScantlingsContext()
  const craft = useCraftCalculator()
  const bottom = useBottomCalculator()
  // const side = useSideCalculator()
  // const deck = useDeckCalculator()

  const [,setLocation] = useLocation()
  const goBack = () => { history.back() }
  const handleReset = () => {
    setLocation('/')
    context.resetStates()
  }

  return (
    <main className='max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-none'>

      {
        context.zone === 'Fondo' && <BottomResultsTable context={context} craft={craft} bottom={bottom}/>
      }

      <div className='flex w-full justify-center mb-4 gap-5 '>
        <button className='py-0.5 px-3 w-full md:px-10 md:w-fit border md:min-w-[200px] rounded-lg bg-slate-600 p-3 text-slate-50 transition-opacity' onClick={goBack}>Ir atras</button>
        <button className='py-0.5 px-3 w-full md:w-fit md:px-10 border md:min-w-[200px] rounded-lg bg-slate-600 p-3 text-slate-50 transition-opacity' onClick={handleReset}>Nuevo calculo</button>
      </div>
    </main>

  )
}
