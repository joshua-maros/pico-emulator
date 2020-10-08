// src/utils/AsNBits.js - Clip a number to be the indicated number of bits.

function AsNBits(value, nbits)
{
  if (value === 'Conflict' || value === 'Unknown')
  {
    return value;
  }
  if (nbits === 1)
  {
    if (value === true || value === false)
    {
      return value;
    }
    return (value & 1) === 1;
  }
  const maxVal = 1 << nbits;
  const mostPos = maxVal >> 1;
  const mask = maxVal - 1;
  let val = value & mask;
  if (val >= mostPos)
  {
    val -= maxVal;
  }
  return val;
}

export default AsNBits;
