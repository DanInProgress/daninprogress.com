import * as khroma from 'khroma';

// khroma fakes
function cssFunc(fnstr) {
  let fnName = null;
  let fnArgs = []
  let start = 0;

  // find the function name
  for (let i = start; i < fnstr.length; i++) {
    let c = fnstr[i];
    if (c === '(') {
      // console.log("found (", fnstr.slice(start, i))
      fnName = fnstr.slice(start, i);
      start = i + 1;
      break;
    }
  }
  // find each arg
  for (let i = start; i < fnstr.length; i++) {
    let c = fnstr[i];
    if (c === '(') {
      i++;
      // console.log(`start parens`)
      for (let level = 1; level > 0 && i < fnstr.length; i++) {
        let c = fnstr[i];
        if (c === '(') {
          level = level + 1;
          // console.log(`${["\t"] * level}${level}`)
          continue;
        }
        if (c === ')') {
          level = level - 1;
          // console.log(`${["\t"] * level}${level}`)
          continue;
        }
      }
      // console.log(`end parens`)
    }
    c = fnstr[i]
    if (c === ',') {
      fnArgs.push(fnstr.slice(start, i));
      start = i + 1;
      continue;
    }
    if (c === ')') {
      fnArgs.push(fnstr.slice(start, i));
      return [fnName, fnArgs];
    }
  }
  throw new Error(`unable to parse func string "${fnstr}"`);
}