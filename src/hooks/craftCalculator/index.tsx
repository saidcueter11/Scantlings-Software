import { useEffect, useState } from 'react'
import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { type CalculateADResult, type CalculateKARResult, type CalculateKLResult, type CalculateKRResult, type DesignStressesPlating, type DesignStressesStiffeners, type PlatingFactors } from '../../types'

const initialPlatingFactors: PlatingFactors = {
  A: 0,
  k1: 0,
  k2: 0,
  k3: 0,
  k4: 0,
  k5: 0,
  k6: 0,
  k7: 0,
  k8: 0
}

const initialDesignStressesPlating: DesignStressesPlating = {
  sigmaDp: 0,
  sigmaDtp: 0,
  sigmaDcp: 0,
  tauDp: 0
}

const initialDesignStressesStiffeners: DesignStressesStiffeners = {
  sigmaD: 0,
  tauDs: 0
}

export const useCraftCalculator = () => {
  const context = useScantlingsContext()

  const [nCG, setNCG] = useState<number>(0)
  const [kDC, setKDC] = useState<number>(0)
  const [designStressesPlating, setDesignStressesPlating] = useState<DesignStressesPlating>(initialDesignStressesPlating)
  const [designStressesStiffeners, setDesignStressesStiffeners] = useState<DesignStressesStiffeners>(initialDesignStressesStiffeners)
  const [klValues, setKLValues] = useState<CalculateKLResult>({ kLp: 0, kLs: 0 })
  const [krValues, setKRValues] = useState<CalculateKRResult>({ kRp: 0, kRs: 0 })
  const [adValues, setADValues] = useState<CalculateADResult>({ ADp: 0, ADs: 0 })
  const [karValues, setKARValues] = useState<CalculateKARResult>({ kARp: 0, kARs: 0 })
  const [platingFactors, setPlatingFactors] = useState<PlatingFactors>(initialPlatingFactors)
  const [KC, setCalculateKC] = useState<number>(0)
  const [KSHC, setCalculateKSHC] = useState<number>(0)
  const [KCS, setCalculateKCS] = useState<number>(0)

  useEffect(() => {
    setNCG(calculateNcg())
    setKDC(calculateKDC())
    setDesignStressesPlating(calculateDesignStressesPlating())
    setDesignStressesStiffeners(calculateDesignStressesStiffeners())
    setKLValues(calculateKL())
    setKRValues(calculateKR())
    setADValues(calculateAD())
    setKARValues(calculateKAR())
    setPlatingFactors(calculatePlatingFactors())
    setCalculateKC(calculateKC())
    setCalculateKSHC(calculateKSHC())
    setCalculateKCS(calculateKCS())
  }, [context])

  const calculateNcg = (): number => {
    let calculatedNCG = 0.32 * ((context.LWL / (10 * context.BC)) + 0.084) * (50 - context.B04) * ((Math.pow(context.V, 2) * Math.pow(context.BC, 2)) / context.mLDC)
    if (calculatedNCG > 3) {
      calculatedNCG = (0.5 * context.V) / Math.pow(context.mLDC, 0.17)
    }
    return calculatedNCG
  }

  const calculateKDC = (): number => {
    let calculatedKDC = 0.4
    switch (context.category) {
      case 'Oceano':
        calculatedKDC = 1
        break
      case 'Offshore':
        calculatedKDC = 0.8
        break
      case 'Inshore':
        calculatedKDC = 0.6
        break
      default:
        break
    }
    return calculatedKDC
  }

  const calculateDesignStressesPlating = (): DesignStressesPlating => {
    let sigmaDp: number = 0
    let sigmaDtp: number = 0
    let sigmaDcp: number = 0
    let tauDp: number = 0

    if (context.material === 'Acero' || context.material === 'Aluminio') {
      sigmaDp = Math.min(0.6 * context.sigmaU, 0.9 * context.sigmaY)
    } else if (context.material === 'FRP-Single Skin') {
      sigmaDp = 0.5 * context.sigmaUf
    } else if (context.material === 'FRP-Sandwich') {
      sigmaDtp = 0.5 * context.sigmaUt
      sigmaDcp = 0.5 * context.sigmaUc

      if (context.LH < 10) {
        tauDp = Math.max(0.25, context.tauNu * 0.5)
      } else if (context.LWL >= 10 && context.LWL <= 15) {
        tauDp = Math.max(0.25 + 0.03 * (context.LH - 10), context.tauNu * 0.5)
      } else {
        tauDp = Math.max(0.40, context.tauNu * 0.5)
      }
    } else {
      throw new Error(`Material '${context.material}' no reconocido`)
    }

    return {
      sigmaDp,
      sigmaDtp,
      sigmaDcp,
      tauDp
    }
  }

  const calculateDesignStressesStiffeners = (): DesignStressesStiffeners => {
    let sigmaD: number = 0
    let tauDs: number = 0

    if (context.material === 'Aluminio') {
      sigmaD = 0.7 * context.sigmaY
      tauDs = Math.max(0.58 * context.sigmaY, 0.4 * context.sigmaY)
    } else if (context.material === 'Acero') {
      sigmaD = 0.8 * context.sigmaY
      tauDs = Math.max(0.58 * context.sigmaY, 0.45 * context.sigmaY)
    } else if (['FRP-Single Skin', 'FRP-Sandwich'].includes(context.material)) {
      sigmaD = Math.max(0.5 * context.sigmaUt, 0.5 * context.sigmaUc)
      tauDs = 0.5 * context.tauU
    } else {
      throw new Error(`Material '${context.material}' no reconocido`)
    }

    return { sigmaD, tauDs }
  }

  const calculateKL = (): CalculateKLResult => {
    const xLWLp: number = context.xp / context.LWL
    let kLp: number = 0
    if (xLWLp > 0.6) {
      kLp = 1
    } else {
      kLp = ((1 - 0.167 * calculateNcg()) / 0.6) * xLWLp + 0.167 * calculateNcg()
    }

    const xLWLs: number = context.xs / context.LWL
    let kLs: number = 0
    if (xLWLs > 0.6) {
      kLs = 1
    } else {
      kLs = ((1 - 0.167 * calculateNcg()) / 0.6) * xLWLs + 0.167 * calculateNcg()
    }

    return { kLp, kLs }
  }

  const calculateKR = (): CalculateKRResult => {
    let kRp = 0
    let kRs = 0

    if (context.type === 'Displacement') {
      kRp = 1.5 - 3e-10 - 4 * context.b
      kRs = 1 - 2e-4 * context.lu
    }

    if (context.type === 'Planning') {
      kRp = kRs = 1
    }

    return { kRp, kRs }
  }

  const calculateAD = (): CalculateADResult => {
    const ADp = Math.min((context.l * context.b) * 1e-6, 2.5 * Math.pow(context.b, 2) * 1e-6)
    const ADs = Math.max((context.lu * context.s) * 1e-6, 0.33 * Math.pow(context.lu, 2) * 1e-6)
    return { ADp, ADs }
  }

  const calculateKAR = (): CalculateKARResult => {
    const kARValues = calculateKR()
    const ADValues = calculateAD()
    const kARp = Math.max(Math.min((kARValues.kRp * 0.1 * Math.pow(context.mLDC, 0.15)) / Math.pow(ADValues.ADp, 0.3), 1), 0.25)
    const kARs = Math.max(Math.min((kARValues.kRs * 0.1 * Math.pow(context.mLDC, 0.15)) / Math.pow(ADValues.ADs, 0.3), 1), 0.25)

    return { kARp, kARs }
  }

  const calculateKC = (): number => {
    const cb = context.c / context.b
    if (cb < 0.03) {
      return 1
    }
    if (cb >= 0.03 && cb <= 0.18) {
      return (1.1 - (3.33 * context.c) / context.b)
    }
    return 0.5
  }

  const calculatePlatingFactors = (): PlatingFactors => {
    let k2: number = 0
    let k3: number = 0
    let k5: number = 0
    let k6: number = 0
    let k7: number = 0
    let k8: number = 0

    const A = (['Acero', 'Aluminio'].includes(context.material)) ? 1 : 1.5
    const k1 = 0.017

    const ar: number = context.l / context.b
    const lib: number[] = [2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0]
    const k2Values: number[] = [0.497, 0.493, 0.487, 0.479, 0.468, 0.454, 0.436, 0.412, 0.383, 0.349, 0.308]
    const k3Values: number[] = [0.028, 0.027, 0.027, 0.026, 0.025, 0.024, 0.023, 0.021, 0.019, 0.016, 0.014]

    // Comparing with tolerance
    const arIndex = lib.findIndex(val => Math.abs(ar - val) < 1e-9)
    if (arIndex !== -1) {
      k2 = k2Values[arIndex]
      k3 = k3Values[arIndex]
    } else if (ar > 2) {
      k2 = 0.5
      k3 = 0.5
    } else {
      k2 = Math.min(Math.max((0.271 * Math.pow(ar, 2) + 0.910 * ar - 0.554) / (Math.pow(ar, 2) - 0.313 * ar + 1.351), 0.308), 0.5)
      k3 = Math.min(Math.max((0.027 * Math.pow(ar, 2) - 0.029 * ar + 0.011) / (Math.pow(ar, 2) - 1.463 * ar + 1.108), 0.014), 0.028)
    }

    const k4 = 1

    if (context.material === 'Acero') {
      k5 = Math.sqrt(240 / context.sigmaY)
      k7 = 0.015
      k8 = 0.08
    } else if (context.material === 'Aluminio') {
      k5 = Math.sqrt(125 / context.sigmaY)
      k7 = 0.02
      k8 = 0.1
    }
    // esto no esta terminado

    if (['FRP-Single Skin', 'FRP-Sandwich'].includes(context.material)) {
      if (context.skin === 'Fibra de vidrio E con filamentos cortados') {
        k5 = 1.0
      } else if (context.skin === 'Fibra de vidrio tejida') {
        k5 = 0.9
      } else if (context.skin === 'Fibra tejida de carbono, aramida(kevlar) o híbrida') {
        k5 = 0.7
      }

      k6 = 1
      k7 = 0.03
      k8 = 0.15
    }

    return { A, k1, k2, k3, k4, k5, k6, k7, k8 }
  }

  const calculateKSHC = (): number => {
    const ar: number = context.l / context.b
    const lib: number[] = [4.0, 3.0, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0]
    const kSHCValues: number[] = [0.500, 0.493, 0.463, 0.459, 0.453, 0.445, 0.435, 0.424, 0.410, 0.395, 0.378, 0.360, 0.339]

    if (ar <= 2) {
      return 0.035 + 0.394 * ar - 0.09 * Math.pow(ar, 2)
    } else if (ar > 4) {
      return 0.500
    } else {
      // Interpolation
      for (let i = 0; i < lib.length - 1; i++) {
        if (lib[i] >= ar && ar > lib[i + 1]) {
          const x1: number = lib[i]
          const y1: number = kSHCValues[i]
          const x2: number = lib[i + 1]
          const y2: number = kSHCValues[i + 1]

          return y1 + (y2 - y1) / (x2 - x1) * (ar - x1)
        }
      }
      // In case a value wasn't returned in the previous loop
      return 0.500
    }
  }

  const calculateKCS = (): number => {
    const culu: number = context.cu / context.lu

    if (culu <= 0.03) {
      return 1
    } else if (culu > 0.03 && culu <= 0.18) {
      return 1.1 - 3.33 * culu
    } else {
      return 0.5
    }
  }

  return {
    nCG,
    kDC,
    designStressesPlating,
    designStressesStiffeners,
    calculateKL: klValues,
    calculateKR: krValues,
    calculateAD: adValues,
    calculateKAR: karValues,
    calculatePlatingFactors: platingFactors,
    KC,
    KSHC,
    KCS
  }
}
