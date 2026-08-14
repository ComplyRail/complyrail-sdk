import { describe, it, expect } from 'vitest'
import { sha256, sha256Buffer, sha256Bytes32 } from '../src/crypto'

describe('Crypto utilities', () => {
  it('should compute SHA256 hash of string', () => {
    const hash = sha256('hello')
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })

  it('should compute SHA256 hash of buffer', () => {
    const hash = sha256(Buffer.from('hello'))
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })

  it('should return buffer from sha256Buffer', () => {
    const hash = sha256Buffer('hello')
    expect(Buffer.isBuffer(hash)).toBe(true)
    expect(hash.toString('hex')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })

  it('should return 32-byte hex string from sha256Bytes32', () => {
    const hash = sha256Bytes32('hello')
    expect(hash).toMatch(/^0x[a-f0-9]{64}$/)
  })

  it('should produce consistent hashes', () => {
    const hash1 = sha256('test data')
    const hash2 = sha256('test data')
    expect(hash1).toBe(hash2)
  })

  it('should produce different hashes for different inputs', () => {
    const hash1 = sha256('test data 1')
    const hash2 = sha256('test data 2')
    expect(hash1).not.toBe(hash2)
  })
})
