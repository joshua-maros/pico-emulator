// Clips the provided number to be the indicated number of bits.
export function asUnsignedBits(value: number, nbits: number): number
{
  return value & ((1 << nbits) - 1);
}

// Clips the provided number to be the indicated number of bits.
export function fromSignedBits(value: number, nbits: number): number
{
  let bits = asUnsignedBits(value, nbits);
  const maxval = 1 << (nbits - 1);
  if (bits >= maxval)
  {
    bits -= maxval * 2;
  }
  return bits;
}