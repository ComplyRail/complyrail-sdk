# complyrail-sdk

TypeScript SDK for integrating ComplyRail compliance into Stellar anchors and wallets. Handles VASP registration, payment submission, attestation signing, and IVMS101 message building.

## Features

- **Contract Interaction**: Register VASPs, submit payments, and submit attestations
- **IVMS101 Builder**: Construct and validate IVMS101 compliance messages
- **Message Hashing & Signing**: Hash and cryptographically sign compliance attestations
- **Payment Status Tracking**: Monitor payment status and retrieve attestation records
- **Dual Build**: ESM and CommonJS exports for Node backends and modern frontends

## Installation

```bash
npm install complyrail-sdk
```

## Usage

```typescript
import { ComplyRailClient } from 'complyrail-sdk';

const client = new ComplyRailClient({
  contractId: 'CONTRACTID...',
  rpcUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
  signer: yourStellarSigner,
});

const paymentId = await client.submitPayment({
  fromVasp: 'GVASP...',
  toVasp: 'GVASP...',
  beneficiary: 'GBENEFICIARY...',
  asset: 'GASSET...',
  amount: '1000000000',
});
```

## Documentation

See `examples/` for full end-to-end scripts.

## License

Apache License 2.0 — see LICENSE file.

## Legal Notice

ComplyRail is a technical tool, not legal advice. FATF Travel Rule obligations vary by jurisdiction and carry real regulatory liability. Any team deploying this to production should have the architecture and IVMS101 handling reviewed by qualified legal/compliance counsel before processing real regulated payments.
