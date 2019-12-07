import { test } from "../utils/test";

// const input = '273025-767253';
// const inputA = '273025';
// const inputB = '767253'

//Two adjacent digits are the same (like 22 in 122345).
//Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).

// // Find starting point
// const a: number[] = inputA.split('').map(i => parseInt(i, 10));

// a.forEach((digit, index) => {
//     if (index > 0) {
//         if (digit < a[index-1]) {
//             a[index] = a[index-1];
//         }
//     }
// });
// console.log('starting at ', a);

// const getPairPosition = (numbers: number[]): number | void => {
//     let index;
//     let pairPosition = undefined;
//     loop:
//     for (let digit in numbers) {
//         if (index > 0) {
//             if (parseInt(digit, 10) === numbers[index-1]) {
//                 pairPosition = index;
//                 break loop;
//             }
//         }
//         index++;
//     }
//     return pairPosition;
// }

// // Get first pair position
// const pairPosition = getPairPosition(a);

// // If no pair position, get to next pair position
// const getToNextPairPosition = (input: string[]): string[] => {

// }

/**
 * 277777
 * 277778
 * 277779
 * 277788
 * 277789
 * 277888
 * 277889
 * 277899
 * 277999
 * 278888
 * 278889
 * 278899
 * 278999
 */

// For star #1
const doesPairExist = (numbers: number[]) => {
    let index = 0;
    let pairExists = false;
    loop:
    for (let digit of numbers) {
        if (index > 0) {
            if (digit === numbers[index-1]) {
                pairExists = true;
                break loop;
            }
        }
        index++;
    }
    return pairExists;
};

// For star #2
const doesPairExistOnlyOnce = (numbers: number[]) => {
    let index = 0;
    let pairExists = false;
    loop:
    for (let digit of numbers) {
        if (index > 0) {
            if (digit === numbers[index-1]) {
                if (index > 1 && numbers[index-2] === digit) {
                    pairExists = false;
                } else if (index < 5 && numbers[index + 1] === digit) {
                    pairExists = false;
                } else {
                    pairExists = true;
                }
            }

            if (pairExists) {
                break loop;
            }
        }
        index++;
    }
    return pairExists;
}

const isEachNumberincreasing = (numbers: number[]) => {
    let isIncreasing = true;
    let index = 0;
    loop:
    for (let number of numbers) {
        if (index > 0) {
            if (number < numbers[index-1]) {
                isIncreasing = false;
                break loop;
            }
        }
        index++;
    }
    return isIncreasing;
}


// test(doesPairExist([1, 1, 1, 1, 1, 1]), true);
// test(isEachNumberincreasing('2,7,7,7,7,7'.split(',')), true);

const inputA = 273025;
const inputB = 767253;

let count = inputA;
let possiblePasswords = 0;
while (count <= inputB) {
    const input = count.toString().split('').map(i=>parseInt(i, 10));
    if (doesPairExistOnlyOnce(input) && isEachNumberincreasing(input)) {
        possiblePasswords++;
        console.log(input);
    }

    count++;
}

console.log('possible passwords', possiblePasswords);