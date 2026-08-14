import { describe, it, expect } from 'vitest'
import {
  IVMS101Builder,
  hashIVMS101Message,
  validateIVMS101Message,
  createNaturalPerson,
  createLegalPerson,
} from '../src/ivms101'

describe('IVMS101 Builder', () => {
  it('should create a valid IVMS101 message', () => {
    const message = IVMS101Builder.create()
      .setOriginatingVasp('GABC123')
      .setBeneficiaryVasp('GDEF456')
      .setOriginator(createNaturalPerson('John Doe'))
      .setBeneficiary(createNaturalPerson('Jane Doe'))
      .setPaymentDetails({
        asset: 'native',
        amount: '1000',
      })
      .build()

    expect(message.originatingVasp).toBe('GABC123')
    expect(message.beneficiaryVasp).toBe('GDEF456')
    expect(message.originator.type).toBe('natural')
    expect(message.beneficiary.type).toBe('natural')
    expect(message.paymentDetails.amount).toBe('1000')
  })

  it('should throw error when building incomplete message', () => {
    expect(() => {
      IVMS101Builder.create().setOriginatingVasp('GABC123').build()
    }).toThrow('Missing required fields')
  })

  it('should hash IVMS101 message', () => {
    const message = IVMS101Builder.create()
      .setOriginatingVasp('GABC123')
      .setBeneficiaryVasp('GDEF456')
      .setOriginator(createNaturalPerson('John Doe'))
      .setBeneficiary(createNaturalPerson('Jane Doe'))
      .setPaymentDetails({
        asset: 'native',
        amount: '1000',
      })
      .buildAndHash()

    expect(message.messageHash).toBeDefined()
    expect(message.messageHash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should produce consistent message hashes', () => {
    const message1 = IVMS101Builder.create()
      .setOriginatingVasp('GABC123')
      .setBeneficiaryVasp('GDEF456')
      .setOriginator(createNaturalPerson('John Doe'))
      .setBeneficiary(createNaturalPerson('Jane Doe'))
      .setPaymentDetails({
        asset: 'native',
        amount: '1000',
      })
      .build()

    const message2 = IVMS101Builder.create()
      .setOriginatingVasp('GABC123')
      .setBeneficiaryVasp('GDEF456')
      .setOriginator(createNaturalPerson('John Doe'))
      .setBeneficiary(createNaturalPerson('Jane Doe'))
      .setPaymentDetails({
        asset: 'native',
        amount: '1000',
      })
      .build()

    const hash1 = hashIVMS101Message(message1)
    const hash2 = hashIVMS101Message(message2)
    expect(hash1).toBe(hash2)
  })

  it('should validate complete message', () => {
    const message = IVMS101Builder.create()
      .setOriginatingVasp('GABC123')
      .setBeneficiaryVasp('GDEF456')
      .setOriginator(createNaturalPerson('John Doe'))
      .setBeneficiary(createNaturalPerson('Jane Doe'))
      .setPaymentDetails({
        asset: 'native',
        amount: '1000',
      })
      .build()

    const result = validateIVMS101Message(message)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should detect missing required fields in message', () => {
    const message = {
      version: '1.0',
      originatingVasp: 'GABC123',
      beneficiaryVasp: '',
      beneficiary: createNaturalPerson('Jane Doe'),
      originator: createNaturalPerson('John Doe'),
      paymentDetails: {
        asset: 'native',
        amount: '',
      },
    }

    const result = validateIVMS101Message(message as any)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should support natural person with full details', () => {
    const person = createNaturalPerson('John Doe', {
      dateOfBirth: '1990-01-01',
      nationalId: {
        idNumber: '123456789',
        idType: 'passport',
        country: 'US',
      },
      address: {
        streetName: 'Main St',
        buildingNumber: '123',
        postalCode: '12345',
        town: 'New York',
        country: 'US',
      },
    })

    expect(person.name).toBe('John Doe')
    expect(person.dateOfBirth).toBe('1990-01-01')
    expect(person.nationalIdentification?.idNumber).toBe('123456789')
    expect(person.address?.town).toBe('New York')
  })

  it('should support legal person with full details', () => {
    const person = createLegalPerson('Acme Corp', {
      lpi: {
        lpiIdentifier: '123456789',
        lpiCountry: 'US',
      },
      address: {
        streetName: 'Main St',
        buildingNumber: '123',
        postalCode: '12345',
        town: 'New York',
        country: 'US',
      },
    })

    expect(person.name).toBe('Acme Corp')
    expect(person.legalPersonIdentifier?.lpiIdentifier).toBe('123456789')
    expect(person.address?.town).toBe('New York')
  })
})
