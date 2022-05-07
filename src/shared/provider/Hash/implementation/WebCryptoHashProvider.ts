import { Hash, IHashOptions } from '../Hash'

export class WebCryptoHashProvider implements Hash {
  /**
   * @warning Iterations should be at least >= 15,000
   * Recommended is 100,000, but Workers have a CPU runtime limit of 10-50 ms
   * An alternative is to active Workers Unbound that can reach until 30 seconds
   */
  async generate(value: string, options: IHashOptions = {}) {
    let salt = options?.saltBuffer || crypto.getRandomValues(new Uint8Array(16))
    const iterations = options.iterations || 15000

    if (typeof salt === 'string') {
      salt = this.hexStringToArrayBuffer(salt)
    }

    const encoder = new TextEncoder()
    const passphraseKey = encoder.encode(value)

    const key = await crypto.subtle.importKey('raw', passphraseKey, { name: 'PBKDF2' }, false, [
      'deriveBits',
      'deriveKey',
    ])

    const webKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt,
        iterations,
      },
      key,
      { name: 'AES-CBC', length: 256 },
      true,
      ['encrypt', 'decrypt'],
    )

    const hash = await crypto.subtle.exportKey('raw', webKey)

    return `$PBKDF2;h=${this.bufferToHexString(hash)};s=${this.bufferToHexString(salt)};i=${iterations};`
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const options = {
      saltBuffer: hash.split(';s=')[1].split(';')[0],
      iterations: parseInt(hash.split(';i=')[1].split(';')[0]),
    }

    const hashedPassword = await this.generate(value, options)

    let isValid = true

    for (let i = 0; i < hashedPassword.length; i++) {
      if (hashedPassword.charAt(i) !== hash.charAt(i)) {
        isValid = false
      }
    }

    return isValid
  }

  bufferToHexString(buffer: any) {
    let s = ''
    const h = '0123456789abcdef'
    new Uint8Array(buffer).forEach((v) => {
      s += h[v >> 4] + h[v & 15]
    })
    return s
  }

  hexStringToArrayBuffer(hexString: any) {
    hexString = hexString.replace(/^0x/, '')

    if (hexString.length % 2 !== 0) {
      console.log('WARNING: expecting an even number of characters in the hexString')
    }

    const badCharacter = hexString.match(/[G-Z\s]/i)
    if (badCharacter) {
      console.log('WARNING: found non-hex characters', badCharacter)
    }

    const pairs = hexString.match(/[\dA-F]{2}/gi)

    const integers = pairs.map((str: any) => parseInt(str, 16))

    const array = new Uint8Array(integers)

    return array.buffer
  }
}
