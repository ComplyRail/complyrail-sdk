import { createHash } from 'crypto'

export function sha256(data: string | Buffer): string {
  const hash = createHash('sha256')
  if (typeof data === 'string') {
    hash.update(data, 'utf8')
  } else {
    hash.update(data)
  }
  return hash.digest('hex')
}

export function sha256Buffer(data: string | Buffer): Buffer {
  const hash = createHash('sha256')
  if (typeof data === 'string') {
    hash.update(data, 'utf8')
  } else {
    hash.update(data)
  }
  return hash.digest()
}

export function sha256Bytes32(data: string | Buffer): string {
  return '0x' + sha256(data).padStart(64, '0')
}
