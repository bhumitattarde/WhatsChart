export function sortMap(map) {

    // sorts the map in descending order of values
    return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
};
