import { isNonEmpty } from 'fp-ts/lib/Array';
import { chain } from 'fp-ts/lib/Either';
import { fromArray, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { either as E } from 'fp-ts';
import { isNone } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as t from 'io-ts';
import { NumberFromString, NumberFromStringC } from 'io-ts-types';
import * as L from 'monocle-ts/lib/Lens';

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
  age: t.number,
  healthy: t.string,
  pets: t.array(Pets)
});

export const Attributes = t.type({
  firstName: t.string,
  lastName: t.string
});

export const Person = t.type({
  name: ArrayFromObject(Attributes),
  data: t.array(
    t.union([NumberFromString, OverWriteEmptyObjectToZero, t.number])
  ),
  metadata: Metadata
});

export type PersonType = t.TypeOf<typeof Person>;
export type AttributesType = t.TypeOf<typeof Attributes>;
export type MetaDataType = t.TypeOf<typeof Metadata>;
export type PetsType = t.TypeOf<typeof Pets>;

const data = {
  name: { firstName: 'John', lastName: 'Citizen' },
  data: ['5', '10', 5, {}],
  metadata: {
    age: 5,
    healthy: 'yes',
    pets: [
      { animal: 'cat', name: 'meowmix' },
      { animal: 'dog', name: 'woofy' },
      { animal: 'parrot', name: 'tweety' }
    ]
  }
};

const validate: PersonType = pipe(
  Person.decode(data),
  E.fold(
    (error: any) => {
      throw error;
    },
    (data: PersonType) => {
      return data;
    }
  )
);
console.log(JSON.stringify(validate, null, 2));

const filterCat = (s: any[]): any[] => s.filter((x) => x.animal === 'cat');
const lenseData3 = pipe(
  L.id<PersonType>(),
  L.prop('metadata'),
  L.prop('pets'),
  L.modify(filterCat)
);

const filteredData = pipe(lenseData3(validate));

console.log(JSON.stringify(filteredData, null, 2));
