import { Route } from 'wouter'
import { InitialValues } from './Routes/InitialValues'
import { Material } from './Routes/Material'
import { ScantlingsContextProvider } from './Context/ScantlingsContext'
import { AppWrapper } from './components/AppWrapper'
import { Zone } from './Routes/Zone'

function App () {
  return (
    <AppWrapper>
      <ScantlingsContextProvider>
        <Route component={InitialValues} path='/'/>
        <Route component={Material} path='/:material'/>
        <Route component={Zone} path='/:material/:zone'/>
      </ScantlingsContextProvider>
    </AppWrapper>
  )
}

export default App
