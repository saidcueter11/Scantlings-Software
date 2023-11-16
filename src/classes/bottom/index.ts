import { calculateKDC, designStressesPlating } from '../../utils/craft'
import { SharedZoneValues } from '../general'

export class BottomZone extends SharedZoneValues {
  minHullThickness () {
    let tMin: number | null = null
    let wMin: number | null = null
    let wos: number | null = null
    let wis: number | null = null

    const { A, k5, k7, k8, k4, k6 } = this.calculatePlatingFactors()
    const kDC = calculateKDC()

    if ((this.context.material === 'Acero' || this.context.material === 'Aluminio') && k5 !== null && k7 !== null && k8 !== null) {
      tMin = k5 * (A + k7 * this.context.V + k8 * Math.pow(this.context.mLDC, 0.33))
    } else if (this.context.material === 'FRP-Single Skin' && k5 !== null && k7 !== null && k8 !== null) {
      wMin = 0.43 * k5 * (A + k7 * this.context.V + k8 * Math.pow(this.context.mLDC, 0.33))
    } else if (this.context.material === 'FRP-Sandwich' && k5 !== null && k6 !== null) {
      wos = kDC * k4 * k5 * k6 * (0.1 * this.context.LWL + 0.15)
      wis = 0.7 * wos
    }

    return { tMin, wMin, wos, wis }
  }

  bottomPlating () {
    let t: number | null = null
    let SM_0: number | null = null
    let SM_1: number | null = null
    let I: number | null = null
    let EI: number | null = null

    const bottomPressureP = Math.max(this.PBMDp, this.PBMPp)
    const { k2, k3, k1 } = this.calculatePlatingFactors()
    const { sigmaDp, sigmaDtp, tauDp } = designStressesPlating()

    const { tMin } = this.minHullThickness()

    if (['Acero', 'Aluminio'].includes(this.context.material) && tMin !== null && k2 !== null && sigmaDp !== null) {
      t = Math.max(tMin, this.context.b * this.kC * Math.sqrt((bottomPressureP * k2) / (1000 * sigmaDp)))
    } else if (this.context.material === 'FRP-Single Skin' && sigmaDp !== null) {
      t = this.context.b * this.kC * Math.sqrt((bottomPressureP * k2) / (1000 * sigmaDp))
    } else if (this.context.material === 'FRP-Sandwich') {
      const adjustedB: number = Math.min(this.context.b, 330 * this.context.LWL)

      SM_0 = sigmaDtp !== null ? (Math.pow(adjustedB, 2) * Math.pow(this.kC, 2) * bottomPressureP * k2) / (6e5 * sigmaDtp) : null
      SM_1 = sigmaDtp !== null ? (Math.pow(adjustedB, 2) * Math.pow(this.kC, 2) * bottomPressureP * k2) / (6e5 * sigmaDtp) : null

      I = (Math.pow(adjustedB, 3) * Math.pow(this.kC, 3) * bottomPressureP * k3) / (12e6 * k1 * this.context.eio)
      EI = (Math.pow(adjustedB, 3) * Math.pow(this.kC, 3) * bottomPressureP * k3) / (12e3 * k1)

      t = tauDp !== null ? Math.sqrt(this.kC) * ((this.kSHC * bottomPressureP * adjustedB) / (1000 * tauDp)) : null
    } else {
      throw new Error(`Material '${this.context.material}' not recognized`)
    }

    return { t, SM_0, SM_1, I, EI }
  }
}
