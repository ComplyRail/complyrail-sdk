export enum VaspStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Revoked = 'Revoked',
}

export interface VaspEntry {
  address: string
  name: string
  jurisdiction: string
  publicKey: string
  status: VaspStatus
  addedAt: number
  expiresAt?: number
}

export enum PaymentStatus {
  Pending = 'Pending',
  Released = 'Released',
  Held = 'Held',
  Rejected = 'Rejected',
}

export interface PaymentRecord {
  id: string
  fromVasp: string
  toVasp: string
  beneficiary: string
  asset: string
  amount: string
  status: PaymentStatus
  attestationHash?: string
  ivmsVersion?: string
  createdAt: number
  resolvedAt?: number
}

export interface ThresholdConfig {
  asset: string
  jurisdiction: string
  thresholdAmount: string
}

export interface IVMS101Message {
  version: string
  originatingVasp: string
  beneficiaryVasp: string
  beneficiary: LegalPersonOrNatural
  originator: LegalPersonOrNatural
  paymentDetails: {
    asset: string
    amount: string
    instructedAmount?: string
    currency?: string
  }
  messageHash?: string
}

export interface NaturalPerson {
  type: 'natural'
  name: string
  dateOfBirth?: string
  nationalIdentification?: {
    idNumber: string
    idType: string
    country: string
  }
  address?: {
    streetName: string
    buildingNumber: string
    postalCode: string
    town: string
    country: string
  }
}

export interface LegalPerson {
  type: 'legal'
  name: string
  legalPersonIdentifier?: {
    lpiIdentifier: string
    lpiCountry: string
  }
  address?: {
    streetName: string
    buildingNumber: string
    postalCode: string
    town: string
    country: string
  }
}

export type LegalPersonOrNatural = LegalPerson | NaturalPerson

export interface ComplyRailConfig {
  contractId: string
  rpcUrl: string
  networkPassphrase: string
}

export interface ContractInvokeResult {
  success: boolean
  result?: unknown
  error?: string
}

export interface AdminApproval {
  admin: string
  approvedAt: number
}

export interface PendingApproval {
  operationId: string
  operationType: string
  operationData: string
  approvals: AdminApproval[]
  createdAt: number
}

export interface PaymentAnalytics {
  totalCount: number
  pendingCount: number
  releasedCount: number
  rejectedCount: number
  averageAmount: string
}
