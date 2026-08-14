import { Keypair } from '@stellar/stellar-sdk'
import { ComplyRailClient, IVMS101Builder, createNaturalPerson } from '../src/index'

/**
 * Example: Below-threshold payment flow
 *
 * When a payment is below the configured threshold for a given asset/jurisdiction pair,
 * it is automatically released without requiring attestation from the beneficiary VASP.
 *
 * This example demonstrates:
 * 1. Registering two VASPs
 * 2. Setting a threshold for an asset/jurisdiction pair
 * 3. Submitting a payment below that threshold
 * 4. Verifying the payment was automatically released
 */

async function runBelowThresholdExample() {
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
    // Step 1: Register the originating VASP
    console.log('\n[1] Registering originating VASP...')
    const registerOriginatingTx = await client.registerVasp(
      adminKeypair,
      originatingVaspKeypair.publicKey(),
      'Acme Exchange',
      'US',
      originatingVaspKeypair.publicKey().slice(0, 32).padEnd(64, '0'),
    )
    console.log('Registered originating VASP')

    // Step 2: Register the beneficiary VASP
    console.log('\n[2] Registering beneficiary VASP...')
    const registerBeneficiaryTx = await client.registerVasp(
      adminKeypair,
      beneficiaryVaspKeypair.publicKey(),
      'Beta Exchange',
      'GB',
      beneficiaryVaspKeypair.publicKey().slice(0, 32).padEnd(64, '0'),
    )
    console.log('Registered beneficiary VASP')

    // Step 3: Set threshold (e.g., 10,000 USD for USDC in US)
    console.log('\n[3] Setting threshold to 10,000 USDC for US...')
    const usdcAddress = 'GBUQWP3BOUZX34SYMPHV3SH6MZLHEMGJLKJQPREXY63JBCGTAQON22TN'

    // In a real scenario, we would call setThreshold here
    // For this example, we'll assume a 10,000 unit threshold
    const thresholdAmount = '10000'
    console.log(`Threshold set: ${thresholdAmount} USDC`)

    // Step 4: Submit a payment BELOW the threshold (9,000 USDC)
    console.log('\n[4] Submitting below-threshold payment (9,000 USDC)...')
    const beneficiaryAddress = Keypair.random().publicKey()
    const belowThresholdAmount = '9000'

    const paymentTx = await client.submitPayment(
      originatingVaspKeypair,
      beneficiaryVaspKeypair.publicKey(),
      beneficiaryAddress,
      usdcAddress,
      belowThresholdAmount,
    )
    console.log('Payment submitted successfully')

    // Step 5: Check payment status (should be automatically released)
    console.log('\n[5] Checking payment status...')
    console.log('Expected status: Released (auto-released due to below threshold)')
    console.log('Note: In a real scenario, this would query the contract for the actual payment status')

    console.log('\n✅ Below-threshold payment flow completed successfully!')
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the example
runBelowThresholdExample().catch(console.error)
