import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { calculatePlatingFactors, calculateKDC, calculatePBMD, calculatePBMP, designStressesPlating, calculateKSHC, calculateKC } from '../craft'

const { material, mLDC, V, LWL, b, eio } = useScantlingsContext()

export function minHullThickness () {
  let tMin: number | null = null
  let wMin: number | null = null
  let wos: number | null = null
  let wis: number | null = null

  const { A, k5, k7, k8, k4, k6 } = calculatePlatingFactors()
  const kDC = calculateKDC()

  if ((material === 'Acero' || material === 'Aluminio') && k5 !== null && k7 !== null && k8 !== null) {
    tMin = k5 * (A + k7 * V + k8 * Math.pow(mLDC, 0.33))
  } else if (material === 'FRP-Single Skin' && k5 !== null && k7 !== null && k8 !== null) {
    wMin = 0.43 * k5 * (A + k7 * V + k8 * Math.pow(mLDC, 0.33))
  } else if (material === 'FRP-Sandwich' && k5 !== null && k6 !== null) {
    wos = kDC * k4 * k5 * k6 * (0.1 * LWL + 0.15)
    wis = 0.7 * wos
  }

  return { tMin, wMin, wos, wis }
}

export function bottomPlating () {
  let t: number | null = null
  let SM_0: number | null = null
  let SM_1: number | null = null
  let I: number | null = null
  let EI: number | null = null

  const { PBMDp } = calculatePBMD()
  const { PBMPp } = calculatePBMP()
  const bottomPressureP = Math.max(PBMDp, PBMPp)
  const { k2, k3, k1 } = calculatePlatingFactors()
  const { sigmaDp, sigmaDtp, tauDp } = designStressesPlating()
  const kSHC = calculateKSHC()

  const { tMin } = minHullThickness()
  const kC = calculateKC()

  if (['Acero', 'Aluminio'].includes(material) && tMin !== null && k2 !== null && sigmaDp !== null) {
    t = Math.max(tMin, b * kC * Math.sqrt((bottomPressureP * k2) / (1000 * sigmaDp)))
  } else if (material === 'FRP-Single Skin' && sigmaDp !== null) {
    t = b * kC * Math.sqrt((bottomPressureP * k2) / (1000 * sigmaDp))
  } else if (material === 'FRP-Sandwich') {
    // Módulo de sección mínimo requerido de la piel o/i del sándwich de 1 cm de ancho
    SM_0 = sigmaDtp !== null ? (Math.pow(b, 2) * Math.pow(kC, 2) * bottomPressureP * k2) / (6e5 * sigmaDtp) : null
    SM_1 = sigmaDtp !== null ? (Math.pow(b, 2) * Math.pow(kC, 2) * bottomPressureP * k2) / (6e5 * sigmaDtp) : null

    // Segundo momento de inercia mínimo requerido para una lámina de sándwich de 1 cm de ancho
    I = (Math.pow(b, 3) * Math.pow(kC, 3) * bottomPressureP * k3) / (12e6 * k1 * eio)
    EI = (Math.pow(b, 3) * Math.pow(kC, 3) * bottomPressureP * k3) / (12e3 * k1)

    t = tauDp !== null ? Math.sqrt(kC) * ((kSHC * bottomPressureP * b) / (1000 * tauDp)) : null
  } else {
    throw new Error(`Material '${material}' no reconocido`)
  }

  return { t, SM_0, SM_1, I, EI }
}
