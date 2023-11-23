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

  return (
    <main>

      {
        context.zone === 'Fondo' && <BottomResultsTable context={context} craft={craft} bottom={bottom}/>
      }

      <div className='flex w-full justify-center mb-4 gap-5 '>
        <button className='py-0.5 px-10 border min-w-[200px] rounded-lg border-black hover:bg-black/90 hover:text-slate-50 transition-colors' onClick={goBack}>Ir atras</button>
        <button className='py-0.5 px-10 border min-w-[200px] rounded-lg border-black hover:bg-black/90 hover:text-slate-50 transition-colors' onClick={() => { setLocation('/') }}>Nuevo calculo</button>
      </div>
    </main>

  )
}
