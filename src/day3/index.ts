import { test, readInput } from "../utils/index"

const twoLines: string[] = readInput().split('\n');
const lineA: string[] = twoLines[0].split(',');
const lineB: string[] = twoLines[1].split(',');

type Coord = {
    x: number,
    y: number,
    t: number,
};

const coord = (x: number, y: number, t: number,): Coord => ({x, y, t});

const getLineCoords = (instruction: string, startingCoord: Coord): {coords: Coord[], coord: Coord} => {
    let { x, y, t } = startingCoord;

    let coords = [];

    const firstChar: string = instruction.slice(0, 1);
    let count: number = parseInt(instruction.slice(1, instruction.length),  10);

    switch(firstChar) {
        case('L'): // Minus the Y
            while (count > 0) {
                count--;
                y--;
                t++;
                coords.push(coord(x, y, t));
            }
            break;
        case('R'): // Add the Y
            while (count > 0) {
                count--;
                y++;
                t++;
                coords.push(coord(x, y, t));
            }
            break;
        case('U'): // Add the X
            while (count > 0) {
                count--;
                x++;
                t++;
                coords.push(coord(x, y, t));
            }
            break;
        case('D'): // Minus the X
            while (count > 0) {
                count--;
                x--;
                t++;
                coords.push(coord(x, y, t));
            }
            break;
    }

    return { coords, coord: {x, y, t}};
}

const goA = (lineA: string[], lineB: string[]): number => {
    // Create list of coordinates for line A
    let startingCoord = {x: 0, y: 0, t: 0};
    const aCoords = [startingCoord];
    lineA.forEach(instruction => {
        const newCoords = getLineCoords(instruction, startingCoord);
        aCoords.push(...newCoords.coords);
        startingCoord = newCoords.coord;
    });

    // Create list of coordinates for line B
    startingCoord = {x: 0, y: 0, t: 0};
    const bCoords: Coord[] = [startingCoord];
    lineB.forEach(instruction => {
        const newCoords = getLineCoords(instruction, startingCoord);
        bCoords.push(...newCoords.coords);
        startingCoord = newCoords.coord;
    });


    // For Star #2
    let shortestCoord;;
    aCoords.forEach(a => {
        bCoords.forEach(b => {
            if (a.x === b.x && a.y === b.y && a.y !== 0 && a.x !== 0) {
                const { x, y } = a;
                const newDistance = a.t + b.t;
                if (!shortestCoord || (newDistance < shortestCoord.t && x !== shortestCoord.x && y !== shortestCoord.y)) {
                    shortestCoord = {x, y, t: newDistance};
                }
            }
        })
    })

    return shortestCoord.t;


    // Star #1
    // // Find overlapping coordinates
    // const intersection = aCoords
    //     .filter(a => bCoords.some(b => a.x === b.x && a.y === b.y))
    //     .filter(i => i.x !== 0 && i.y !== 0);

    

    // // Loop thru and find shortest distance coordinate
    // let shortestDistance;

    // intersection.forEach((coord) => {
    //     //Manhattan
    //     const newDistance = Math.abs(0 - coord.x) + Math.abs(0 - coord.y);

    //     if (!shortestDistance || newDistance < shortestDistance) {
    //         shortestDistance = newDistance;
    //     }
    // });

    // return shortestDistance;
}

/* Tests */

// Star #2
// test(goA(['R8','U5','L5','D3'], ['U7','R6','D4','L4']), 6);
// test(goA('R75,D30,R83,U83,L12,D49,R71,U7,L72'.split(','),
//     'U62,R66,U55,R34,D71,R55,D58,R83'.split(',')), 159);
// test(goA(['U10', 'R10'], ['R10', 'U10']), 20);
// test(goA('R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'.split(','),
//     'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'.split(',')), 135);

// Star #2
// test(goA('R75,D30,R83,U83,L12,D49,R71,U7,L72'.split(','), 
//     'U62,R66,U55,R34,D71,R55,D58,R83'.split(',')), 610);

// const resultA = goA(lineA, lineB);
// console.log("Solution to part 1:", resultA)

const resultB = goA(lineA, lineB);
console.log("Solution to part 2:", resultB)

