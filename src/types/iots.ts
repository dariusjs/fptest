import { isNonEmpty } from 'fp-ts/lib/Array';
import { chain } from 'fp-ts/lib/Either';
import { fromArray, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { isNone } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as t from 'io-ts';
import { NumberFromString, NumberFromStringC } from 'io-ts-types';

export type ArrayFromObject<C extends t.Mixed> = t.Type<
  NonEmptyArray<t.TypeOf<C>>,
  Array<t.OutputOf<C>>,
  unknown
>;

export function ArrayFromObject<C extends t.Mixed>(
  codec: C,
  name = `NonEmptyArray<${codec.name}>`
): ArrayFromObject<C> {
  const arr = t.array(codec);
  return new t.Type(
    name,
    (u): u is NonEmptyArray<t.TypeOf<C>> => arr.is(u) && isNonEmpty(u),
    (u, c) => {
      u = Array.isArray(u) ? u : [u];
      return pipe(
        arr.validate(u, c),
        chain((as) => {
          const onea = fromArray(as);
          return isNone(onea) ? t.failure(u, c) : t.success(onea.value);
        })
      );
    },
    (nea) => arr.encode(nea)
  );
}

export const OverWriteEmptyObjectToZero: NumberFromStringC = new t.Type<
  number,
  string,
  unknown
>(
  'NumberFromString',
  t.number.is,
  (u, c) => {
    u = JSON.stringify(u) === JSON.stringify({}) ? '0' : u;
    return pipe(
      t.string.validate(u, c),
      chain((s) => {
        const n = +s;
        return isNaN(n) || s.trim() === '' ? t.failure(u, c) : t.success(n);
      })
    );
  },
  String
);
const Pets = t.type({
  animal: t.string,
  name: t.string
});

export const Metadata = t.type({
  age: t.union([NumberFromString, t.number, t.string]),
  healthy: t.string,
  pets: t.array(Pets)
});

export const Name = t.type({
  firstName: t.string,
  lastName: t.string
});

export const Person = t.type({
  name: Name,
  data: t.array(
    t.union([
      NumberFromString,
      OverWriteEmptyObjectToZero,
      t.number,
      t.string,
      t.object
    ])
  ),
  metadata: Metadata
});

export type PersonType = t.TypeOf<typeof Person>;
export type NameType = t.TypeOf<typeof Name>;
export type MetaDataType = t.TypeOf<typeof Metadata>;
export type PetsType = t.TypeOf<typeof Pets>;
