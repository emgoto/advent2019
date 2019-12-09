import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput
const input = prepareInput(readInput()).split(',').map(i => parseInt(i, 10));
let log = false;

const getOpAndParameters = (instr: number): {op: number, params: number[]} => {
  let op;
  let params = [];
  if (instr < 100) {
      op = instr;
  } else {
      const digits = instr.toString().split('');
      op = parseInt(`${digits[digits.length -2]}${digits[digits.length -1]}`, 10);

      let index = digits.length - 3;
      while (index >= 0) {
          params.push(parseInt(digits[index], 10));
          index--
      }
  }

  return {op, params};
}

const applyModeWithInput = (input: number[], index: number, mode: number, relativeBase: number) =>
  input[applyMode(input, index, mode, relativeBase)];

const applyMode = (input: number[], index: number, mode: number, relativeBase: number): number => {
  if (mode === 2) {
    return input[index] + relativeBase;
  } else if (mode === 1) {
    return index;
  }
  return input[index];
}

const goA = (input: number[], n: number): number | number[] => {
  let index = 0;
  let argOne;
  let argTwo;
  let argThree
  let result: number = 0;
  let relativeBase = 0;
  let output = [];

  loop:
  while (true) {
    const i = input[index];
    const {op, params} = getOpAndParameters(i);
    switch (op) {
      case(1):
        log && console.log("case 1");
        argOne = applyModeWithInput(input, index + 1, params[0], relativeBase);
        argTwo = applyModeWithInput(input, index + 2, params[1], relativeBase);
        argThree = applyMode(input, index + 3, params[2], relativeBase);
        input[argThree] = argOne + argTwo;

        index += 4;
        break;
      case(2):
        log && console.log("case 2");
        argOne = applyModeWithInput(input, index + 1, params[0], relativeBase);
        argTwo = applyModeWithInput(input, index + 2, params[1], relativeBase);
        argThree= applyMode(input, index + 3, params[2], relativeBase);
        input[argThree] = argOne * argTwo;

        index += 4;
        break;
      case(3):
        argOne = applyMode(input, index + 1, params[0], relativeBase);
        input[argOne] = n;
        log && console.log("case 3", input);

        index += 2;
        break;
      case(4):
        result = applyModeWithInput(input, index+1, params[0], relativeBase);
        log && console.log('case 4', result);
        output.push(result);
        // TODO: To be honest I don't know why it's finding a 99 in here
        if (result === 99) {
          break loop;
        }
        
        index += 2;
        break;
      case(5):
        //if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
        argOne = applyModeWithInput(input, index + 1, params[0], relativeBase);
        argTwo = applyModeWithInput(input, index + 2, params[1], relativeBase);

        if(argOne !== 0) {
            index = argTwo;
        } else {
            index += 3;
        }

        break;
      case(6):
        log && console.log("case 6");
        //f the first parameter is zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
        argOne = applyModeWithInput(input, index + 1, params[0], relativeBase);
        argTwo = applyModeWithInput(input, index + 2, params[1], relativeBase);

        if (argOne === 0) {
            index = argTwo;
            index = argTwo;
        } else {
            index += 3;
        }
        break;
      case(7):
        log && console.log("case 7", input);
        //if the first parameter is less than the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
        argOne = applyModeWithInput(input, index + 1, params[0], relativeBase);
        argTwo = applyModeWithInput(input, index + 2, params[1], relativeBase);
        argThree = applyMode(input, index+3, params[2], relativeBase);

        if (argOne < argTwo) {
            input[argThree] = 1;
        } else {
            input[argThree] = 0;
        }
        index += 4;
        break;
      case(8):
        //if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
        argOne = applyModeWithInput(input, index + 1, params[0], relativeBase);
        argTwo = applyModeWithInput(input, index + 2, params[1], relativeBase);
        argThree = applyMode(input, index+3, params[2], relativeBase);

        if (argOne === argTwo) {
            input[argThree] = 1
        } else {
            input[argThree] = 0;
        }
        index += 4;
        log && console.log('case 8: store at',argThree);
        break;
      case(9): // Relative base offset
        log && console.log('case 9');
        const offset = applyModeWithInput(input, index + 1, params[0], relativeBase);
        relativeBase += offset;
        index += 2;
        break;
      case(99):
        log && console.log('case 99', input);
        break loop;
    }
  }

  return output ? output : result;
}

/* Tests */
test(goA([1102,34915192,34915192,7,4,7,99,0], 0), [ 1219070632396864 ]);
test(goA([104,1125899906842624,99], 0), [ 1125899906842624 ]);
test(goA([109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99], 0), [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99]);
test(goA(input.slice(), 1), [ 3518157894 ]) // Part 1
test(goA(input.slice(), 2), [ 80379 ]); // Part 2

/* Results */
const resultA = goA(input, 1)
const resultB = goA(input, 2)
console.log("Solution to part 1:", resultA);
console.log("Solution to part 2:", resultB)
