import { test, readInput } from "../utils/index"

const input: string[] = readInput().split('\n');

const getOrbitMap = (list: string[]): Object => {
    let orbitMap = {};
    list.forEach(l => {
        const planets = l.split(')');
        let orbitersOfA = orbitMap[planets[0]] || [];
        orbitersOfA.push(planets[1]);
        orbitMap[planets[0]] = orbitersOfA;
    });

    return orbitMap;
}

const getOrbitMapBothDirections = (list: string[]): Object => {
    let orbitMap = {};
    list.forEach(l => {
        const planets = l.split(')');
        let orbitersOfA = orbitMap[planets[0]] || [];
        orbitersOfA.push(planets[1]);
        orbitMap[planets[0]] = orbitersOfA;

        let orbitersOfB = orbitMap[planets[1]] || [];
        orbitersOfB.push(planets[0]);
        orbitMap[planets[1]] = orbitersOfB;
    });

    return orbitMap;
}

const getOrbits = (list: string[]): number => {
    const orbitMap = getOrbitMap(list);
    let orbits = 0;
    const planets = Object.keys(orbitMap);
    planets.forEach((planet) => {
        orbits += howManyChildren(orbitMap, planet);
    });
    return orbits;
};

const howManyChildren = (orbitMap, planet): number => {
    let howMany = 0;
    const children = orbitMap[planet];
    if (!children) {
        return howMany;
    }

    howMany += children.length;
    children.forEach((child) => {
        howMany += howManyChildren(orbitMap, child);
    })
    return howMany;
}

const getOrbitalTransfers = (list: string[], from: string, to: string): number => {
    const orbitMap = getOrbitMapBothDirections(list);
    const path = getPath(orbitMap, from, to, []);

    return path ? path.length - 3 : -100;
}

const getPath = (orbitMap, from: string, to: string, path: string[]): string[] | undefined => {
    path.push(from);
    let howMany = undefined;
    const planets = orbitMap[from];

    let newPath;
    if (!planets) {
        return undefined;
    } else if (planets.indexOf(to) > -1) {
        path.push(to);
        return path;
    } else {
        planets.forEach(planet => {
            if (path.indexOf(planet) > -1) {
                return;
            }

            const result = getPath(orbitMap, planet, to, path.slice());
            if (result !== undefined && result[result.length -1] === to) {
                if (!newPath || newPath.length > result.length) {
                    newPath = result;
                }
            }
        })
    }

    return newPath;
}

// Tests for #1
// test(getOrbits(['AAA)BBB']), 1);
// test(getOrbits(['AAA)BBB', 'BBB)CCC']), 3);
// test(getOrbits(['COM)B',
//     'B)C',
//     'C)D',
//     'D)E',
//     'E)F',
//     'B)G',
//     'G)H',
//     'D)I',
//     'E)J',   
//     'J)K',
//     'K)L']), 42);

// Tests for #2
// test(getOrbitalTransfers(['AAA)BBB', 'BBB)CCC', 'CCC)DDD'], 'AAA', 'DDD'), 1); // A -> B (->) C -> D 
// test(getOrbitalTransfers(['AAA)BBB', 'BBB)CCC', 'CCC)DDD', 'DDD)EEE'], 'AAA', 'EEE'), 2); // A -> B (->) C (->) D - >E
// test(getOrbitalTransfers(['COM)B',
// 'B)C',
// 'C)D',
// 'D)E',
// 'E)F',
// 'B)G',
// 'G)H',
// 'D)I',
// 'E)J',
// 'J)K',
// 'K)L',
// 'K)YOU',
// 'I)SAN'], 'YOU', 'SAN'), 4);

console.log(getOrbitalTransfers(input, 
    'YOU', 'SAN'));

// console.log(getOrbits(input));
