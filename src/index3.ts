import { either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

// // represents a Date from an ISO string
// const DateFromString = new t.Type(
//   'ArrayFromObject',
//   (u): u is Date => u instanceof Date,
//   (u, c) =>
//     either.chain(t.string.validate(u, c), (s) => {
//       const d = new Date(s);
//       return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
//     }),
//   (a) => a.toISOString()
// );

// const date = Date.now();
// DateFromString(date);

// represents a Date from an ISO string

// const filterCat = (s: any[]): any[] => s.filter((x) => x.animal === 'cat');
// const filterCat = (s: any[]): any[] => s.filter((x) => x.animal === 'cat');

// const ArrayFromObject = new t.Type(
//   'ArrayFromObject',
//   (u): u is [] => u instanceof Array,
//   (u, c) =>
//     either.chain(t.string.validate(u, c), (s) => {
//       const d = new Date(s);
//       return orderArray.Order instanceof Array
//         ? orderArray.Order
//         : [orderArray.Order];
//     }),
//   (a) => a.toISOString()
// );

const ArrayFromObject = new t.Type(
  'ArrayFromObject',
  (u): u is Array<any> => u instanceof Array,
  (u, c) =>
    // either.chain(t.string.validate(u, c), (s) => {
    //   const d = new Date(s);
    //   return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
    // }),
    either.chain(t.Array.validate(u, c), (s) => {
      //   const d = new Date(s);
      //   const d = s;
      return (s instanceof Array ? s : [s]) ? t.failure(u, c) : t.success(s);
    }),
  (a) => a
);

// const date = Date.now();
const data = { name: 'fred' };

ArrayFromObject(data);
