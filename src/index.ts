import { isRight } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import fs from 'fs';
import { DataType, Data } from './Data';

function calculate(a: number[]) {
  return a.reduce((accumulator: number, value: number) => accumulator + value);
}

function double(a: number) {
  return a * 2;
}

const file = fs.readFileSync('./src/input.json', 'utf8');
const data: DataType = JSON.parse(file) as DataType;

const validate = isRight(Data.decode(data));

if (validate == true) {
  const result = pipe(data.data, calculate, double);
  console.log(result);
} else {
  console.log('Invalid Data');
}
