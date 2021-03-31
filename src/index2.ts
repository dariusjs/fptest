import * as L from 'monocle-ts/lib/Lens';
import { pipe } from 'fp-ts/lib/function';
import fs from 'fs';
import { DataType, Data } from './Data';
import { either as E } from 'fp-ts';
import { Lens } from 'monocle-ts';

function calculate(a: number[]) {
  return a.reduce((accumulator: number, value: number) => accumulator + value);
}

function double(a: number) {
  return a * 2;
}

function printer(x: any) {
  console.log(x);
}

const file = fs.readFileSync('./src/input.json', 'utf8');
const data: DataType = JSON.parse(file) as DataType;

const x: DataType = pipe(
  Data.decode(data),
  E.fold(
    (error: any) => {
      throw error;
    },
    (data: DataType) => {
      return data;
    }
  )
);
console.log(x);

const sum = pipe(x.data, calculate, double, double);
console.log('Total is:', sum);

const capitalize = (s: string): string =>
  s.substring(0, 1).toUpperCase() + s.substring(1);

const doubleUp = (s: number): number => s * 2;

const lensingIn = Lens.fromPath<DataType>()(['metadata', 'healthy']);
const lensCalc = lensingIn.modify(capitalize)(data);
console.log(lensCalc);

/**
 * New Syntax
 */

const lenseData1 = pipe(
  L.id<DataType>(),
  L.prop('metadata'),
  L.prop('healthy'),
  L.modify(capitalize)
);

console.log(JSON.stringify(lenseData1(data), null, 2));

const lenseData2 = pipe(
  L.id<DataType>(),
  L.prop('metadata'),
  L.prop('age'),
  L.modify(doubleUp)
);

console.log(JSON.stringify(lenseData2(data), null, 2));

const filterCat = (s: any[]): any[] => s.filter((x) => x.animal === 'cat');
const lenseData3 = pipe(
  L.id<DataType>(),
  L.prop('metadata'),
  L.prop('contents'),
  L.modify(filterCat)
);

console.log(JSON.stringify(lenseData3(data), null, 2));
