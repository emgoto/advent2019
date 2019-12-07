import { test, readInput } from "../utils/index"
import { resolve } from "dns";

const input: number[] = readInput().split(',').map(i => parseInt(i, 10));

const log = false;

let inputAs = [0];
let inputBs = [];
let inputCs = [];
let inputDs = [];
let inputEs = [];

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

const goA = (n: number | void, n2: number, yourLetter: string, input: number[], paramIndex: number): {result: number, input: number[], index: number, hasHalted: boolean} => {
    let index = paramIndex;
    let argOne;
    let argTwo;
    let argThree
    let nUsed = false;
    let result: number = 0;
    let hasHalted = false;

    // console.log(yourLetter, 'starting with paramIndex', paramIndex);

    loop:
    while (index < input.length) {
        const i = input[index];
        // if (index >= paramIndex && (index === 0 || index === separator)) {
            const {op, params} = getOpAndParameters(i);
            switch (op) {
                case(1):
                log && console.log("case 1");
                    argOne = params[0] !== 1 ? input[input[index + 1]] : input[index + 1];
                    argTwo = params[1] !== 1 ? input[input[index + 2]] : input[index + 2];
                    input[input[index+3]] = argOne + argTwo;
                    index += 4;
                    break;
                case(2):
                log && console.log("case 2");
                    argOne = params[0] !== 1 ? input[input[index + 1]] : input[index + 1];
                    argTwo = params[1] !== 1 ? input[input[index + 2]] : input[index + 2];
                    input[input[index+3]] = argOne * argTwo;
                    index += 4;
                    break;
                case(3):
                    if (nUsed || !n) {
                        // console.log('use n2', n2);
                        input[input[index+1]] = n2;
                    } else {
                        // console.log('use n', n);
                        nUsed = true;
                        input[input[index+1]] = n;
                    }
                    index += 2;
                    log && console.log("case 3", input);
                    break;
                case(4):
                    result = params[0] !== 1 ? input[input[index+1]] : input[index+1];
                    // console.log('Output: ', result);
                    
                    index += 2; // cos we're not gonna get to do it
                    break loop;
                
                    index += 2;
                    break;
                case(5):
                    //if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
                    argOne =  params[0] !== 1 ? input[input[index + 1]] : input[index + 1];
                    argTwo = params[1] !== 1 ? input[input[index + 2]] : input[index + 2];

                    if(argOne !== 0) {
                        index = argTwo;
                    } else {
                        index += 3;
                    }

                    break;
                case(6):
                log && console.log("case 6");
                    //f the first parameter is zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
                    argOne =  params[0] !== 1 ? input[input[index + 1]] : input[index + 1];
                    argTwo = params[1] !== 1 ? input[input[index + 2]] : input[index + 2];

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
                    argOne =  params[0] !== 1 ? input[input[index + 1]] : input[index + 1];
                    argTwo = params[1] !== 1 ? input[input[index + 2]] : input[index + 2];
                    argThree = params[2] !== 1 ? input[index + 3] : index + 3;

                    if (argOne < argTwo) {
                        input[argThree] = 1;
                    } else {
                        input[argThree] = 0;
                    }
                    index += 4;
                    break;
                case(8):
                    //if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
                    argOne =  params[0] !== 1 ? input[input[index + 1]] : input[index + 1];
                    argTwo = params[1] !== 1 ? input[input[index + 2]] : input[index + 2];
                    argThree = params[2] !== 1 ? input[index + 3] : index + 3;

                    if (argOne === argTwo) {
                        input[argThree] = 1
                    } else {
                        input[argThree] = 0;
                    }
                    index += 4;
                    log && console.log('case 8: store at',argThree);
                    break;
                case(99):
                    // console.log('hasHalted!!!');
                    hasHalted = true;
                    break loop;
            }
        // }
        // index += 1;
    }

    // console.log(yourLetter, "done at index", index, "returning", input);
    return { result, input, index, hasHalted};
}

