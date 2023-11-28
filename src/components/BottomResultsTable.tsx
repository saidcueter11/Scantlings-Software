import { type ReactNode, useEffect, useRef, useState } from 'react'
import { type ScantlingsContextType } from '../Context/ScantlingsContext'
import { type UseCraftCalculatorReturnType, type UseBottomCalculatorReturnType } from '../types'
import { exportToExcel } from '../utils/exportToExcel'
import { exportTableToPdf } from '../utils/exportToPdf'
import { ResultsItem } from './ResultsItem'

const CollapsibleRow = ({ title, children }: { title: string, children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [maxHeight, setMaxHeight] = useState('0px')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current !== null && setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px')
  }, [isOpen, contentRef])
  const toggleCollapse = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="border-b">
      <button
        className="w-full text-left p-2 font-bold"
        onClick={toggleCollapse}
      >
        {title}
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-max-height duration-500 ease-in-out"
      >
        <div className="p-2 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

export const BottomResultsTable = ({ context, bottom, craft }: { context: ScantlingsContextType, bottom: UseBottomCalculatorReturnType, craft: UseCraftCalculatorReturnType }) => {
  const PBM_MIN = 0.45 * Math.pow(context.mLDC, 0.33) + (0.9 * context.LWL * craft.kDC)

  const compileDataForExport = () => (
    [
      {
        'Atributos Generales': 'Type',
        'Valor General': context.type,
        Plating: 'Distancia de popa al pane (xp)',
        'Valor Plating': context.xp,
        Stiffeners: 'Distancia de popa al panel (xs)',
        'Valor Stiffeners': context.xs
      },
      {
        'Atributos Generales': 'Category',
        'Valor General': context.category,
        Plating: 'kLp',
        'Valor Plating': craft.calculateKL.kLp,
        Stiffeners: 'kLs',
        'Valor Stiffeners': craft.calculateKL.kLs
      },
      {
        'Atributos Generales': 'Zone',
        'Valor General': context.zone,
        Plating: 'kRp',
        'Valor Plating': craft.calculateKR.kRp,
        Stiffeners: 'kRs',
        'Valor Stiffeners': craft.calculateKR.kRs
      },
      {
        'Atributos Generales': 'kDC',
        'Valor General': craft.kDC,
        Plating: 'ADp',
        'Valor Plating': craft.calculateAD.ADp,
        Stiffeners: 'ADs',
        'Valor Stiffeners': craft.calculateAD.ADs
      },
      {
        'Atributos Generales': 'nCG',
        'Valor General': craft.nCG,
        Plating: 'kARp',
        'Valor Plating': craft.calculateKAR.kARp,
        Stiffeners: 'kARs',
        'Valor Stiffeners': craft.calculateKAR.kARs
      },
      {
        'Atributos Generales': 'Material',
        'Valor General': context.material,
        Plating: 'Presion en modo desplazamiento (Plating)',
        'Valor Plating': bottom.pbmdValues.PBMDp,
        Stiffeners: 'Presion en modo desplazamiento (Stiffeners)',
        'Valor Stiffeners': bottom.pbmdValues.PBMDs
      },
      {
        'Atributos Generales': 'Esfuerzo de diseño (Plating)',
        'Valor General': craft.designStressesPlating.sigmaDp,
        Plating: 'Presion en modo planeo (Plating)',
        'Valor Plating': bottom.pbmpValues.PBMPp,
        Stiffeners: 'Presion en modo planeo (Stiffeners)',
        'Valor Stiffeners': bottom.pbmpValues.PBMPs
      },
      {
        'Atributos Generales': 'Esfuerzo de diseño (Stiffeners)',
        'Valor General': craft.designStressesStiffeners.sigmaD,
        Plating: 'Presion en el fondo tomada (Plating)',
        'Valor Plating': bottom.bottomPressureS,
        Stiffeners: 'Presion en el fondo tomada (Stiffeners)',
        'Valor Stiffeners': bottom.bottomPressureS
      },
      {
        'Atributos Generales': 'Esfuerzo de diseño cortante (Stiffeners)',
        'Valor General': craft.designStressesStiffeners.tauDs,
        Plating: 'k2',
        'Valor Plating': craft.calculatePlatingFactors.k2,
        Stiffeners: 'kCS',
        'Valor Stiffeners': craft.KCS
      },
      {
        'Atributos Generales': 'kSA',
        'Valor General': '5',
        Plating: 'k3',
        'Valor Plating': craft.calculatePlatingFactors.k3
        // Stiffeners field is empty in this row
      },
      {
        'Atributos Generales': 'Minima presion en el fondo',
        'Valor General': PBM_MIN,
        Plating: 'kC',
        'Valor Plating': craft.KC
        // Stiffeners field is empty in this row
      }
      // ... Continue for any further rows
    ]
  )

  const handleExportToExcel = () => { exportToExcel(compileDataForExport(), 'Test') }
  const handleExportToPdf = () => { void exportTableToPdf('bottomTable', 'Test') }

  return (
    <>
      <section className='px-6 rounded-lg min-w-full border-collapse border border-black'>
        <table className='hidden lg:block lg:max-w-4xl xl:max-w-none' id='bottomTable'>
          <thead>
            <tr>
              <th className='p-2 text-center text-lg font-bold border-b border-black'>Atributos Generales</th>
              <th className='p-2 text-center text-lg font-bold border-b border-black'>Plating</th>
              <th className='p-2 text-center text-lg font-bold border-b border-black'>Stiffeners</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <ResultsItem text="Type" data={context.type} />
              <ResultsItem text="Distancia de popa al pane (xp)" data={context.xp} />
              <ResultsItem text="Distancia de popa al panel (xs)" data={context.xs} />
            </tr>
            <tr>
              <ResultsItem text="Category" data={context.category} />
              <ResultsItem text="kLp" data={craft.calculateKL.kLp} />
              <ResultsItem text="kLs" data={craft.calculateKL.kLs} />
            </tr>
            <tr>
              <ResultsItem text="Zone" data={context.zone} />
              <ResultsItem text="kRp" data={craft.calculateKR.kRp} />
              <ResultsItem text="kRs" data={craft.calculateKR.kRs} />
            </tr>
            <tr>
              <ResultsItem text="kDC" data={craft.kDC} />
              <ResultsItem text="ADp" data={craft.calculateAD.ADp} />
              <ResultsItem text="ADs" data={craft.calculateAD.ADs} />
            </tr>
            <tr>
              <ResultsItem text="nCG" data={craft.nCG} />
              <ResultsItem text="kARp" data={craft.calculateKAR.kARp} />
              <ResultsItem text="kARs" data={craft.calculateKAR.kARs} />
            </tr>
            <tr>
              <ResultsItem text="Material" data={context.material} />
              <ResultsItem text="Presion en modo desplazamiento (Plating)" data={bottom.pbmdValues.PBMDp} />
              <ResultsItem text="Presion en modo desplazamiento (Stiffeners)" data={bottom.pbmdValues.PBMDs} />
            </tr>
            <tr>
              <ResultsItem text="Esfuerzo de diseño (Plating)" data={craft.designStressesPlating.sigmaDp} />
              <ResultsItem text="Presion en modo planeo (Plating)" data={bottom.pbmpValues.PBMPp} />
              <ResultsItem text="Presion en modo planeo (Stiffeners)" data={bottom.pbmpValues.PBMPs} />
            </tr>
            <tr>
              <ResultsItem text="Esfuerzo de diseño (Stiffeners)" data={craft.designStressesStiffeners.sigmaD} />
              <ResultsItem text="Presion en el fondo tomada (Plating)" data={bottom.bottomPressureS} />
              <ResultsItem text="Presion en el fondo tomada (Stiffeners)" data={bottom.bottomPressureS} />
            </tr>
            <tr>
              <ResultsItem text="Esfuerzo de diseño cortante (Stiffeners)" data={craft.designStressesStiffeners.tauDs} />
              <ResultsItem text="k2" data={craft.calculatePlatingFactors.k2} />
              <ResultsItem text="kCS" data={craft.KCS} />
            </tr>
            <tr>
              <ResultsItem text="kSA" data="5" />
              <ResultsItem text="k3" data={craft.calculatePlatingFactors.k3} />
              <ResultsItem />
            </tr>
            <tr>
              <ResultsItem text="Minima presion en el fondo" data={PBM_MIN} />
              <ResultsItem text="kC" data={craft.KC} />
              <ResultsItem />
            </tr>
          </tbody>
        </table>

        <div className="lg:hidden">
          <CollapsibleRow title="Atributos Generales">
            <ResultsItem text="Type" data={context.type} />
            <ResultsItem text="Category" data={context.category} />
            <ResultsItem text="Zone" data={context.zone} />
            <ResultsItem text="kDC" data={craft.kDC} />
            <ResultsItem text="nCG" data={craft.nCG.toFixed(3)} />
            <ResultsItem text="Material" data={context.material} />
            <ResultsItem text="Esfuerzo de diseño (Plating)" data={craft.designStressesPlating.sigmaDp} />
            <ResultsItem text="Esfuerzo de diseño (Stiffeners)" data={craft.designStressesStiffeners.sigmaD} />
            <ResultsItem text="Esfuerzo de diseño cortante (Stiffeners)" data={craft.designStressesStiffeners.tauDs} />
            <ResultsItem text="kSA" data="5" />
            <ResultsItem text="Minima presion en el fondo" data={PBM_MIN.toFixed(3)} />
          </CollapsibleRow>

          <CollapsibleRow title="Plating">
            <ResultsItem text="Distancia de popa al pane (xp)" data={context.xp} />
            <ResultsItem text="kLp" data={craft.calculateKL.kLp} />
            <ResultsItem text="kRp" data={craft.calculateKR.kRp} />
            <ResultsItem text="ADp" data={craft.calculateAD.ADp.toFixed(3)} />
            <ResultsItem text="kARp" data={craft.calculateKAR.kARp.toFixed(3)} />

            <ResultsItem text="Presion en modo desplazamiento (Plating)" data={bottom.pbmdValues.PBMDp.toFixed(3)} />
            <ResultsItem text="Presion en modo planeo (Plating)" data={bottom.pbmpValues.PBMPp.toFixed(3)} />
            <ResultsItem text="Presion en el fondo tomada (Plating)" data={bottom.bottomPressureS.toFixed(3)} />
            <ResultsItem text="k2" data={craft.calculatePlatingFactors.k2} />
            <ResultsItem text="k3" data={craft.calculatePlatingFactors.k3} />
            <ResultsItem text="kC" data={craft.KC} />
          </CollapsibleRow>

        <CollapsibleRow title="Stiffeners">
            <ResultsItem text="Distancia de popa al panel (xs)" data={context.xs} />
            <ResultsItem text="kLs" data={craft.calculateKL.kLs} />
            <ResultsItem text="kRs" data={craft.calculateKR.kRs} />
            <ResultsItem text="ADs" data={craft.calculateAD.ADs.toFixed(3)} />
            <ResultsItem text="kARs" data={craft.calculateKAR.kARs.toFixed(3)} />
            <ResultsItem text="Presion en modo desplazamiento (Stiffeners)" data={bottom.pbmdValues.PBMDs.toFixed(3)} />
            <ResultsItem text="Presion en modo planeo (Stiffeners)" data={bottom.pbmpValues.PBMPs.toFixed(3)} />
            <ResultsItem text="Presion en el fondo tomada (Stiffeners)" data={bottom.bottomPressureS.toFixed(3)} />
            <ResultsItem text="kCS" data={craft.KCS} />

        </CollapsibleRow>

        </div>

      </section>

      <section className='md:p-6 py-3 px-0.5 flex-col flex gap-2'>
        {
          context.material === 'FRP-Single Skin' &&
          <>
            <p>Peso mínimo que debe tener la fibra seca es de: {bottom.minHullThickness.wMin} [kg/m^2]</p>
            <p>Adicionalmente, el Segundo Momento de Inercia mínimo requerido para los refuerzos es de {bottom.SecondI} [cm^4]</p>
          </>
        }

        {
          context.material === 'FRP-Sandwich' &&
          <>
            <p>Peso mínimo de la fibra seca exterior: {bottom.minHullThickness.wos} [kg/m^2], Peso minimo de la fibra interior: {bottom.minHullThickness.wis} [kg/m^2]</p>
            <p>El Módulo de sección mínimo requerido de la piel exterior para un laminado sándwich de 1 cm de ancho es de: {bottom.bottomPlating.SM0} [cm^3/cm], y para el laminado interior es de: {bottom.bottomPlating.SM1} [cm^3/cm]</p>
            <p>Adicionalmente, el Segundo Momento de Inercia mínimo requerido para los refuerzos es de {bottom.SecondI} [cm^4]</p>
          </>
        }

        <p>El espesor de las laminas del fondo calculado es: {bottom.bottomPlating.t?.toFixed(3)}</p>
        <p>El módulo de sección mínimo para los refuerzos del fondo es de: {bottom.SM.toFixed(3)}[cm^3]</p>
        <p>El Area del alma minima es de: {bottom.AW.toFixed(3)}[cm^2]</p>

        <button className='rounded-lg border border-black py-1' onClick={handleExportToExcel}>Export to excel</button>
        <button className='rounded-lg border border-black py-1 hidden lg:block' onClick={handleExportToPdf}>Export to PDF</button>
      </section>
    </>

  )
}
