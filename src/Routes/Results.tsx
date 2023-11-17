import { useScantlingsContext } from '../Context/ScantlingsContext'
import { useCraftCalculator } from '../hooks/craftCalculator'

export const Results = () => {
  const { mLDC, type, category, zone, material, xp, xs, LWL } = useScantlingsContext()
  const context = useScantlingsContext()
  const { calculatePBMD, calculatePBMP, kDC, nCG, designStressesPlating, designStressesStiffeners, calculateKL, calculateKR, calculateKAR, calculateAD, calculatePlatingFactors, KC, KCS } = useCraftCalculator()
  const craft = useCraftCalculator()

  const bottomPressureS = Math.max(calculatePBMD.PBMDs, calculatePBMP.PBMPs)

  const PBM_MIN = 0.45 * Math.pow(mLDC, 0.33) + (0.9 * LWL * kDC)

  console.log({ context })
  console.log({ craft })

  return (
    <>
      <p>Type: {type}</p>
      <p>Category: {category}</p>
      <p>Zone: {zone}</p>
      <p>kDC: {kDC}</p>
      <p>nCG: {nCG}</p>
      <p>Material: {material}</p>
      <p>Esfuerzo de diseño (Plating): {designStressesPlating.sigmaDp}</p>
      <p>Esfuerzo de diseño (Stiffeners): {designStressesStiffeners.sigmaD}</p>
      <p>Esfuerzo de diseño cortante (Stiffeners): {designStressesStiffeners.tauDs}</p>
      <p>kSA: {5}</p>
      <p>Minima presion en el fondo: {PBM_MIN}</p>

      <p>Distancia de popa al pane (xp): {xp}</p>
      <p>kLp: {calculateKL.kLp}</p>
      <p>kRp: {calculateKR.kRp}</p>
      <p>ADp: {calculateAD.ADp}</p>
      <p>kARp: {calculateKAR.kARp}</p>
      <p>Presion en modo desplazamiento (Plating): {calculatePBMD.PBMDp}</p>
      <p>Presion en modo planeo (Plating): {calculatePBMP.PBMPp}</p>
      <p>Presion en el fondo tomada: {bottomPressureS}</p>
      <p>k2: {calculatePlatingFactors.k2}</p>
      <p>k3: {calculatePlatingFactors.k3}</p>
      <p>kC: {KC}</p>

      <p>Distancia de popa al panel (xs): {xs}</p>
      <p>kLs: {calculateKL.kLs}</p>
      <p>kRs: {calculateKR.kRs}</p>
      <p>ADs: {calculateAD.ADs}</p>
      <p>kARs: {calculateKAR.kARs}</p>
      <p>Presion en modo desplazamiento (Stiffeners): {calculatePBMD.PBMDs}</p>
      <p>Presion en modo planeo (Stiffeners): {calculatePBMP.PBMPs}</p>
      <p>Presion en el fondo tomada: {bottomPressureS}</p>
      <p>kCS: {KCS}</p>
    </>
  )
}
