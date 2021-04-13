import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { chain, Either } from 'fp-ts/lib/Either';
import { map } from 'fp-ts/lib/ReadonlyRecord';

const houseSample1 = '100A';
const houseSample2 = '10-A';
const houseSample3 = '10 A';
const houseSample4 = '10/A';
const houseSample5 = '10-2';

function parseHouseNumber(input: any) {
  const houseNumber = input.match(/^\d+/g);
  const houseNumberExtra = input.match(/[a-zA-Z]/g);

  return {
    houseNumber: houseNumber ? parseFloat(houseNumber[0]) : 0,
    houseNumberAddition: houseNumberExtra ? houseNumberExtra[0] : ''
  };
}

console.log(parseHouseNumber(houseSample1));
console.log(parseHouseNumber(houseSample2));
console.log(parseHouseNumber(houseSample3));
console.log(parseHouseNumber(houseSample4));
console.log(parseHouseNumber(houseSample5));

const houseNumber = (input: string) => {
  const houseNumber = input.match(/^\d+/g);
  return houseNumber ? parseInt(houseNumber[0]) : 0;
};

const houseNumberPostfix = (input: string) => {
  const houseNumberExtra = input.match(/[a-zA-Z]|(\b \d+)|(\b-\d+)|(\b\.\d+)/g);
  return houseNumberExtra ? houseNumberExtra[0].replace(/(\W)/g, '') : null;
};

console.log(houseNumber('10A'));

console.log(houseNumberPostfix('10A'));
console.log(houseNumberPostfix('10-A'));
console.log(houseNumberPostfix('10\\A'));
console.log(houseNumberPostfix('10-30'));
console.log(houseNumberPostfix('10.300'));
console.log(houseNumberPostfix('10 300'));
console.log(houseNumberPostfix('10'));
