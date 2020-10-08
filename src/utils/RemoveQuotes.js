// src/utils/RemoveQuotes.js - Remove quotes from a CSV value

// Remove quotes from around the value
function RemoveQuotes(str)
{
  if (str.charAt(0) === '"' && str.charAt(str.length -1) === '"')
  {
    return str.substr(1, str.length -2);
  }
  if (str.charAt(0) === "'" && str.charAt(str.length -1) === "'")
  {
    return str.substr(1, str.length -2);
  }
  return str;
}

export default RemoveQuotes;
