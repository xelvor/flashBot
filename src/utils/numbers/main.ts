export function splitNum(number: number, factor: number) {
    let results = [];
    while (number > factor) {
        results.push(factor);
        number -= factor;
    }
    if (number !== 0) {
        results.push(number);
    }
    return results;
}