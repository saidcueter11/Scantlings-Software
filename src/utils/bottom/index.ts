import { useScantlingsContext } from '../../Context/ScantlingsContext'
import { calculateKDC, calculateNcg, designStressesPlating, designStressesStiffeners } from '../craft'

const {
  cu,
  xp,
  LWL,
  BC,
  V,
  mLDC,
  xs,
  type,
  b,
  lu,
  s,
  l,
  material,
  sigmaY,
  c,
  eio
} = useScantlingsContext()

function calculateKL () {
  const xLWLp: number = xp / LWL
  let kLp: number
  const nCG = calculateNcg()

  if (xLWLp > 0.6) {
    kLp = 1
  } else {
    kLp = ((1 - 0.167 * nCG) / 0.6) * xLWLp + 0.167 * nCG
  }

  const xLWLs: number = xs / LWL
  let kLs: number

  if (xLWLs > 0.6) {
    kLs = 1
  } else {
    kLs = ((1 - 0.167 * nCG) / 0.6) * xLWLs + 0.167 * nCG
  }

  return { kLp, kLs }
}

function calculateKR () {
  let kRp = 0
  let kRs = 0

  if (type === 'Displacement') {
    kRp = 1.5 - 3e10 - 4 * b
    kRs = 1 - 2e-4 * lu
  }

  if (type === 'Planning') { kRp = kRs = 1 }

  return { kRp, kRs }
}

function calculateAD () {
  const ADp = Math.min((l * b) * 1e-6, 2.5 * Math.pow(b, 2) * 1e-6)
  const ADs = Math.max((lu * s) * 1e-6, 0.33 * Math.pow(lu, 2) * 1e-6)
  return { ADp, ADs }
}

function calculateKAR () {
  const { kRp, kRs } = calculateKR()
  const { ADp, ADs } = calculateAD()

  const _kARp = (kRp * 0.1 * Math.pow(mLDC, 0.15)) / Math.pow(ADp, 0.3)
  const _kARs = (kRs * 0.1 * Math.pow(mLDC, 0.15)) / Math.pow(ADs, 0.3)

  const kARp = Math.max(Math.min(_kARp, 1), 0.25)
  const kARs = Math.max(Math.min(_kARs, 1), 0.25)

  return { kARp, kARs }
}

function calculatePBMD () {
  const { kARp, kARs } = calculateKAR()
  const { kLp, kLs } = calculateKL()
  const kDC = calculateKDC()

  const PBM_MIN = 0.45 * Math.pow(mLDC, 0.33) + (0.9 * LWL * kDC)

  const PBMD_BASE = 2.4 * Math.pow(mLDC, 0.33) + 20
  const PBMDp = Math.max(PBMD_BASE * kARp * kDC * kLp, PBM_MIN)
  const PBMDs = Math.max(PBMD_BASE * kARs * kDC * kLs, PBM_MIN)

  return { PBMDp, PBMDs }
}

function calculatePBMP () {
  const nCG = calculateNcg()
  const kDC = calculateKDC()
  const { kARp, kARs } = calculateKAR()
  const { kLp, kLs } = calculateKL()
  const PBM_MIN = 0.45 * Math.pow(mLDC, 0.33) + (0.9 * LWL * kDC)

  const PBMP_BASE = ((0.1 * mLDC) / (LWL * BC)) * (1 + Math.pow(kDC, 0.5) * nCG)
  const PBMPp = Math.max(PBMP_BASE * kARp * kLp, PBM_MIN)
  const PBMPs = Math.max(PBMP_BASE * kARs * kLs, PBM_MIN)
  return { PBMPp, PBMPs }
}

function calculatePlatingFactors () {
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

function calculateKC () {
  const cb = c / b
  if (cb < 0.03) { return 1 }
  if (cb > 0.03 || cb < 0.18) { return (1.1 - (3.33 * c) / b) }

  return 0.5
}

function calculateKSHC (): number {
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

function minHullThickness () {
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

function bottomPlating () {
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
    const adjusteB: number = Math.min(b, 330 * LWL)

    // Módulo de sección mínimo requerido de la piel o/i del sándwich de 1 cm de ancho
    SM_0 = sigmaDtp !== null ? (Math.pow(adjusteB, 2) * Math.pow(kC, 2) * bottomPressureP * k2) / (6e5 * sigmaDtp) : null
    SM_1 = sigmaDtp !== null ? (Math.pow(adjusteB, 2) * Math.pow(kC, 2) * bottomPressureP * k2) / (6e5 * sigmaDtp) : null

    // Segundo momento de inercia mínimo requerido para una lámina de sándwich de 1 cm de ancho
    I = (Math.pow(adjusteB, 3) * Math.pow(kC, 3) * bottomPressureP * k3) / (12e6 * k1 * eio)
    EI = (Math.pow(adjusteB, 3) * Math.pow(kC, 3) * bottomPressureP * k3) / (12e3 * k1)

    t = tauDp !== null ? Math.sqrt(kC) * ((kSHC * bottomPressureP * adjusteB) / (1000 * tauDp)) : null
  } else {
    throw new Error(`Material '${material}' no reconocido`)
  }

  return { t, SM_0, SM_1, I, EI }
}

function calculateKCS (): number {
  const culu: number = cu / lu

  if (culu <= 0.03) {
    return 1
  } else if (culu > 0.03 && culu <= 0.18) {
    return 1.1 - 3.33 * culu
  } else {
    return 0.5
  }
}

function calculateAW (): number {
  const kSA = 5
  const { PBMDs } = calculatePBMD()
  const { PBMPs } = calculatePBMP()
  const bottomPressureS = Math.max(PBMDs, PBMPs)
  const { tauDs } = designStressesStiffeners()
  const AW: number = ((kSA * bottomPressureS * s * lu) / (tauDs)) * 1e-6
  return AW
}

function calculateSM (): number {
  const { PBMDs } = calculatePBMD()
  const { PBMPs } = calculatePBMP()
  const bottomPressureS = Math.max(PBMDs, PBMPs)
  const { sigmaD } = designStressesStiffeners()

  const SM: number = ((83.33 * calculateKCS() * bottomPressureS * s * Math.pow(lu, 2)) / (sigmaD)) * 1e-9
  return SM
}

function calculateSecondI (): number | null {
  const { PBMDs } = calculatePBMD()
  const { PBMPs } = calculatePBMP()
  const bottomPressureS = Math.max(PBMDs, PBMPs)

  if (['FRP-Single Skin', 'FRP-Sandwich'].includes(material)) {
    const I: number = ((26 * Math.pow(calculateKCS(), 1.5) * bottomPressureS * s * Math.pow(lu, 3)) / (0.05 * eio)) * 1e-11
    return I
  }
  return null
}
