import { useScantlingsContext } from '../../Context/ScantlingsContext'

const { eio, cu, c, LWL, BC, B04, V, mLDC, category, material, LH, sigmaU, sigmaY, sigmaUf, sigmaUt, sigmaUc, tauNu, tauU, xp, xs, type, lu, b, l, s } = useScantlingsContext()

export function calculateNcg () {
  let nCG = 0.32 * ((LWL / (10 * BC)) + 0.084) * (50 - B04) * ((Math.pow(V, 2) * Math.pow(BC, 2)) / mLDC)
  if (nCG > 3) { nCG = (0.5 * V) / Math.pow(mLDC, 0.17) }
  return nCG
}

export function calculateKDC () {
  let kDC = 0.4
  if (category === 'Oceano') { kDC = 1 }
  if (category === 'Offshore') { kDC = 0.8 }
  if (category === 'Inshore') { kDC = 0.6 }

  return kDC
}

export function designStressesPlating () {
  let sigmaDp: number | null = null
  let sigmaDtp: number | null = null
  let sigmaDcp: number | null = null
  let tauDp: number | null = null

  if (material === 'Acero' || material === 'Aluminio') {
    sigmaDp = Math.min(0.6 * sigmaU, 0.9 * sigmaY)
  } else if (material === 'FRP-Single Skin') {
    sigmaDp = 0.5 * sigmaUf
  } else if (material === 'FRP-Sandwich') {
    sigmaDtp = 0.5 * sigmaUt
    sigmaDcp = 0.5 * sigmaUc

    if (LH < 10) {
      tauDp = Math.max(0.25, tauNu * 0.5)
    } else if (LWL >= 10 && LWL <= 15) {
      tauDp = Math.max(0.25 + 0.03 * (LH - 10), tauNu * 0.5)
    } else {
      tauDp = Math.max(0.40, tauNu * 0.5)
    }
  } else {
    throw new Error(`Material '${material}' no reconocido`)
  }

  return {
    sigmaDp,
    sigmaDtp,
    sigmaDcp,
    tauDp
  }
}

export function designStressesStiffeners () {
  let sigmaD: number | null = null
  let tauDs: number | null = null

  if (material === 'Aluminio') {
    sigmaD = 0.7 * sigmaY
    tauDs = Math.max(0.58 * sigmaY, 0.4 * sigmaY)
  } else if (material === 'Acero') {
    sigmaD = 0.8 * sigmaY
    tauDs = Math.max(0.58 * sigmaY, 0.45 * sigmaY)
  } else if (['FRP-Single Skin', 'FRP-Sandwich'].includes(material)) {
    sigmaD = Math.max(0.5 * sigmaUt, 0.5 * sigmaUc)
    tauDs = 0.5 * tauU
  } else {
    throw new Error(`Material '${material}' no reconocido`)
  }

  return { sigmaD, tauDs }
}

export function calculateKL () {
  const xLWLp: number = xp / LWL
  let kLp: number

  if (xLWLp > 0.6) {
    kLp = 1
  } else {
    kLp = ((1 - 0.167 * calculateNcg()) / 0.6) * xLWLp + 0.167 * calculateNcg()
  }

  const xLWLs: number = xs / LWL
  let kLs: number

  if (xLWLs > 0.6) {
    kLs = 1
  } else {
    kLs = ((1 - 0.167 * calculateNcg()) / 0.6) * xLWLs + 0.167 * calculateNcg()
  }

  return { kLp, kLs }
}

export function calculateKR () {
  let kRp = 0
  let kRs = 0

  if (type === 'Displacement') {
    kRp = 1.5 - 3e10 - 4 * b
    kRs = 1 - 2e-4 * lu
  }

  if (type === 'Planning') {
    kRp = kRs = 1
  }

  return { kRp, kRs }
}

export function calculateAD () {
  const ADp = Math.min((l * b) * 1e-6, 2.5 * Math.pow(b, 2) * 1e-6)
  const ADs = Math.max((lu * s) * 1e-6, 0.33 * Math.pow(lu, 2) * 1e-6)
  return { ADp, ADs }
}

export function calculateKAR () {
  const _kARp = (calculateKR().kRp * 0.1 * Math.pow(mLDC, 0.15)) / Math.pow(calculateAD().ADp, 0.3)
  const _kARs = (calculateKR().kRs * 0.1 * Math.pow(mLDC, 0.15)) / Math.pow(calculateAD().ADs, 0.3)

  const kARp = Math.max(Math.min(_kARp, 1), 0.25)
  const kARs = Math.max(Math.min(_kARs, 1), 0.25)

  return { kARp, kARs }
}

