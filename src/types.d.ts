export type MaterialType = 'Acero' | 'Aluminio' | 'FRP-Single Skin' | 'FRP-Sandwich'
export type CategoryType = 'Oceano' | 'Offshore' | 'Inshore'

export interface DesignStressesPlating {
  sigmaDp: number
  sigmaDtp: number
  sigmaDcp: number
  tauDp: number
}

export interface DesignStressesStiffeners {
  sigmaD: number
  tauDs: number
}

export interface CalculateKLResult {
  kLp: number
  kLs: number
}

export interface CalculateKRResult {
  kRp: number
  kRs: number
}

export interface CalculateADResult {
  ADp: number
  ADs: number
}

export interface CalculateKARResult {
  kARp: number
  kARs: number
}

export interface CalculatePBMDResult {
  PBMDp: number
  PBMDs: number
}

export interface CalculatePBMPResult {
  PBMPp: number
  PBMPs: number
}

export interface PlatingFactors {
  A: number
  k1: number
  k2: number
  k3: number
  k4: number
  k5: number
  k6: number
  k7: number
  k8: number
}

export interface ScantlingsCalculations {
  nCG: number
  kDC: number
  designStressesPlating: DesignStressesPlating
  designStressesStiffeners: DesignStressesStiffeners
  calculateKL: CalculateKLResult
  calculateKR: CalculateKRResult
  calculateAD: CalculateADResult
  calculateKAR: CalculateKARResult
  calculatePBMD: CalculatePBMDResult
  calculatePBMP: CalculatePBMPResult
  calculatePlatingFactors: PlatingFactors
  calculateKC: number
  calculateKSHC: number
  calculateKCS: number
  calculateAW: number
  calculateSM: number
  calculateSecondI: number | null
}

export interface PDMType {
  PDM_MIN: number
  PDM_BASE: number
  PDMp: number
  PDMs: number
}

export interface AWType {
  AW: number
}

export interface SMType {
  SM: number
}

export interface SecondIType {
  I: number | null
}

export interface ReturnPlatingType {
  t: number | undefined
  SM0: number | undefined
  SM1: number | undefined
  I: number | undefined
  EI: number | undefined
}

export interface MinHullThicknessType {
  tMin: number
  wMin: number
  wos: number
  wis: number
}

interface UseBottomCalculatorReturnType {
  pbmdValues: CalculatePBMDResult
  pbmpValues: CalculatePBMPResult
  AW: number
  SM: number
  SecondI: number | null
  bottomPressureS: number
  bottomPlating: ReturnPlatingType
  minHullThickness: MinHullThicknessType
}

interface UseCraftCalculatorReturnType {
  nCG: number
  kDC: number
  designStressesPlating: DesignStressesPlating
  designStressesStiffeners: DesignStressesStiffeners
  calculateKL: CalculateKLResult
  calculateKR: CalculateKRResult
  calculateAD: CalculateADResult
  calculateKAR: CalculateKARResult
  calculatePlatingFactors: PlatingFactors
  KC: number
  KSHC: number
  KCS: number
}