const givenCombination = (list: number[], combo: number[]): number => {
    let aIndex = 0;
    let bIndex = 0;
    let cIndex = 0;
    let dIndex = 0;
    let eIndex = 0;

    let aInput = list.slice();
    let bInput = list.slice();
    let cInput = list.slice();
    let dInput = list.slice();
    let eInput = list.slice();

    let aResult;
    let bResult;
    let cResult;
    let dResult;
    let eResult = 0;

    let isHalted = false;

    while (!isHalted) {
        // console.log('starting loop', eResult);
        const {result: resultA, input: inputA, index: indexA} = goA(combo[0], eResult, "A", aInput, aIndex);
        aResult = resultA;
        aInput = inputA;
        aIndex = indexA;
        combo[0] = undefined;

        const {result: resultB, input: inputB, index: indexB} = goA(combo[1], aResult, "B", bInput, bIndex);
        bResult = resultB;
        bInput = inputB;
        bIndex = indexB;
        combo[1] = undefined;

        const {result: resultC, input: inputC, index: indexC} = goA(combo[2], bResult, "C", cInput, cIndex);
        cResult = resultC;
        cInput = inputC;
        cIndex = indexC;
        combo[2] = undefined;

        const {result: resultD, input: inputD, index: indexD} = goA(combo[3], cResult, "D", dInput, dIndex);
        dResult = resultD;
        dInput = inputD;
        dIndex = indexD;
        combo[3] = undefined;


        const {result: resultE, input: inputE, index: indexE, hasHalted: eHasHalted} = goA(combo[4], dResult, "E", eInput, eIndex);
        eResult = resultE > 0 ? resultE : eResult; // don't bother if 0
        eInput = inputE;
        eIndex = indexE;
        combo[4] = undefined;
        isHalted = eHasHalted;

        // if (eResult > 139629729) {  
        //     isHalted = true;
        //     console.log("unsuccessfully halted due to bein too big", eResult - 139629729);
        // }

        // if (aResult === undefined || bResult === undefined || cResult === undefined || dResult  === undefined || eResult === undefined) {
        //     isHalted = true;
        //     console.log('unsuccesfully due to undefined');
        // }

        // if (eResult === 0) {
        //     isHalted = true;
        //     console.log('unsuccessfuly halted due to 0');
        // }
    }

    // console.log('E finished', eResult);
    return eResult;
}


// const possibles = [0, 1, 2, 3, 4];
const possibles = [5, 6, 7, 8, 9];
const getMax = (list: number[]): number => {
    let possibleMax;
    possibles.forEach(possibleA => {
        possibles.forEach(possibleB => {
            if (possibleB !== possibleA) {
                possibles.forEach(possibleC => {
                    if (possibleC !== possibleB && possibleC !== possibleA) {
                        possibles.forEach(possibleD => {
                            if (possibleD !== possibleC && possibleD !== possibleB && possibleD !== possibleA) {
                                possibles.forEach(possibleE => {
                                    if (possibleE !== possibleD && possibleE !== possibleC && possibleE !== possibleB && possibleE !== possibleA) {
                                        const result = givenCombination(list, [possibleA, possibleB, possibleC, possibleD, possibleE]);
                                        if (!possibleMax || result > possibleMax) {
                                            possibleMax = result;
                                        }
                                    }
        
                                })
                            }
                           
                        })
                    }
                   
                })
            }
           
        })
    })

    return possibleMax;  
}


// Test for Star #1
// test(getMax([3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0]), 43210);

// Test for Star #2
test(getMax([3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
    27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5]), 139629729);

// givenCombination([3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5],
//     [5, 6, 7, 8, 9]);

// 3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5

// [0] 3, 26
// Use first input and store it at position 26 (third last)

// [2] 1001,26,-4,26
// Minus 4 from position 26 (third last)

// [6] 3,27
// Use second input and store it at position 27 (second last)

// [8] 1002,27,2,27
// Multiply by two from position 27 (second last)

// [12] 1,27,26,27
// Add position 26 to position 27 (second last)

// [16] 4,27
// Echo position 27
 
// [18] 1001,28,-1,28
// Minus one from position 28 (last)

// [22 -> 6] 1005,28,6
// take us back to [use second input] if we havent looped enough

// 99
// stoppu


console.log(getMax(input));
