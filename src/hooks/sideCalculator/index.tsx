import { useEffect, useState } from 'react'
import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { useBottomCalculator } from '../bottomCalculator'
import { useCraftCalculator } from '../craftCalculator'
import { type ReturnPlatingType } from '../../types'

const initialSidePlating: ReturnPlatingType = {
  t: undefined,
  SM0: undefined,
  SM1: undefined,
  I: undefined,
  EI: undefined
}

export const useSideCalculator = () => {
  const [AW, setAW] = useState(0)
  const [SM, setSM] = useState(0)
  const [SecondI, setSecondI] = useState<number | null>(null)
  const [sidePlating, setSidePlating] = useState<ReturnPlatingType>(initialSidePlating)

  const { mLDC, LWL, BC, material, b, eio, s, lu, z, hp, hs } = useScantlingsContext()
  const context = useScantlingsContext()
  const {
    kDC,
    calculateKAR: { kARp, kARs },
    calculateKL: { kLp, kLs },
    nCG,
    KC,
    calculatePlatingFactors: { k2, k1, k3 },
    KSHC,
    designStressesPlating: { sigmaDcp, sigmaDp, sigmaDtp, tauDp },
    KCS,
    designStressesStiffeners: { sigmaD, tauDs }
  } = useCraftCalculator()
  const { minHullThickness: { tMin } } = useBottomCalculator()

  const PSM_MIN = 0.45 * Math.pow(mLDC, 0.33) + (0.9 * LWL * kDC)
  const PDM_BASE = (0.9 * LWL) + 14.6
  const sidePressureP = Math.max(calculatePSMD().PSMDp, calculatePSMP().PSMPp)
  const sidePressureS = Math.max(calculatePSMD().PSMDs, calculatePSMP().PSMPs)

  useEffect(() => {
    setAW(calculateAW())
    setSM(calculateSM())
    setSecondI(calculateSecondI())
    setSidePlating(calculateSidePlating())
  }, [context])

  function calculateKZ () {
    const kZp = (z - hp) / z
    const kZs = (z - hs) / z
    return { kZp, kZs }
  }

  function calculatePSMD () {
    const { kZp, kZs } = calculateKZ()
    const PBMD_BASE: number = 2.4 * Math.pow(mLDC, 0.33) + 20
    const PSMDp: number = Math.max(PSM_MIN, (PDM_BASE + kZp * (PBMD_BASE - PDM_BASE)) * kARp * kDC * kLp)
    const PSMDs: number = Math.max(PSM_MIN, (PDM_BASE + kZs * (PBMD_BASE - PDM_BASE)) * kARs * kDC * kLs)

    return { PSMDp, PSMDs }
  }

  function calculatePSMP () {
    const kZp = 0
    const kZs = 0
    const PBMP_BASE: number = ((0.1 * mLDC) / (LWL * BC)) * (1 + Math.pow(kDC, 0.5) * nCG)
    const PSMPp: number = Math.max(PSM_MIN, (PDM_BASE + kZp * (0.25 * PBMP_BASE - PDM_BASE)) * kARp * kDC * kLp)
    const PSMPs: number = Math.max(PSM_MIN, (PDM_BASE + kZs * (0.25 * PBMP_BASE - PDM_BASE)) * kARs * kDC * kLs)

    return { PSMPp, PSMPs }
  }

  function calculateSidePlating () {
    let t: number = 0
    let SM0: number = 0
    let SM1: number = 0
    let I: number = 0
    let EI: number = 0
    let adjustedB: number = 0

    switch (material) {
      case 'Acero':
      case 'Aluminio':
        t = Math.max(tMin, b * KC * Math.sqrt((sidePressureP * k2) / (1000 * sigmaDp)))
        break
      case 'FRP-Single Skin':
        t = b * KC * Math.sqrt((sidePressureP * k2) / (1000 * sigmaDp))
        break
      case 'FRP-Sandwich':
        adjustedB = Math.min(b, 330 * LWL)
        SM0 = Math.pow(adjustedB, 2) * Math.pow(KC, 2) * sidePressureP * k2 / (600000 * sigmaDtp)
        SM1 = Math.pow(adjustedB, 2) * Math.pow(KC, 2) * sidePressureP * k2 / (600000 * sigmaDcp)
        I = Math.pow(adjustedB, 3) * Math.pow(KC, 3) * sidePressureP * k3 / (12000000 * k1 * eio)
        EI = Math.pow(adjustedB, 3) * Math.pow(KC, 3) * sidePressureP * k3 / (1200000 * k1)
        t = Math.sqrt(KC) * (KSHC * sidePressureP * adjustedB) / (1000 * tauDp)
        break
      default:
        throw new Error(`Material '${material}' no reconocido`)
    }

    return { t, SM0, SM1, I, EI }
  }

  function calculateAW () {
    const kSA = 5
    const AW: number = ((kSA * sidePressureS * s * lu) / tauDs) * 1e-6
    return AW
  }

  function calculateSM () {
    const SM: number = ((83.33 * KCS * sidePressureS * s * Math.pow(lu, 2)) / sigmaD) * 1e-9
    return SM
  }

  function calculateSecondI (): number | null {
    if (material === 'FRP-Single Skin' || material === 'FRP-Sandwich') {
      const I: number = ((26 * Math.pow(KCS, 1.5) * sidePressureS * s * Math.pow(lu, 3)) / (0.05 * eio)) * 1e-11
      return I
    }
    return null
  }

  return {
    AW,
    SM,
    SecondI,
    sidePlating
  }
}
