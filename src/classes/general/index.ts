import { type ScantlingsContextType, useScantlingsContext } from '../../Context/ScantlingsContext'
import { calculateKDC, calculateNcg, designStressesStiffeners } from '../../utils/craft'

export class SharedZoneValues {
  context: ScantlingsContextType
  nCG: number
  kLp: number
  kLs: number
  kRp: number
  kRs: number
  ADp: number
  ADs: number
  kARp: number
  kARs: number
  PBMDp: number
  PBMDs: number
  PBMPp: number
  PBMPs: number
  kC: number
  kSHC: number

  constructor () {
    this.context = useScantlingsContext()
    this.nCG = calculateNcg()
    this.kLp = this.calculateKL().kLp
    this.kLs = this.calculateKL().kLs
    this.kRp = this.calculateKR().kRp
    this.kRs = this.calculateKR().kRs
    this.ADp = this.calculateAD().ADp
    this.ADs = this.calculateAD().ADs
    this.kARp = this.calculateKAR().kARp
    this.kARs = this.calculateKAR().kARs
    this.PBMDp = this.calculatePBMD().PBMDp
    this.PBMDs = this.calculatePBMD().PBMDs
    this.PBMPp = this.calculatePBMP().PBMPp
    this.PBMPs = this.calculatePBMP().PBMPs
    this.kC = this.calculateKC()
    this.kSHC = this.calculateKSHC()
  }

  calculateKL () {
    const {
      xp,
      LWL,
      xs
    } = this.context
    const xLWLp: number = xp / LWL
    let kLp: number

    if (xLWLp > 0.6) {
      kLp = 1
    } else {
      kLp = ((1 - 0.167 * this.nCG) / 0.6) * xLWLp + 0.167 * this.nCG
    }

    const xLWLs: number = xs / LWL
    let kLs: number

    if (xLWLs > 0.6) {
      kLs = 1
    } else {
      kLs = ((1 - 0.167 * this.nCG) / 0.6) * xLWLs + 0.167 * this.nCG
    }

    return { kLp, kLs }
  }

  calculateKR () {
    const {
      type,
      b,
      lu
    } = this.context
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

  calculateAD () {
    const {
      l,
      b,
      lu,
      s
    } = this.context
    const ADp = Math.min((l * b) * 1e-6, 2.5 * Math.pow(b, 2) * 1e-6)
    const ADs = Math.max((lu * s) * 1e-6, 0.33 * Math.pow(lu, 2) * 1e-6)
    return { ADp, ADs }
  }

  calculateKAR () {
    const _kARp = (this.kRp * 0.1 * Math.pow(this.context.mLDC, 0.15)) / Math.pow(this.ADp, 0.3)
    const _kARs = (this.kRs * 0.1 * Math.pow(this.context.mLDC, 0.15)) / Math.pow(this.ADs, 0.3)

    const kARp = Math.max(Math.min(_kARp, 1), 0.25)
    const kARs = Math.max(Math.min(_kARs, 1), 0.25)

    return { kARp, kARs }
  }

  calculatePBMD () {
    const kDC = calculateKDC()

    const PBM_MIN = 0.45 * Math.pow(this.context.mLDC, 0.33) + (0.9 * this.context.LWL * kDC)

    const PBMD_BASE = 2.4 * Math.pow(this.context.mLDC, 0.33) + 20
    const PBMDp = Math.max(PBMD_BASE * this.kARp * kDC * this.kLp, PBM_MIN)
    const PBMDs = Math.max(PBMD_BASE * this.kARs * kDC * this.kLs, PBM_MIN)

    return { PBMDp, PBMDs }
  }

  calculatePBMP () {
    const nCG = calculateNcg()
    const kDC = calculateKDC()
    const PBM_MIN = 0.45 * Math.pow(this.context.mLDC, 0.33) + (0.9 * this.context.LWL * kDC)

    const PBMP_BASE = ((0.1 * this.context.mLDC) / (this.context.LWL * this.context.BC)) * (1 + Math.pow(kDC, 0.5) * nCG)
    const PBMPp = Math.max(PBMP_BASE * this.kARp * this.kLp, PBM_MIN)
    const PBMPs = Math.max(PBMP_BASE * this.kARs * this.kLs, PBM_MIN)

    return { PBMPp, PBMPs }
  }

  calculatePlatingFactors () {
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

    A = (['Acero', 'Aluminio'].includes(this.context.material)) ? 1 : 1.5
    k1 = 0.017

    const ar: number = this.context.l / this.context.b
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

    if (this.context.material === 'Acero') {
      k5 = Math.sqrt(240 / this.context.sigmaY)
      k7 = 0.015
      k8 = 0.08
    } else if (this.context.material === 'Aluminio') {
      k5 = Math.sqrt(125 / this.context.sigmaY)
      k7 = 0.02
      k8 = 0.1
    }
    // esto no esta terminado

    if (['FRP-Single Skin', 'FRP-Sandwich'].includes(this.context.material)) {
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

  calculateKC () {
    const cb = this.context.c / this.context.b
    if (cb < 0.03) {
      return 1
    }
    if (cb > 0.03 || cb < 0.18) {
      return (1.1 - (3.33 * this.context.c) / this.context.b)
    }

    return 0.5
  }

  calculateKSHC (): number {
    const ar: number = this.context.l / this.context.b
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

  calculateKCS (): number {
    const culu: number = this.context.cu / this.context.lu

    if (culu <= 0.03) {
      return 1
    } else if (culu > 0.03 && culu <= 0.18) {
      return 1.1 - 3.33 * culu
    } else {
      return 0.5
    }
  }

  calculateAW (): number {
    const kSA = 5
    const bottomPressureS = Math.max(this.PBMDp, this.PBMPs)
    const { tauDs } = designStressesStiffeners()
    const AW: number = ((kSA * bottomPressureS * this.context.s * this.context.lu) / (tauDs)) * 1e-6
    return AW
  }

  calculateSM (): number {
    const bottomPressureS = Math.max(this.PBMDs, this.PBMPs)
    const { sigmaD } = designStressesStiffeners()

    const SM: number = ((83.33 * this.calculateKCS() * bottomPressureS * this.context.s * Math.pow(this.context.lu, 2)) / (sigmaD)) * 1e-9
    return SM
  }

  calculateSecondI (): number | null {
    const bottomPressureS = Math.max(this.PBMDs, this.PBMPs)

    if (['FRP-Single Skin', 'FRP-Sandwich'].includes(this.context.material)) {
      const I: number = ((26 * Math.pow(this.calculateKCS(), 1.5) * bottomPressureS * this.context.s * Math.pow(this.context.lu, 3)) / (0.05 * this.context.eio)) * 1e-11
      return I
    }
    return null
  }
}
