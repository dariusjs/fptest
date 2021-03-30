import { isRight } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import fs from 'fs';
import { DataType, Data } from './Data';
import { either as E } from 'fp-ts';
import { make } from 'fp-ts/lib/Tree';

function calculate(a: number[]) {
  return a.reduce((accumulator: number, value: number) => accumulator + value);
}

function double(a: number) {
  return a * 2;
}

function validateData(data: DataType): DataType {
  if (isRight(Data.decode(data))) {
    return data;
  } else {
    throw Error('Invalid Data');
  }
}

const file = fs.readFileSync('./src/input.json', 'utf8');
const data: DataType = JSON.parse(file) as DataType;

const x = pipe(
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

const sum = pipe(x.data, calculate, double);
console.log('Total is:', sum);
