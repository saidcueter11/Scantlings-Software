import { useScantlingsContext } from '../../Context/ScantlingsContext'

const { LWL, BC, B04, V, mLDC, category, material, LH, sigmaU, sigmaY, sigmaUf, sigmaUt, sigmaUc, tauNu, tauU } = useScantlingsContext()

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
