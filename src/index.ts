export class ComplyRailClient {
  contractId: string
  rpcUrl: string
  networkPassphrase: string

  constructor(config: {
    contractId: string
    rpcUrl: string
    networkPassphrase: string
  }) {
    this.contractId = config.contractId
    this.rpcUrl = config.rpcUrl
    this.networkPassphrase = config.networkPassphrase
  }

  async registerVasp(): Promise<void> {
    console.log('registerVasp not yet implemented')
  }

  async submitPayment(): Promise<void> {
    console.log('submitPayment not yet implemented')
  }

  async submitAttestation(): Promise<void> {
    console.log('submitAttestation not yet implemented')
  }
}

export default ComplyRailClient
