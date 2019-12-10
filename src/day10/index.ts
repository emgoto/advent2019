import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput()).split('\n');

// . = empty
const ASTEROID = '#';

enum Angle {
  right = 'right',
  left = 'left'
};

type Coords = {
  x: number,
  y: number,
  count?: number
};

const calculateVisible = (x: number, y: number, line: string[], linePointer?: Coords[]): {visible: number, coords: Coords[]} => {
  let left = 0; // or up
  let right = 0; // or down
  let visible = 0
  let coords = [];

  let pushedRight = false;

  line.forEach((location, index) => {
    const comparison = linePointer && linePointer[index] ? linePointer[index].y : index;
    if (comparison < y && location === ASTEROID) {
      if (linePointer && linePointer[index]) {
        if (coords.length > 0) {
          coords.pop(); // We only want to keep the last element
        }
        coords.push(linePointer[index])
      };
      left++;
    } else if (comparison > y && location === ASTEROID) {
      if (!pushedRight && linePointer && linePointer[index]) {
        coords.push(linePointer[index]);
        pushedRight = true;
      }
      right++;
    }
  });


  if (left > 0) {
    visible += 1;
  }

  if (right > 0) {
    visible += 1;
  }

  return { visible, coords};
}

const getHorizontal = (x: number, y: number, input:string[]): {visible: number, coords: Coords[]} => {
  const line = input[y].split('');
  return calculateVisible(x, y, line);
}

const getVertical = (x: number, y: number, input:string[]): {visible: number, coords: Coords[]} => {
  const line = input.map(i => i[x]);
  return calculateVisible(x, y, line);
}

const getCounters = (gradient: number, gradient2, angle: Angle): {x: number, y: number} => {

  const x = angle === Angle.right ? -gradient : gradient;
  const y = angle === Angle.right ? -gradient2 : -gradient2;

  return { x, y };
}

const getDiagonal = (x: number, y: number, gradient: number, gradient2: number, angle: Angle, input: string[]): {line: string[], linePointer: any} => {
  const height = input.length;
  const width = input[0].length;
  const line = [input[y][x]];
  const linePointer = [{x, y}];

  let {x: xBeforeCounter, y: yBeforeCounter} = getCounters(gradient, gradient2, angle);
  let xAfterCounter = -xBeforeCounter
  let yAfterCounter = -yBeforeCounter;

  let xcounter = x + xBeforeCounter;
  let ycounter = y + yBeforeCounter;
  while (Math.floor(xcounter) > -1 && Math.floor(ycounter) > -1) {
    line.unshift(input[Math.floor(ycounter)][Math.floor(xcounter)]);
    linePointer.unshift({x: xcounter, y: ycounter});
    ycounter += yBeforeCounter;
    xcounter += xBeforeCounter;
  }
  xcounter = x + xAfterCounter;
  ycounter = y + yAfterCounter;
  while (Math.floor(xcounter) < width && Math.floor(ycounter) < height) {
    line.push(input[Math.floor(ycounter)][Math.floor(xcounter)]);
    linePointer.push({x: xcounter, y: ycounter});
    ycounter += yAfterCounter;
    xcounter += xAfterCounter;
  }

  return { line, linePointer};
}

const getDiagonals = (x: number, y: number, input:string[]): {visible: number, coords: any} => {
  const height = input.length;
  let coords = [];

  let visible = 0;

  let gradientOne = 1;
  let gradientTwo = 2;

  // Get the 1x1 gradient case out of the way
  let diagonal = getDiagonal(x, y, 1, 1, Angle.right, input);
  let right = calculateVisible(x, y, diagonal.line, diagonal.linePointer);
  visible += right.visible;
  coords.push(...right.coords);
  diagonal = getDiagonal(x, y, 1, 1, Angle.left, input);
  let left = calculateVisible(x, y, diagonal.line, diagonal.linePointer);
  visible += left.visible;
  coords.push(...left.coords);

  const alreadyUsedRatios = []

  // TODO: Not really sure what's the best number to loop over
  while (gradientOne < height) {
    gradientTwo = 1;
    while (gradientTwo < height) {
      if (gradientOne !== gradientTwo && !alreadyUsedRatios.includes(gradientOne/gradientTwo)) {
        alreadyUsedRatios.push(gradientOne/gradientTwo);

        diagonal = getDiagonal(x, y, gradientOne, gradientTwo, Angle.right, input);
        right = calculateVisible(x, y, diagonal.line, diagonal.linePointer);
        visible += right.visible;
        coords.push(...right.coords);

        diagonal = getDiagonal(x, y, gradientOne, gradientTwo, Angle.left, input);
        left = calculateVisible(x, y, diagonal.line, diagonal.linePointer);
        visible += left.visible;
        coords.push(...left.coords);

      }
      gradientTwo++;
    }
    gradientOne++;
  }

  return { visible, coords };
}

