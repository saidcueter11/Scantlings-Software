import { Route } from 'wouter'
import { InitialValues } from './Routes/InitialValues'
import { Material } from './Routes/Material'
import { ScantlingsContextProvider } from './Context/ScantlingsContext'
import { AppWrapper } from './components/AppWrapper'

function App () {
  return (
    <AppWrapper>
      <ScantlingsContextProvider>
        <Route component={InitialValues} path='/'/>
        <Route component={Material} path='/:material'/>
      </ScantlingsContextProvider>
    </AppWrapper>
  )
}

export default App