export function calculatePBMD () {
  const kDC = calculateKDC()

  const PBM_MIN = 0.45 * Math.pow(mLDC, 0.33) + (0.9 * LWL * kDC)

  const PBMD_BASE = 2.4 * Math.pow(mLDC, 0.33) + 20
  const PBMDp = Math.max(PBMD_BASE * calculateKAR().kARp * kDC * calculateKL().kLp, PBM_MIN)
  const PBMDs = Math.max(PBMD_BASE * calculateKAR().kARs * kDC * calculateKL().kLs, PBM_MIN)
  return { PBMDp, PBMDs }
}

export function calculatePBMP () {
  const nCG = calculateNcg()
  const kDC = calculateKDC()

  const PBM_MIN = 0.45 * Math.pow(mLDC, 0.33) + (0.9 * LWL * kDC)

  const PBMP_BASE = ((0.1 * mLDC) / (LWL * BC)) * (1 + Math.pow(kDC, 0.5) * nCG)
  const PBMPp = Math.max(PBMP_BASE * calculateKAR().kARp * calculateKL().kLp, PBM_MIN)
  const PBMPs = Math.max(PBMP_BASE * calculateKAR().kARs * calculateKL().kLs, PBM_MIN)

  return { PBMPp, PBMPs }
}

export function calculatePlatingFactors () {
  let A: number | null = null
  let k1: number | null = null
  let k2: number | null = null
  let k3: number | null = null
  let k4: number | null = null
  let k5: number | null = null
  let k6: number | null = null
  let k7: number | null = null
  let k8: number | null = null

  const skin: string = ''

  A = (['Acero', 'Aluminio'].includes(material)) ? 1 : 1.5
  k1 = 0.017

  const ar: number = l / b
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

  k4 = 1

  if (material === 'Acero') {
    k5 = Math.sqrt(240 / sigmaY)
    k7 = 0.015
    k8 = 0.08
  } else if (material === 'Aluminio') {
    k5 = Math.sqrt(125 / sigmaY)
    k7 = 0.02
    k8 = 0.1
  }
  // esto no esta terminado

  if (['FRP-Single Skin', 'FRP-Sandwich'].includes(material)) {
    if (skin === 'Fibra de vidrio E con filamentos cortados') {
      k5 = 1.0
    } else if (skin === 'Fibra de vidrio tejida') {
      k5 = 0.9
    } else if (skin === 'Fibra tejida de carbono, aramida(kevlar) o híbrida') {
      k5 = 0.7
    }

    k6 = 1
    k7 = 0.03
    k8 = 0.15
  }

  return { A, k1, k2, k3, k4, k5, k6, k7, k8 }
}

export function calculateKC () {
  const cb = c / b
  if (cb < 0.03) {
    return 1
  }
  if (cb > 0.03 || cb < 0.18) {
    return (1.1 - (3.33 * c) / b)
  }

  return 0.5
}

export function calculateKSHC (): number {
  const ar: number = l / b
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

export function calculateKCS (): number {
  const culu: number = cu / lu

  if (culu <= 0.03) {
    return 1
  } else if (culu > 0.03 && culu <= 0.18) {
    return 1.1 - 3.33 * culu
  } else {
    return 0.5
  }
}

export function calculateAW (): number {
  const kSA = 5
  const bottomPressureS = Math.max(calculatePBMD().PBMDs, calculatePBMP().PBMPs)
  const { tauDs } = designStressesStiffeners()
  const AW: number = ((kSA * bottomPressureS * s * lu) / (tauDs)) * 1e-6
  return AW
}

export function calculateSM (): number {
  const bottomPressureS = Math.max(calculatePBMD().PBMDs, calculatePBMP().PBMPs)
  const { sigmaD } = designStressesStiffeners()

  const SM: number = ((83.33 * calculateKCS() * bottomPressureS * s * Math.pow(lu, 2)) / (sigmaD)) * 1e-9
  return SM
}

export function calculateSecondI (): number | null {
  const bottomPressureS = Math.max(calculatePBMD().PBMDs, calculatePBMP().PBMPs)

  if (['FRP-Single Skin', 'FRP-Sandwich'].includes(material)) {
    const I: number = ((26 * Math.pow(calculateKCS(), 1.5) * bottomPressureS * s * Math.pow(lu, 3)) / (0.05 * eio)) * 1e-11
    return I
  }
  return null
}
