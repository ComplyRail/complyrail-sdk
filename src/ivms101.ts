import { IVMS101Message, NaturalPerson, LegalPerson, LegalPersonOrNatural } from './types'
import { sha256 } from './crypto'

export class IVMS101Builder {
  private message: Partial<IVMS101Message> = {
    version: '1.0',
  }

  static create(): IVMS101Builder {
    return new IVMS101Builder()
  }

  setOriginatingVasp(vasp: string): this {
    this.message.originatingVasp = vasp
    return this
  }

  setBeneficiaryVasp(vasp: string): this {
    this.message.beneficiaryVasp = vasp
    return this
  }

  setBeneficiary(person: LegalPersonOrNatural): this {
    this.message.beneficiary = person
    return this
  }

  setOriginator(person: LegalPersonOrNatural): this {
    this.message.originator = person
    return this
  }

  setPaymentDetails(details: {
    asset: string
    amount: string
    instructedAmount?: string
    currency?: string
  }): this {
    this.message.paymentDetails = details
    return this
  }

  build(): IVMS101Message {
    if (
      !this.message.originatingVasp ||
      !this.message.beneficiaryVasp ||
      !this.message.beneficiary ||
      !this.message.originator ||
      !this.message.paymentDetails
    ) {
      throw new Error('Missing required fields in IVMS101 message')
    }

    const message: IVMS101Message = {
      version: this.message.version!,
      originatingVasp: this.message.originatingVasp,
      beneficiaryVasp: this.message.beneficiaryVasp,
      beneficiary: this.message.beneficiary,
      originator: this.message.originator,
      paymentDetails: this.message.paymentDetails,
    }

    return message
  }

  buildAndHash(): IVMS101Message {
    const message = this.build()
    message.messageHash = hashIVMS101Message(message)
    return message
  }
}

export function hashIVMS101Message(message: IVMS101Message): string {
  const canonicalJson = JSON.stringify(message, null, 0)
  return sha256(canonicalJson)
}

export function validateIVMS101Message(message: IVMS101Message): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!message.originatingVasp) errors.push('Missing originatingVasp')
  if (!message.beneficiaryVasp) errors.push('Missing beneficiaryVasp')
  if (!message.beneficiary) errors.push('Missing beneficiary')
  if (!message.originator) errors.push('Missing originator')
  if (!message.paymentDetails) errors.push('Missing paymentDetails')
  if (!message.paymentDetails?.amount) errors.push('Missing payment amount')

  if (message.beneficiary) {
    if (message.beneficiary.type === 'natural' && !(message.beneficiary as NaturalPerson).name) {
      errors.push('Natural person missing name')
    }
    if (message.beneficiary.type === 'legal' && !(message.beneficiary as LegalPerson).name) {
      errors.push('Legal person missing name')
    }
  }

  if (message.originator) {
    if (message.originator.type === 'natural' && !(message.originator as NaturalPerson).name) {
      errors.push('Natural person originator missing name')
    }
    if (message.originator.type === 'legal' && !(message.originator as LegalPerson).name) {
      errors.push('Legal person originator missing name')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function createNaturalPerson(name: string, opts?: {
  dateOfBirth?: string
  nationalId?: { idNumber: string; idType: string; country: string }
  address?: { streetName: string; buildingNumber: string; postalCode: string; town: string; country: string }
}): NaturalPerson {
  return {
    type: 'natural',
    name,
    dateOfBirth: opts?.dateOfBirth,
    nationalIdentification: opts?.nationalId,
    address: opts?.address,
  }
}

export function createLegalPerson(name: string, opts?: {
  lpi?: { lpiIdentifier: string; lpiCountry: string }
  address?: { streetName: string; buildingNumber: string; postalCode: string; town: string; country: string }
}): LegalPerson {
  return {
    type: 'legal',
    name,
    legalPersonIdentifier: opts?.lpi,
    address: opts?.address,
  }
}
