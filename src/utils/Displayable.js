// src/utils/Displayable.js - Get a text representation of the value.

function Displayable(value)
{
  if (value === false)
  {
    value = 'FALSE';
  }
  else if (value === true)
  {
    value = 'TRUE';
  }
  else if (value === 'Unknown')
  {
    value = '?';
  }
  else if (value === 'Conflict')
  {
    value = 'X';
  }
  return value;
};

export default Displayable;