const getForCoord = (x: number, y: number, input: string[]): number => {
  const horizontal = getHorizontal(x, y, input);
  const vertical = getVertical(x, y, input);
  const diagonals = getDiagonals(x, y, input).coords.length;
  
  // TODO: this returns the correct answe rsometimes, othertimes its 1 too high
  return horizontal.visible + vertical.visible + diagonals;
}

const goA = (input: string[]): Coords => {
  let x = 0;
  let y = 0;
  let count = 0;

  input.forEach((string, yindex) => {
    const row = string.split('');
    row.forEach((r, xindex) => {
      if (r === ASTEROID) {
        const get = getForCoord(xindex, yindex, input);
        if (get > count) {
          count = get;
          x = xindex;
          y = yindex;
        } 
      }
    });
  })

  return {x, y, count};
}

const goB = (input) => {
  return
}

/* Tests */
const example = [
  '.#..#',
  '.....',
  '#####',
  '....#',
  '...##',
];
// test(getHorizontal(0, 1, ['.#..#']), {visible: 1});
// test(getHorizontal(0, 1, ['#####']), {visible: 2});
// test(getVertical(0, 1, example), {visible: 1});
// test(getVertical(4, 2, example), {visible: 2});
// test(getDiagonal(2, 2, 2, 2, Angle.right, example), ['.', '#', '#']); // Right gradient 2
// test(getDiagonal(2, 2, 1, 1, Angle.right, example), ['.', '.', '#', '.', '#']); // Right gradient 1
// test(getDiagonal(2, 2, 1, 2, Angle.right, example), ['#', '#', '#']); // Right gradient 1/2
// test(getDiagonal(2, 2, 1, 1, Angle.left, example), ['#', '.', '#', '.', '.']); // Left gradient 1
// test(getDiagonal(1, 2, 1, 1, Angle.right, example), ['.', '#', '.', '#']); // Right gradient 1

// test(getDiagonal(3, 4, 2, 4, Angle.right, example), {line: [''], linePointer: [{x: 1, y: 2}]}); // Right gradient 1

// test(getDiagonals(3, 4, example), { visible: 6});
// test(
//   calculateVisibleAndHidden(3, 4, ['#','#', '#'], [{ x: 1, y: 0 }, { x: 2, y: 2 }, { x: 3, y: 4 }]),
//   {visible: 1, hidden: 2, coords: [ { x: 2, y: 2 } ]})
test(getForCoord(3, 4, example), 8);

const exampleLetters = [
  '#.........',
  '...A......',
  '...B..a...',
  '.EDCG....a',
  '..F.c.b...',
  '.....c....',
  '..efd.c.gb',
  '.......c..',
  '....f...c.',
  '...e..d..c', 
];

// test(getDiagonal(0, 0, 1, 1, Angle.right, exampleLetters), ['#', '.', '.', 'C', 'c', 'c', 'c', 'c','c', 'c']);
// test(getDiagonal(0, 0, 1, 2, Angle.right, exampleLetters), ['#', '.', 'F', 'f', 'f']);
// test(getForCoord(0, 0, exampleLetters), )

const example2 = [
  '......#.#.',
  '#..#.#....',
  '..#######.',
  '.#.#.###..',
  '.#..#.....',
  '..#....#.#',
  '#..#....#.',
  '.##.#..###',
  '##...#..#.',
  '.#....####',
];
// test(getForCoord(5, 8, example2), 33);
test(goA(example2), {x: 5, y: 8, count: 33});

const example3 = [
  '#.#...#.#.',
'.###....#.',
'.#....#...',
'##.#.#.#.#',
'....#.#.#.',
'.##..###.#',
'..#...##..',
'..##....##',
'......#...',
'.####.###.',
]
// test(getForCoord(1, 2, example3), 35);
test(goA(example3), {x: 1, y: 2, count: 35});


// test(goA([
//   '.#..#',
//   '.....',
//   '#####',
//   '....#',
//   '...##',
// ]), {x: 3, y: 4, count: 7});

/* Results */

// console.time("Time")
const resultA = goA(input)
test(goA(input), {x:11, y:11, count: 221})
// const resultB = goB(input)
// console.timeEnd("Time")

console.log("Solution to part 1:", resultA)

// console.log("Solution to part 2:", resultB)
