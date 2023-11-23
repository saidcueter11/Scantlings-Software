import { useEffect, useState } from 'react'
import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { useCraftCalculator } from '../craftCalculator'
import { type MinHullThicknessType, type ReturnPlatingType, type CalculatePBMDResult, type CalculatePBMPResult } from '../../types'

const initialBottomPlating: ReturnPlatingType = {
  t: 0,
  SM0: 0,
  SM1: 0,
  I: 0,
  EI: 0
}

const initialMinHullThickness: MinHullThicknessType = {
  tMin: 0,
  wMin: 0,
  wos: 0,
  wis: 0
}

export const useBottomCalculator = () => {
  const [pbmdValues, setPBMDValues] = useState<CalculatePBMDResult>({ PBMDp: 0, PBMDs: 0 })
  const [pbmpValues, setPBMPValues] = useState<CalculatePBMPResult>({ PBMPp: 0, PBMPs: 0 })
  const [AW, setCalculateAW] = useState<number>(0)
  const [SM, setCalculateSM] = useState<number>(0)
  const [SecondI, setCalculateSecondI] = useState<number | null>(null)
  const [bottomPressureS, setBottomPressureS] = useState(0)
  const [bottomPlating, setBottomPlating] = useState<ReturnPlatingType>(initialBottomPlating)
  const [minHullThickness, setMinHullThickness] = useState<MinHullThicknessType>(initialMinHullThickness)

  const context = useScantlingsContext()
  const { material, mLDC, V, LWL, b, eio } = useScantlingsContext()
  const { calculatePlatingFactors, kDC, designStressesPlating, KSHC, KC, calculateKAR, calculateKL, nCG, designStressesStiffeners, KCS } = useCraftCalculator()

  useEffect(() => {
    pbmdValues !== calculatePBMD() && setPBMDValues(calculatePBMD())
    pbmpValues !== calculatePBMP() && setPBMPValues(calculatePBMP())
    AW !== calculateAW() && setCalculateAW(calculateAW())
    SM !== calculateSM() && setCalculateSM(calculateSM())
    SecondI !== calculateSecondI() && setCalculateSecondI(calculateSecondI())
    bottomPressureS !== calculateBottomPressureS() && setBottomPressureS(calculateBottomPressureS())
    bottomPlating !== calculateBottomPlating() && setBottomPlating(calculateBottomPlating())
    minHullThickness !== calculateMinHullThickness() && setMinHullThickness(calculateMinHullThickness())
  }, [context, calculatePlatingFactors, kDC, designStressesPlating, KSHC, KC, calculateKAR, calculateKL, nCG, designStressesStiffeners, KCS])

  const calculatePBMD = (): CalculatePBMDResult => {
    const KARValues = calculateKAR
    const KLValues = calculateKL

    const PBM_MIN = 0.45 * Math.pow(context.mLDC, 0.33) + (0.9 * context.LWL * kDC)
    const PBMD_BASE = 2.4 * Math.pow(context.mLDC, 0.33) + 20
    const PBMDp = Math.max(PBMD_BASE * KARValues.kARp * kDC * KLValues.kLp, PBM_MIN)
    const PBMDs = Math.max(PBMD_BASE * KARValues.kARs * kDC * KLValues.kLs, PBM_MIN)

    return { PBMDp, PBMDs }
  }

  const calculatePBMP = (): CalculatePBMPResult => {
    const KARValues = calculateKAR
    const KLValues = calculateKL

    const PBM_MIN = 0.45 * Math.pow(context.mLDC, 0.33) + (0.9 * context.LWL * kDC)
    const PBMP_BASE = ((0.1 * context.mLDC) / (context.LWL * context.BC)) * (1 + Math.pow(kDC, 0.5) * nCG)
    const PBMPp = Math.max(PBMP_BASE * KARValues.kARp * KLValues.kLp, PBM_MIN)
    const PBMPs = Math.max(PBMP_BASE * KARValues.kARs * KLValues.kLs, PBM_MIN)

    return { PBMPp, PBMPs }
  }

  const calculateBottomPressureS = () => Math.max(pbmdValues.PBMDs, pbmpValues.PBMPs)

  function calculateMinHullThickness () {
    let tMin: number = 0
    let wMin: number = 0
    let wos: number = 0
    let wis: number = 0

    const { A, k5, k7, k8, k4, k6 } = calculatePlatingFactors

    if ((material === 'Acero' || material === 'Aluminio')) {
      tMin = k5 * (A + k7 * V + k8 * Math.pow(mLDC, 0.33))
    } else if (material === 'FRP-Single Skin') {
      wMin = 0.43 * k5 * (A + k7 * V + k8 * Math.pow(mLDC, 0.33))
    } else if (material === 'FRP-Sandwich') {
      wos = kDC * k4 * k5 * k6 * (0.1 * LWL + 0.15)
      wis = 0.7 * wos
    }

    return { tMin, wMin, wos, wis }
  }

  function calculateBottomPlating () {
    let t: number = 0
    let SM0: number = 0
    let SM1: number = 0
    let I: number = 0
    let EI: number = 0

    const { PBMDp } = calculatePBMD()
    const { PBMPp } = calculatePBMP()
    const bottomPressureP = Math.max(PBMDp, PBMPp)
    const { k2, k3, k1 } = calculatePlatingFactors
    const { sigmaDp, sigmaDtp, tauDp } = designStressesPlating

    const { tMin } = calculateMinHullThickness()

    if (['Acero', 'Aluminio'].includes(material)) {
      const ra = b * KC * Math.sqrt((bottomPressureP * k2) / (1000 * sigmaDp))
      t = Math.max(tMin, ra)
    } else if (material === 'FRP-Single Skin' && sigmaDp !== null) {
      t = b * KC * Math.sqrt((bottomPressureP * k2) / (1000 * sigmaDp))
    } else if (material === 'FRP-Sandwich') {
    // Módulo de sección mínimo requerido de la piel o/i del sándwich de 1 cm de ancho
      SM0 = (Math.pow(b, 2) * Math.pow(KC, 2) * bottomPressureP * k2) / (6e5 * sigmaDtp)
      SM1 = (Math.pow(b, 2) * Math.pow(KC, 2) * bottomPressureP * k2) / (6e5 * sigmaDtp)

      // Segundo momento de inercia mínimo requerido para una lámina de sándwich de 1 cm de ancho
      I = (Math.pow(b, 3) * Math.pow(KC, 3) * bottomPressureP * k3) / (12e6 * k1 * eio)
      EI = (Math.pow(b, 3) * Math.pow(KC, 3) * bottomPressureP * k3) / (12e3 * k1)

      t = Math.sqrt(KC) * ((KSHC * bottomPressureP * b) / (1000 * tauDp))
    } else {
      throw new Error(`Material '${material}' no reconocido`)
    }

    return { t, SM0, SM1, I, EI }
  }

  const calculateAW = (): number => {
    const kSA = 5
    const bottomPressureS = Math.max(calculatePBMD().PBMDs, calculatePBMP().PBMPs)
    const { tauDs } = designStressesStiffeners

    const AW: number = ((kSA * bottomPressureS * context.s * context.lu) / (tauDs)) * 1e-6
    return AW
  }

  const calculateSM = (): number => {
    const bottomPressureS = Math.max(calculatePBMD().PBMDs, calculatePBMP().PBMPs)
    const { sigmaD } = designStressesStiffeners

    const SM: number = ((83.33 * KCS * bottomPressureS * context.s * Math.pow(context.lu, 2)) / (sigmaD)) * 1e-9
    return SM
  }

  const calculateSecondI = (): number | null => {
    const bottomPressureS = Math.max(calculatePBMD().PBMDs, calculatePBMP().PBMPs)

    if (['FRP-Single Skin', 'FRP-Sandwich'].includes(context.material)) {
      const I: number = ((26 * Math.pow(KCS, 1.5) * bottomPressureS * context.s * Math.pow(context.lu, 3)) / (0.05 * context.eio)) * 1e-11
      return I
    }
    return null
  }

  return {
    pbmdValues,
    pbmpValues,
    AW,
    SM,
    SecondI,
    bottomPressureS,
    bottomPlating,
    minHullThickness
  }
}
