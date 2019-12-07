import { test, readInput } from "../utils/index"

const input: number[] = readInput().split(',').map(i => parseInt(i, 10));

const goA = (input: number[]): number => {
    // input[1] = 12;
    // input[2] = 2;

    let index = 0;

    loop:
    for (let i of input) {
        if (index === 0 || index % 4 === 0) {
            switch (i) {
                case(1):
                    input[input[index+3]] = input[input[index+1]] + input[input[index + 2]];
                    break;
                case(2):
                    input[input[index+3]] = input[input[index+1]] * input[input[index + 2]];
                    break;
                case(99):
                    break loop;
            }
        }
        index += 1;
    }

    console.log('return ', input[0])
    return input[0]
}

var zeroTo99: number[] = [];
let low = 0;
const high = 99;
while(low <= high){
   zeroTo99.push(low++);
}


const goB = (input: number[]) => {
    loop:
   for (let numberA in zeroTo99) {
    for (let numberB in zeroTo99) {
       const newInput: number[] = input.slice();
       newInput[1] = parseInt(numberA, 10);
       newInput[2] = parseInt(numberB, 10);

       if (goA(newInput) === 19690720) {
            console.log('A is', numberA);
            console.log('B is', numberB);
           break loop;
       }
    } 
   }

   return -1;

}

/* Tests */

// Tests for star #1
// test(goA([1,0,0,0,99]), 2);
// test(goA([2,3,0,3,99]), 2);
// test(goA([2,4,4,5,99,0]), 2);
// test(goA([1,1,1,4,99,5,6,0,99]), 30);
// test(goA([1,9,10,3,2,3,11,0,99,30,40,50]),3500);

// const resultA = goA(input);

// console.log("Solution to part 1:", resultA)
