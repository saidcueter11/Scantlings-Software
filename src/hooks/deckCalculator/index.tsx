import { useEffect, useState } from 'react'
import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { useCraftCalculator } from '../craftCalculator'
import { type PDMType, type AWType, type SMType, type SecondIType, type ReturnPlatingType } from '../../types'

const initialPDM: PDMType = {
  PDM_MIN: 0,
  PDM_BASE: 0,
  PDMp: 0,
  PDMs: 0
}

const initialAW: AWType = {
  AW: 0
}

const initialSM: SMType = {
  SM: 0
}

const initialSecondI: SecondIType = {
  I: null
}

const initialDeckPlating: ReturnPlatingType = {
  t: undefined,
  SM0: undefined,
  SM1: undefined,
  I: undefined,
  EI: undefined
}

export const useDeckCalculator = () => {
  const { LWL, material, b, eio, s, lu } = useScantlingsContext()
  const context = useScantlingsContext()
  const { calculateKAR, kDC, KC, calculateKL, calculatePlatingFactors, designStressesPlating, designStressesStiffeners, KSHC, KCS } = useCraftCalculator()

  const [PDM, setPDM] = useState<PDMType>(initialPDM)
  const [AW, setAW] = useState<AWType>(initialAW)
  const [SM, setSM] = useState<SMType>(initialSM)
  const [SecondI, setSecondI] = useState<SecondIType>(initialSecondI)
  const [minThickness, setMinThickness] = useState<number>(0)
  const [deckPlating, setDeckPlating] = useState<ReturnPlatingType>(initialDeckPlating)

  useEffect(() => {
    setPDM(calculatePDM())
    setAW({ AW: calculateAW() })
    setSM({ SM: calculateSM() })
    setSecondI({ I: calculateSecondI() })
    setMinThickness(minDeckThickness())
    setDeckPlating(calculatedeckPlating())
  }, [context])

  const calculatePDM = (): PDMType => {
    const PDM_MIN = 5
    const PDM_BASE = 0.35 * LWL + 14.6
    const { kARs, kARp } = calculateKAR
    const { kLp, kLs } = calculateKL

    const PDMp = Math.max(PDM_MIN, PDM_BASE * kARp * kDC * kLp)
    const PDMs = Math.max(PDM_MIN, PDM_BASE * kARs * kDC * kLs)
    return { PDM_MIN, PDM_BASE, PDMp, PDMs }
  }

  function minDeckThickness (): number {
    let tMin: number
    switch (material) {
      case 'Acero':
        tMin = 1.5 + 0.07 * LWL
        break
      case 'Aluminio':
        tMin = 1.35 + 0.06 * LWL
        break
      case 'FRP-Single Skin':
      case 'FRP-Sandwich':
        tMin = calculatePlatingFactors.k5 * (1.45 + 0.14 * LWL)
        break
      case 'Wood':
      case 'plywood':
        tMin = 3.8 + 0.17 * LWL
        break
      default:
        throw new Error(`Material ${material} no reconocido`)
    }
    return tMin
  }

  function calculatedeckPlating () {
    let t: number | undefined
    let SM0: number | undefined
    let SM1: number | undefined
    let I: number | undefined
    let EI: number | undefined
    let adjustedB = 0

    const tMin = minDeckThickness()

    switch (material) {
      case 'Acero':
      case 'Aluminio':
        t = Math.max(tMin, b * KC * Math.sqrt((PDM.PDMp * calculatePlatingFactors.k2) / (1000 * designStressesPlating.sigmaDp)))
        break
      case 'FRP-Single Skin':
        t = b * KC * Math.sqrt((PDM.PDMp * calculatePlatingFactors.k2) / (1000 * designStressesPlating.sigmaDp))
        break
      case 'FRP-Sandwich':
        adjustedB = Math.min(b, 330 * LWL)
        SM0 = (Math.pow(adjustedB, 2) * Math.pow(KC, 2) * PDM.PDMp * calculatePlatingFactors.k2) / (600000 * designStressesPlating.sigmaDtp)
        SM1 = (Math.pow(adjustedB, 2) * Math.pow(KC, 2) * PDM.PDMp * calculatePlatingFactors.k2) / (600000 * designStressesPlating.sigmaDcp)
        I = (Math.pow(adjustedB, 3) * Math.pow(KC, 3) * PDM.PDMp * calculatePlatingFactors.k3) / (12000000 * calculatePlatingFactors.k1 * eio)
        EI = (Math.pow(adjustedB, 3) * Math.pow(KC, 3) * PDM.PDMp * calculatePlatingFactors.k3) / (12000000 * calculatePlatingFactors.k1)
        t = Math.sqrt(KC) * ((KSHC * PDM.PDMp * adjustedB) / (1000 * designStressesPlating.tauDp))
        break
      default:
        throw new Error(`Material '${material}' no reconocido`)
    }
    return { t, SM0, SM1, I, EI }
  }

  function calculateAW (): number {
    const kSA = 5
    const AW: number = ((kSA * PDM.PDMs * s * lu) / designStressesStiffeners.tauDs) * 1e-6
    return AW
  }

  function calculateSM (): number {
    const SM: number = ((83.33 * KCS * PDM.PDMs * s * Math.pow(lu, 2)) / designStressesStiffeners.sigmaD) * 1e-9
    return SM
  }

  function calculateSecondI (): number | null {
    if (material === 'FRP-Single Skin' || material === 'FRP-Sandwich') {
      const I: number = ((26 * Math.pow(KCS, 1.5) * PDM.PDMs * s * Math.pow(lu, 3)) / (0.05 * eio)) * 1e-11
      return I
    }
    return null
  }

  return {
    PDM,
    AW,
    SM,
    SecondI,
    minThickness,
    deckPlating
  }
}
