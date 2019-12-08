import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input: string = prepareInput(readInput())

const goA = (input: string, width: number, height: number): number => {
  const layerSize = width * height;

  let smallestLayer = [];
  let smallestAmount = undefined;
  let index = 0;
  let layer = []

  while (index < input.length) {
    layer.push(input[index]);
    index++;

    if (layer.length === layerSize) {
      const numberOfZeros = layer.filter(l => parseInt(l, 10) === 0);
      if (smallestAmount === undefined || numberOfZeros.length < smallestAmount) {
        smallestAmount = numberOfZeros.length;
        smallestLayer = layer.slice();
      }
      layer = [];
    } 
  }

  const numberOfOnes = smallestLayer.filter(l => parseInt(l, 10) === 1);
  const numberOfTwos = smallestLayer.filter(l => parseInt(l, 10) === 2);

  return numberOfOnes.length * numberOfTwos.length;
}

const createAllTheLayers = (input: string, width: number, height: number): any => {
  const layerSize = width * height;

  let index = 0;
  let listOfLayers = []
  let layer = [];

  while (index < input.length) {
    layer.push(input[index]);
    index++;

    if (layer.length === layerSize) {
      listOfLayers.push(layer);
      layer = [];
    } 
  }
  return listOfLayers;
}

// Contains some code duplicated from A.
const goB = (input: string, width: number, height: number): number[] => {
  const allLayers = createAllTheLayers(input, width, height);
  const layerSize = allLayers.length;
  const pixels = width * height;
  const result = [];

  let pixelIndex = 0;
  while (pixelIndex < pixels) {
    let layerIndex = 0;
    loop:
    while (layerIndex < layerSize) {
      const color = parseInt(allLayers[layerIndex][pixelIndex], 10);
      if(color !== 2) {
        result.push(color);
        break loop;
      }
      layerIndex++;
    }
    pixelIndex++;
  }

  render(result, width);
  return result;
}

const render = (input: number[], width: number): void => {
  let index = 0;
  while (index < input.length) {
    if (input[index] === 0) {
      // Originally I put the character here since 0 = black but it was illegible
      process.stdout.write(' ');
    } else {
      process.stdout.write('*')
    }
    index++;

    if ((index) % width === 0) {
      console.log('');
    }
  }
};

/* Tests */
// test(goA('123456789012', 3, 2), 1);
// test(goB('0222112222120000', 2, 2), [0, 1, 1, 0]);

const resultA = goA(input, 25, 6);
const resultB = goB(input, 25, 6)
console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
