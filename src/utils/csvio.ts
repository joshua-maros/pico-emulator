import PicoMemory from "./PicoMemory";


function saveMem(mem: PicoMemory): string
{
  let data = '';
  let lastItemWasInitialized = true;
  for (let index = 0; index < 128; index++)
  {
    let item = mem.get(index);
    if (item.initialized)
    {
      if (lastItemWasInitialized)
      {
        data += ',';
      }
      else
      {
        data += index + ',';
      }
      data += item.value + '\n';
    }
    lastItemWasInitialized = item.initialized;
  }
  return data;
}

function trimQuotes(text: string): string
{
  if (text.startsWith('"') && text.endsWith('"'))
  {
    return text.substr(1, text.length - 2);
  } else
  {
    return text;
  }
}

// Returns an error message if the file is poorly formatted.
function loadMem(mem: PicoMemory, file: string): string | null
{
  mem.clear();

  const READING_NUMBER = 1;
  const READING_DATA = 2;

  let numberText = '';
  let data = '';
  let currentIndex = 0;
  let state = READING_NUMBER;

  // This just makes the file easier to parse if we can assume that there is a
  // newline after every entry.
  file += '\n';

  for (let char of file)
  {
    // Pretend that LF is the only newline character.
    if (char === '\r') continue;
    if (state === READING_NUMBER)
    {
      if (char === ',')
      {
        // We are at the end of the number. 
        let trimmed = trimQuotes(numberText.trim());
        state = READING_DATA;
        data = '';
        // If we read nothing, then just use what we currently think the index 
        // is and continue.
        if (trimmed.length === 0) continue;

        currentIndex = parseInt(trimmed);
        if (isNaN(currentIndex))
        {
          return numberText + ' is not a valid number';
        }
        if (currentIndex > 127)
        {
          return currentIndex + ' is too big, it is over 127';
        }
        if (currentIndex < 0)
        {
          return currentIndex + ' is too small, it is less than 0';
        }
      }
      else
      {
        numberText += char
      }
    }
    else if (state === READING_DATA)
    {
      if (char === '\n')
      {
        state = READING_NUMBER;
        numberText = '';
        // Just silently discard the value. It is easier for the uset to see
        // what went wrong if they see part of their code thrown away.
        if (currentIndex > 127) continue;
        // Remove extra whitespace.
        let trimmedData = trimQuotes(data.trim());
        // If the data is blank, do not load data and do not increment the
        // index. This allows putting a number and then the value contained in
        // it on the next line.
        if (trimmedData.length === 0) continue;
        mem.get(currentIndex).value = trimmedData.toUpperCase();
        currentIndex += 1;
      }
      else
      {
        data += char;
      }
    }
  }

  return null;
}

const csvio = {
  saveMem,
  loadMem,
};

export default csvio;