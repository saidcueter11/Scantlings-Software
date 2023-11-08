import { Route } from 'wouter'
import { InitialValues } from './Routes/InitialValues'
import { Material } from './Routes/Material'
import { ScantlingsContextProvider } from './Context/ScantlingsContext'

function App () {
  return (
    <ScantlingsContextProvider>
      <Route component={InitialValues} path='/'/>
      <Route component={Material} path='/:material'/>
    </ScantlingsContextProvider>
  )
}

export default App
