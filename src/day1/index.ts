import { test, readInput } from "../utils/index"

const input: string[] = readInput().split('\n');

const magic = (i: string) => (Math.floor(parseInt(i, 10) / 3) - 2);

const goA = (input: string[]): number => {
  let sum = 0;
  input.forEach(i=>sum += magic(i));
  return sum;
}

let b = 0;

const goB = (input: string[]) => {
  input.forEach(i=> {
    const fuel = (magic(i));
    if (fuel > 0) {
      addToB(fuel);
    }
  });
  return b;
}

const addToB = (int: number) => {
  b += int;
  const fuel = (Math.floor(int / 3) - 2);
  if (fuel > 0) {
    addToB(fuel);
  }
}

/* Tests */

// test()

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
