import { Route } from 'wouter'
import { InitialValues } from './Routes/InitialValues'
import { Material } from './Routes/Material'
import { AppWrapper } from './components/AppWrapper'
import { Zone } from './Routes/Zone'
import { Results } from './Routes/Results'
import { ScantlingsContextProvider } from './Context/ScantlingsContext'

function App () {
  return (
    <ScantlingsContextProvider>
      <AppWrapper>
        <Route component={Results} path='/results' />
        <Route component={Zone} path='/:material/:zone' />
        <Route component={Material} path='/:material' />
        <Route component={InitialValues} path='/' />
      </AppWrapper>
    </ScantlingsContextProvider>
  )
}

export default App
