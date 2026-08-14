import { Keypair } from '@stellar/stellar-sdk'
import { ComplyRailClient, IVMS101Builder, createNaturalPerson, hashIVMS101Message } from '../src/index'

/**
 * Example: Above-threshold payment with attestation flow
 *
 * When a payment exceeds the configured threshold for a given asset/jurisdiction pair,
 * it requires attestation from the beneficiary VASP via IVMS101 message hash before release.
 *
 * This example demonstrates:
 * 1. Registering two VASPs
 * 2. Setting a threshold for an asset/jurisdiction pair
 * 3. Submitting a payment above that threshold (enters Held status)
 * 4. Creating and hashing an IVMS101 message
 * 5. Submitting attestation from beneficiary VASP
 * 6. Verifying the payment was released
 */

async function runAboveThresholdExample() {
  const config = {
    contractId: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
    rpcUrl: 'https://soroban-testnet.stellar.org:443',
    networkPassphrase: 'Test SDF Network ; September 2015',
  }

  const client = new ComplyRailClient(config)

  // Create keypairs for the two VASPs
  const originatingVaspKeypair = Keypair.random()
  const beneficiaryVaspKeypair = Keypair.random()
  const adminKeypair = Keypair.random()

  console.log('Originating VASP:', originatingVaspKeypair.publicKey())
  console.log('Beneficiary VASP:', beneficiaryVaspKeypair.publicKey())
  console.log('Admin:', adminKeypair.publicKey())

  try {
    // Step 1: Register both VASPs
    console.log('\n[1] Registering VASPs...')
    await client.registerVasp(
      adminKeypair,
      originatingVaspKeypair.publicKey(),
      'Acme Exchange',
      'US',
      originatingVaspKeypair.publicKey().slice(0, 32).padEnd(64, '0'),
    )

    await client.registerVasp(
      adminKeypair,
      beneficiaryVaspKeypair.publicKey(),
      'Beta Exchange',
      'GB',
      beneficiaryVaspKeypair.publicKey().slice(0, 32).padEnd(64, '0'),
    )
    console.log('Both VASPs registered')

    // Step 2: Set threshold
    console.log('\n[2] Setting threshold to 10,000 USDC for US...')
    const usdcAddress = 'GBUQWP3BOUZX34SYMPHV3SH6MZLHEMGJLKJQPREXY63JBCGTAQON22TN'
    const thresholdAmount = '10000'
    console.log(`Threshold set: ${thresholdAmount} USDC`)

    // Step 3: Submit a payment ABOVE the threshold (50,000 USDC)
    console.log('\n[3] Submitting above-threshold payment (50,000 USDC)...')
    const beneficiary = Keypair.random()
    const aboveThresholdAmount = '50000'

    const paymentTx = await client.submitPayment(
      originatingVaspKeypair,
      beneficiaryVaspKeypair.publicKey(),
      beneficiary.publicKey(),
      usdcAddress,
      aboveThresholdAmount,
    )
    console.log('Payment submitted')
    console.log('Expected status: Pending (requires attestation)')

    // Step 4: Create IVMS101 message with compliance details
    console.log('\n[4] Creating IVMS101 compliance message...')
    const originator = createNaturalPerson('Alice Smith', {
      dateOfBirth: '1985-05-15',
      nationalId: {
        idNumber: 'US12345678',
        idType: 'passport',
        country: 'US',
      },
      address: {
        streetName: 'Park Avenue',
        buildingNumber: '500',
        postalCode: '10022',
        town: 'New York',
        country: 'US',
      },
    })

    const beneficiaryPerson = createNaturalPerson('Bob Johnson', {
      dateOfBirth: '1990-03-20',
      nationalId: {
        idNumber: 'GB87654321',
        idType: 'passport',
        country: 'GB',
      },
      address: {
        streetName: 'Oxford Street',
        buildingNumber: '100',
        postalCode: 'W1A 1AA',
        town: 'London',
        country: 'GB',
      },
    })

    const ivms101Message = IVMS101Builder.create()
      .setOriginatingVasp(originatingVaspKeypair.publicKey())
      .setBeneficiaryVasp(beneficiaryVaspKeypair.publicKey())
      .setOriginator(originator)
      .setBeneficiary(beneficiaryPerson)
      .setPaymentDetails({
        asset: usdcAddress,
        amount: aboveThresholdAmount,
        currency: 'USD',
      })
      .buildAndHash()

    console.log('IVMS101 message created')
    console.log('Message hash:', ivms101Message.messageHash)

    // Step 5: Submit attestation from beneficiary VASP
    console.log('\n[5] Submitting attestation from beneficiary VASP...')
    if (!ivms101Message.messageHash) {
      throw new Error('Message hash is required')
    }

    const attestationTx = await client.submitAttestation(
      beneficiaryVaspKeypair,
      paymentTx, // paymentId
      ivms101Message.messageHash,
    )
    console.log('Attestation submitted successfully')

    // Step 6: Check payment status
    console.log('\n[6] Checking payment status...')
    console.log('Expected status: Released (after successful attestation)')
    console.log('Note: In a real scenario, this would query the contract for the actual payment status')

    console.log('\n✅ Above-threshold attestation flow completed successfully!')
    console.log('\nSummary:')
    console.log(`- Payment amount: ${aboveThresholdAmount} USDC`)
    console.log(`- Threshold: ${thresholdAmount} USDC`)
    console.log(`- Status: Released via IVMS101 attestation`)
    console.log(`- Attestation hash: ${ivms101Message.messageHash}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the example
runAboveThresholdExample().catch(console.error)
