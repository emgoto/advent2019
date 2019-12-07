import { test, readInput } from "../utils/index"

const testInput: number[] = readInput().split(',').map(i => parseInt(i, 10));
// const testInput = '3,225,1,225,6,6,1100,1,238,225,104,0,101,71,150,224,101,-123,224,224,4,224'.split(',').map(i => parseInt(i, 10));

const log = false;

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

const goA = (n: number, input: number[]): number[] => {
    let index = 0;
    let separator = 4;
    let argOne;
    let argTwo;
    let argThree
    loop:
    for (let i of input) {
        if (index === 0 || index === separator) {
            const {op, params} = getOpAndParameters(i);
            switch (op) {
                case(1):
                log && console.log("case 1");
                    argOne = params[0] !== 1 ? input[input[index + 1]] : input[index + 1];
                    argTwo = params[1] !== 1 ? input[input[index + 2]] : input[index + 2];
                    input[input[index+3]] = argOne + argTwo;
                    separator = index + 4;
                    break;
                case(2):
                log && console.log("case 2");
                    argOne = params[0] !== 1 ? input[input[index + 1]] : input[index + 1];
                    argTwo = params[1] !== 1 ? input[input[index + 2]] : input[index + 2];
                    input[input[index+3]] = argOne * argTwo;
                    separator = index + 4;
                    break;
                case(3):
                    input[input[index+1]] = n;
                    separator = index + 2;
                    log && console.log("case 3", input);
                    break;
                case(4):
                    const output = params[0] !== 1 ? input[input[index+1]] : input[index+1];
                    console.log('Output: ', output);
                    separator = index + 2;
                    break;
                case(5):
                log && console.log("case 5");
                    //if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
                    argOne =  params[0] !== 1 ? input[input[index + 1]] : input[index + 1];
                    argTwo = params[1] !== 1 ? input[input[index + 2]] : input[index + 2];

                    if(argOne !== 0) {
                        separator = argTwo;
                    } else {
                        separator = index + 3;
                    }

                    break;
                case(6):
                log && console.log("case 6");
                    //f the first parameter is zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
                    argOne =  params[0] !== 1 ? input[input[index + 1]] : input[index + 1];
                    argTwo = params[1] !== 1 ? input[input[index + 2]] : input[index + 2];

                    if (argOne === 0) {
                        separator = argTwo;
                    } else {
                        separator = index + 3;
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
                    separator = index + 4;
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
                    separator = index + 4;
                    log && console.log('case 8: store at',argThree);
                    break;
                case(99):
                    break loop;
            }
        }
        index += 1;
    }

    return input;
}

/* Tests */

// Tests for star #1
// goA(1, [3,0,4,0,99]); // Should console log 1
// test(goA(1, [1002,4,3,4,33]), [1002, 4, 3, 4, 99]);
// test(goA(1, [1101,100,-1,4,0]), [1101,100,-1,4,99]);

// Tests for star #2
// goA(7, [3,9,8,9,10,9,4,9,99,-1,8]); // output 1 if equal to 8
// goA(8, [3,9,7,9,10,9,4,9,99,-1,8 ]); // output 1 if less than 8
// goA(7, [ 3,3,1108,-1,8,3,4,3,99]) // output 1 if equal to 8
// goA(8, [3,3,1107,-1,8,3,4,3,99]); //output 1 if less than 8

const newInput = goA(5, testInput);
console.log('newInput', newInput);



