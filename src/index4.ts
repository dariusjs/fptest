export function roundNumber(input: any): number {
  return Math.round(input * 10000) / 10000;
}

const x = roundNumber(5.555);
console.log(x);
